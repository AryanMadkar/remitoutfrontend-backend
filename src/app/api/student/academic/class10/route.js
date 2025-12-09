// app/api/student/academic/class10/route.js
import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import AcademicRecord from "@/models/AcademicRecord";
import { getAuthFromCookies } from "@/lib/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";

const AI_SERVER_URL = process.env.ACADEMIC_AI_SERVER_URL || "http://localhost:5002";

// GET - Check if Class 10 already exists
export async function GET(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const student = await Student.findById(studentId);
    
    if (!student) {
      return errorResponse("Student not found", 404);
    }

    const academicRecord = await AcademicRecord.findOne({ student: studentId });

    if (!academicRecord || !academicRecord.class10) {
      return successResponse(
        { exists: false, data: null },
        "No Class 10 record found"
      );
    }

    return successResponse(
      {
        exists: true,
        data: academicRecord.class10,
        canSubmit: !academicRecord.class10.isVerified,
      },
      "Class 10 record retrieved successfully"
    );
  } catch (error) {
    console.error("GET Class 10 Error:", error);
    return errorResponse("Failed to fetch Class 10 record", 500, error.message);
  }
}

// POST - Submit Class 10 marksheet
export async function POST(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const student = await Student.findById(studentId);

    if (!student) {
      return errorResponse("Student not found", 404);
    }

    // Check if already submitted and verified
    const existingRecord = await AcademicRecord.findOne({ student: studentId });
    if (existingRecord?.class10?.isVerified) {
      return errorResponse(
        "⛔ Class 10 record already verified! You cannot resubmit.",
        403
      );
    }

    // Parse form data from frontend
    const formData = await request.formData();
    const class10File = formData.get("class10");

    if (!class10File) {
      return errorResponse("Class 10 marksheet is required", 400);
    }

    // Validate file
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(class10File.type)) {
      return errorResponse("Invalid file type. Only JPG, PNG, and PDF allowed", 400);
    }

    if (class10File.size > 10 * 1024 * 1024) {
      return errorResponse("File too large. Maximum size is 10MB", 400);
    }

    console.log("📤 Forwarding Class 10 marksheet to AI server...");

    // Create FormData for Python Flask server
    const pythonFormData = new FormData();
    const buffer = Buffer.from(await class10File.arrayBuffer());
    
    pythonFormData.append("class10", buffer, {
      filename: class10File.name,
      contentType: class10File.type,
    });

    // Send to Python Flask AI server - /api/upload endpoint
    let aiResponse;
    try {
      aiResponse = await axios.post(
        `${AI_SERVER_URL}/api/upload`,
        pythonFormData,
        {
          headers: {
            ...pythonFormData.getHeaders(),
          },
          timeout: 120000, // 2 minutes
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log("✅ Files uploaded to AI server:", aiResponse.data);
    } catch (aiError) {
      console.error("❌ AI Server Upload Error:", aiError.message);
      
      if (aiError.code === "ECONNREFUSED") {
        return errorResponse(
          "⚠️ AI processing server is unavailable. Please try again later.",
          503
        );
      }

      return errorResponse(
        "Failed to upload to AI server",
        500,
        aiError.message
      );
    }

    // Now call the extraction endpoint with the uploaded file paths
    const uploadResult = aiResponse.data;
    
    if (uploadResult.status !== "success") {
      return errorResponse(
        "File upload to AI server failed",
        500,
        uploadResult.message
      );
    }

    const uploadedPaths = uploadResult.uploaded_files;

    console.log("🔍 Requesting AI extraction...");

    // Call the sync extraction endpoint
    let extractionResponse;
    try {
      extractionResponse = await axios.post(
        `${AI_SERVER_URL}/api/extract/sync`,
        {
          class10: uploadedPaths.class10 || "",
          class12: "",
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
      return errorResponse(
        "AI extraction failed",
        500,
        extractError.message
      );
    }

    const extractionResult = extractionResponse.data;

    if (extractionResult.status !== "success") {
      return errorResponse(
        "AI extraction failed",
        500,
        extractionResult.message || "Unknown error"
      );
    }

    // Extract Class 10 data from AI result
    const class10Data = extractionResult.data?.payload?.class10;

    if (!class10Data) {
      return errorResponse(
        "No Class 10 data extracted from document",
        500
      );
    }

    console.log("📊 Extracted Class 10 data:", class10Data);

    // Create or update academic record in MongoDB
    let academicRecord = existingRecord;

    if (!academicRecord) {
      academicRecord = new AcademicRecord({
        student: studentId,
        class10: class10Data,
        overallVerificationStatus: "partial",
      });
    } else {
      academicRecord.class10 = class10Data;
      academicRecord.updateVerificationStatus();
    }

    await academicRecord.save();

    // Update student reference
    if (!student.academicRecord) {
      student.academicRecord = academicRecord._id;
      await student.save();
    }

    console.log(`✅ Class 10 record saved for student ${studentId}`);

    return successResponse(
      {
        class10: academicRecord.class10,
        overallStatus: academicRecord.overallVerificationStatus,
        extractionSummary: extractionResult.summary,
      },
      "Class 10 marksheet processed successfully",
      200
    );
  } catch (error) {
    console.error("POST Class 10 Error:", error);
    return errorResponse("Failed to process Class 10 marksheet", 500, error.message);
  }
}
