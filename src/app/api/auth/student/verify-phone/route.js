// app/api/auth/student/verify-phone/route.js

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

import { verifySmsOtpWithGetOtp } from "@/lib/getotp";
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

    if (!student.isEmailVerified) {
      return errorResponse("Please verify your email first", 403);
    }

    if (student.isPhoneVerified) {
      return errorResponse("Phone already verified", 400);
    }

    // Check OTP expiry
    if (new Date() > student.phoneOtpExpiresAt) {
      return errorResponse("OTP has expired", 400);
    }

    if (process.env.NODE_ENV === "development") {
      // Dev: verify against locally stored OTP
      if (student.phoneOtpCode !== otp) {
        return errorResponse("Invalid OTP", 400);
      }
    } else {
      // Prod: verify via GetOTP service
      const verificationResult = await verifySmsOtpWithGetOtp({ code: otp });
      if (!verificationResult) {
        return errorResponse("Invalid OTP", 400);
      }
    }

    // Mark phone as verified
    student.isPhoneVerified = true;
    student.phoneOtpCode = null;
    student.phoneOtpMessageId = null;
    student.phoneOtpExpiresAt = null;

    await student.save();

    return NextResponse.json({
      success: true,
      message: "Phone verified successfully. You can now login.",
      data: {
        nextStep: "login",
      },
    });
  } catch (error) {
    console.error("Phone verification error:", error);
    return errorResponse("Internal server error", 500);
  }
}
