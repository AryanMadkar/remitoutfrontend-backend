// app/api/auth/student/send-phone-otp/route.js

import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

import { sendSmsOtpWithGetOtp } from "@/lib/getotp";
import { generateNumericOtp, getOtpExpiry } from "@/lib/otp";
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

    if (!student.isEmailVerified) {
      return errorResponse("Please verify your email first", 403);
    }

    if (student.isPhoneVerified) {
      return errorResponse("Phone already verified", 400);
    }

    if (!student.phoneNumber) {
      return errorResponse("Phone number not found", 400);
    }

    let messageId = null;

    if (process.env.NODE_ENV === "development") {
      // Dev: generate a local OTP and log it
      const devOtp = generateNumericOtp(6);
      console.log(
        `[DEV] SMS OTP for ${student.phoneNumber} (send-phone-otp):`,
        devOtp
      );

      student.phoneOtpCode = devOtp;
      student.phoneOtpExpiresAt = getOtpExpiry(10);
      student.phoneOtpMessageId = null;
    } else {
      // Prod: Send OTP via GetOTP
      const otpResponse = await sendSmsOtpWithGetOtp(student.phoneNumber);

      // Store message ID and expiry
      messageId = otpResponse.data?.message_id || null;
      student.phoneOtpMessageId = messageId;
      student.phoneOtpExpiresAt = getOtpExpiry(10);

      // In prod, we don't store the actual code; GetOTP handles that
      student.phoneOtpCode = null;
    }

    await student.save();

    return NextResponse.json({
      success: true,
      message: "OTP sent to your phone number",
      data: {
        messageId: student.phoneOtpMessageId,
      },
    });
  } catch (error) {
    console.error("Send phone OTP error:", error);
    return errorResponse("Failed to send OTP. Please try again.", 500);
  }
}
