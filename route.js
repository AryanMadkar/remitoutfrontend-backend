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

    // Find bachelor/masters from higherEducation
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

    const formData = await request.formData();
    const graduationFile = formData.get("graduation");

    if (!graduationFile) {
      return errorResponse("Graduation document is required", 400);
    }

    console.log("📤 Forwarding graduation document to AI server...");

    // Send to AI server
    let aiResponse;
    try {
      aiResponse = await axios.post(
        `${AI_SERVER_URL}/api/extract/sync`,
        {
          class10: "",
          class12: "",
          graduation_pdf: `uploaded_${graduationFile.name}`,
          certificates: [],
        },
        {
          timeout: 120000,
        }
      );
    } catch (aiError) {
      console.error("❌ AI Server Error:", aiError.message);
      return errorResponse(
        "Failed to process graduation document",
        503
      );
    }

    const aiResult = aiResponse.data;
    const higherEducationData = aiResult.data?.payload?.higherEducation;

    if (!higherEducationData || higherEducationData.length === 0) {
      return errorResponse("No graduation data extracted", 500);
    }

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
      },
      "Graduation document processed successfully",
      200
    );
  } catch (error) {
    console.error("POST Graduation Error:", error);
    return errorResponse("Failed to process graduation document", 500, error.message);
  }
}
