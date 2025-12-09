// app/api/auth/student/resend-email-otp/route.js

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

import { generateNumericOtp, getOtpExpiry } from "@/lib/otp";
import { sendStudentEmailOtp } from "@/lib/mailer";
import { errorResponse } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return errorResponse("Email is required", 400);
    }

    await connectDB();

    const student = await Student.findOne({ email });

    if (!student) {
      return errorResponse("Student not found", 404);
    }

    if (student.isEmailVerified) {
      return errorResponse("Email already verified", 400);
    }

    // Generate new OTP
    const emailOtp = generateNumericOtp(6);
    const emailOtpExpiresAt = getOtpExpiry(10);

    student.emailOtp = emailOtp;
    student.emailOtpExpiresAt = emailOtpExpiresAt;
    await student.save();

    // Send OTP (dev: console, prod: email)
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] Resend Email OTP for ${email}:`, emailOtp);
    } else {
      await sendStudentEmailOtp(email, emailOtp);
    }

    return NextResponse.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    console.error("Resend email OTP error:", error);
    return errorResponse("Failed to resend OTP", 500);
  }
}
