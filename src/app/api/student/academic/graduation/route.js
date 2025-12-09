// app/api/student/academic/graduation/route.js
import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import AcademicRecord from "@/models/AcademicRecord";
import { getAuthFromCookies } from "@/lib/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";

const AI_SERVER_URL = process.env.ACADEMIC_AI_SERVER_URL || "http://localhost:5002";

// GET - Check if graduation already exists
export async function GET(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const academicRecord = await AcademicRecord.findOne({ student: studentId });

    if (!academicRecord || !academicRecord.higherEducation?.length) {
      return successResponse(
        { exists: false, data: null },
        "No graduation record found"
      );
    }

    const graduation = academicRecord.higherEducation.find(
      (edu) => ["bachelor", "bachelors", "master", "masters"].includes(edu.educationType)
    );

    return successResponse(
      {
        exists: !!graduation,
        data: graduation || null,
        canSubmit: !graduation?.isVerified,
      },
      "Graduation record retrieved successfully"
    );
  } catch (error) {
    console.error("GET Graduation Error:", error);
    return errorResponse("Failed to fetch graduation record", 500, error.message);
  }
}

// POST - Submit graduation documents
export async function POST(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const existingRecord = await AcademicRecord.findOne({ student: studentId });

    if (!existingRecord) {
      return errorResponse(
        "Please submit Class 10 and 12 marksheets first",
        400
      );
    }

    if (!existingRecord.class10 || !existingRecord.class12) {
      return errorResponse(
        "Please complete Class 10 and 12 before submitting graduation",
        400
      );
    }

    // Parse form data
    const formData = await request.formData();
    const graduationFile = formData.get("graduation");

    if (!graduationFile) {
      return errorResponse("Graduation document is required", 400);
    }

    // Validate file (must be PDF for graduation)
    if (graduationFile.type !== "application/pdf") {
      return errorResponse("Graduation document must be a PDF file", 400);
    }

    if (graduationFile.size > 10 * 1024 * 1024) {
      return errorResponse("File too large. Maximum size is 10MB", 400);
    }

    console.log("📤 Forwarding graduation document to AI server...");

    // Create FormData for Python Flask server
    const pythonFormData = new FormData();
    const buffer = Buffer.from(await graduationFile.arrayBuffer());
    
    pythonFormData.append("graduation", buffer, {
      filename: graduationFile.name,
      contentType: graduationFile.type,
    });

    // Upload to AI server
    let uploadResponse;
    try {
      uploadResponse = await axios.post(
        `${AI_SERVER_URL}/api/upload`,
        pythonFormData,
        {
          headers: {
            ...pythonFormData.getHeaders(),
          },
          timeout: 120000,
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log("✅ Files uploaded to AI server");
    } catch (uploadError) {
      console.error("❌ AI Server Upload Error:", uploadError.message);
      return errorResponse(
        "Failed to upload to AI server",
        503
      );
    }

    const uploadResult = uploadResponse.data;
    const uploadedPaths = uploadResult.uploaded_files;

    // Call extraction endpoint
    let extractionResponse;
    try {
      extractionResponse = await axios.post(
        `${AI_SERVER_URL}/api/extract/sync`,
        {
          class10: "",
          class12: "",
          graduation_pdf: uploadedPaths.graduation_pdf || "",
          certificates: [],
          use_groq_verifier: false,
        },
        {
          timeout: 120000,
        }
      );

      console.log("✅ AI extraction completed");
    } catch (extractError) {
      console.error("❌ AI Extraction Error:", extractError.message);
      return errorResponse("AI extraction failed", 500);
    }

    const extractionResult = extractionResponse.data;

    if (extractionResult.status !== "success") {
      return errorResponse("AI extraction failed", 500);
    }

    const higherEducationData = extractionResult.data?.payload?.higherEducation;

    if (!higherEducationData || higherEducationData.length === 0) {
      return errorResponse("No graduation data extracted", 500);
    }

    console.log("📊 Extracted graduation data:", higherEducationData);

    // Add to higherEducation array
    existingRecord.higherEducation.push(...higherEducationData);
    existingRecord.updateVerificationStatus();
    await existingRecord.save();

    // Mark student as completed
    const student = await Student.findById(studentId);
    if (student && !student.hasCompletedAcademicRecords) {
      student.hasCompletedAcademicRecords = true;
      await student.save();
    }

    console.log(`✅ Graduation record saved for student ${studentId}`);

    return successResponse(
      {
        higherEducation: existingRecord.higherEducation,
        overallStatus: existingRecord.overallVerificationStatus,
        extractionSummary: extractionResult.summary,
      },
      "Graduation document processed successfully",
      200
    );
  } catch (error) {
    console.error("POST Graduation Error:", error);
    return errorResponse("Failed to process graduation document", 500, error.message);
  }
}
