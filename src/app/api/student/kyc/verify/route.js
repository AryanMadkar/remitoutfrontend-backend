// app/api/student/kyc/verify/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { getAuthFromCookies } from "@/lib/auth-server";
import { errorResponse, successResponse } from "@/lib/api-response";
import axios from "axios";
import FormData from "form-data";

const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:5001";

// POST - Process KYC Documents
export async function POST(request) {
  try {
    await connectDB();

    // Get authenticated user
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return errorResponse("Student not found", 404);
    }

    // ========== STRICT KYC CHECK - Can only be done ONCE ==========
    if (student.kycStatus === "verified") {
      return errorResponse(
        "⛔ KYC Already Verified! You cannot submit KYC documents again. Your identity has already been verified.",
        403,
        {
          currentStatus: student.kycStatus,
          verifiedAt: student.kycVerifiedAt,
          message: "KYC verification can only be done once per account.",
        }
      );
    }

    if (student.kycStatus === "manual_review") {
      return errorResponse(
        "⏳ KYC Under Manual Review! Your documents are currently being reviewed by our team. Please wait for the review to complete.",
        403,
        {
          currentStatus: student.kycStatus,
          message:
            "Cannot resubmit while documents are under manual review.",
        }
      );
    }

    // Only allow resubmission if status is 'pending' or 'rejected'
    if (
      student.kycStatus !== "pending" &&
      student.kycStatus !== "rejected"
    ) {
      return errorResponse(
        `Cannot submit KYC. Current status: ${student.kycStatus}`,
        403
      );
    }

    // Parse multipart form data
    const formData = await request.formData();

    // Required documents
    const requiredDocs = ["aadhaar_front", "aadhaar_back", "pan_front"];
    const optionalDocs = ["pan_back", "passport"];

    // Validate required documents
    for (const docType of requiredDocs) {
      if (!formData.get(docType)) {
        return errorResponse(
          `Missing required document: ${docType}`,
          400,
          { requiredDocuments: requiredDocs }
        );
      }
    }

    console.log("📤 Forwarding documents to AI server...");

    // Create FormData for AI server
    const aiFormData = new FormData();

    // Add all documents to FormData
    for (const docType of [...requiredDocs, ...optionalDocs]) {
      const file = formData.get(docType);
      if (file) {
        const buffer = Buffer.from(await file.arrayBuffer());
        aiFormData.append(docType, buffer, {
          filename: file.name,
          contentType: file.type,
        });
      }
    }

    // Send to AI server
    let aiResponse;
    try {
      aiResponse = await axios.post(
        `${AI_SERVER_URL}/api/kyc/process`,
        aiFormData,
        {
          headers: {
            ...aiFormData.getHeaders(),
          },
          timeout: 120000, // 2 minutes
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      console.log("✅ AI server response received");
    } catch (aiError) {
      console.error("❌ AI server error:", aiError.message);

      // Check if AI server is down
      if (aiError.code === "ECONNREFUSED") {
        return errorResponse(
          "AI processing server is unavailable. Please try again later.",
          503,
          { error: "AI server connection refused" }
        );
      }

      return errorResponse(
        "Failed to process KYC documents with AI server",
        500,
        {
          error: aiError.response?.data?.error || aiError.message,
        }
      );
    }

    const kycResult = aiResponse.data;

    // Check if AI processing was successful
    if (kycResult.error) {
      return errorResponse(
        "AI processing failed",
        400,
        {
          aiError: kycResult.error,
          details: kycResult,
        }
      );
    }

    // Update student with KYC data
    student.kycStatus = kycResult.kycStatus || "manual_review";
    student.kycData = kycResult.kycData || {};

    if (kycResult.kycStatus === "verified") {
      student.kycVerifiedAt = new Date(kycResult.kycVerifiedAt);
    } else if (kycResult.kycStatus === "rejected") {
      student.kycRejectedAt = new Date(kycResult.kycRejectedAt);
    }

    // Save student
    await student.save();

    console.log(`✅ KYC data saved for student: ${studentId}`);
    console.log(`📊 KYC Status: ${student.kycStatus}`);

    return successResponse(
      {
        kycStatus: student.kycStatus,
        kycData: student.kycData,
        kycVerifiedAt: student.kycVerifiedAt,
        kycRejectedAt: student.kycRejectedAt,
        processingTime: kycResult.processingTime,
        summary: kycResult.summary,
      },
      "KYC documents processed successfully",
      200
    );
  } catch (error) {
    console.error("❌ KYC Verification Error:", error);
    return errorResponse(
      "Failed to process KYC verification",
      500,
      error.message
    );
  }
}

// GET - Check KYC Status
export async function GET(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const student = await Student.findById(auth.userId).select(
      "kycStatus kycVerifiedAt kycRejectedAt kycData"
    );

    if (!student) {
      return errorResponse("Student not found", 404);
    }

    return successResponse(
      {
        kycStatus: student.kycStatus,
        kycVerifiedAt: student.kycVerifiedAt,
        kycRejectedAt: student.kycRejectedAt,
        canSubmit: ["pending", "rejected"].includes(student.kycStatus),
        hasKycData: !!student.kycData && Object.keys(student.kycData).length > 0,
      },
      "KYC status retrieved successfully",
      200
    );
  } catch (error) {
    console.error("❌ Get KYC Status Error:", error);
    return errorResponse("Failed to get KYC status", 500, error.message);
  }
}
