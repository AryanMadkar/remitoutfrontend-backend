// app/api/student/academic/class12/route.js
import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import AcademicRecord from "@/models/AcademicRecord";
import { getAuthFromCookies } from "@/lib/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";

const AI_SERVER_URL = process.env.ACADEMIC_AI_SERVER_URL || "http://localhost:5002";

// GET - Check if Class 12 already exists
export async function GET(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const academicRecord = await AcademicRecord.findOne({ student: studentId });

    if (!academicRecord || !academicRecord.class12) {
      return successResponse(
        { exists: false, data: null },
        "No Class 12 record found"
      );
    }

    return successResponse(
      {
        exists: true,
        data: academicRecord.class12,
        canSubmit: !academicRecord.class12.isVerified,
      },
      "Class 12 record retrieved successfully"
    );
  } catch (error) {
    console.error("GET Class 12 Error:", error);
    return errorResponse("Failed to fetch Class 12 record", 500, error.message);
  }
}

// POST - Submit Class 12 marksheet
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
        "Please submit Class 10 marksheet first",
        400
      );
    }

    if (existingRecord?.class12?.isVerified) {
      return errorResponse(
        "⛔ Class 12 record already verified! You cannot resubmit.",
        403
      );
    }

    // Parse form data
    const formData = await request.formData();
    const class12File = formData.get("class12");

    if (!class12File) {
      return errorResponse("Class 12 marksheet is required", 400);
    }

    // Validate file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(class12File.type)) {
      return errorResponse("Invalid file type. Only JPG, PNG, and PDF allowed", 400);
    }

    if (class12File.size > 10 * 1024 * 1024) {
      return errorResponse("File too large. Maximum size is 10MB", 400);
    }

    console.log("📤 Forwarding Class 12 marksheet to AI server...");

    // Create FormData for Python Flask server
    const pythonFormData = new FormData();
    const buffer = Buffer.from(await class12File.arrayBuffer());
    
    pythonFormData.append("class12", buffer, {
      filename: class12File.name,
      contentType: class12File.type,
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
          class12: uploadedPaths.class12 || "",
          graduation_pdf: "",
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

    const class12Data = extractionResult.data?.payload?.class12;

    if (!class12Data) {
      return errorResponse("No Class 12 data extracted", 500);
    }

    console.log("📊 Extracted Class 12 data:", class12Data);

    // Update database
    existingRecord.class12 = class12Data;
    existingRecord.updateVerificationStatus();
    await existingRecord.save();

    console.log(`✅ Class 12 record saved for student ${studentId}`);

    return successResponse(
      {
        class12: existingRecord.class12,
        overallStatus: existingRecord.overallVerificationStatus,
        extractionSummary: extractionResult.summary,
      },
      "Class 12 marksheet processed successfully",
      200
    );
  } catch (error) {
    console.error("POST Class 12 Error:", error);
    return errorResponse("Failed to process Class 12 marksheet", 500, error.message);
  }
}
