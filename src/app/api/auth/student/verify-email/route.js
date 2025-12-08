// app/api/auth/student/verify-email/route.js

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import { errorResponse } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return errorResponse("Email and OTP are required", 400);
    }

    await connectDB();

    const student = await Student.findOne({ email });

    if (!student) {
      return errorResponse("Student not found", 404);
    }

    if (student.isEmailVerified) {
      return errorResponse("Email already verified", 400);
    }

    // Check OTP expiry
    if (new Date() > student.emailOtpExpiresAt) {
      return errorResponse("OTP has expired", 400);
    }

    // Verify OTP
    if (student.emailOtp !== otp) {
      return errorResponse("Invalid OTP", 400);
    }

    // Mark email as verified
    student.isEmailVerified = true;
    student.emailOtp = null;
    student.emailOtpExpiresAt = null;
    await student.save();

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      data: {
        nextStep: "verify-phone",
      },
    });
  } catch (error) {
    console.error("Email verification error:", error);
    return errorResponse("Internal server error", 500);
  }
}
