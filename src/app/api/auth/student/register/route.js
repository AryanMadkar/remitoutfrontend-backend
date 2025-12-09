// app/api/auth/student/register/route.js

import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/db";
import Student from "@/models/Student";

import { studentRegisterSchema } from "@/lib/validation";
import { sendStudentEmailOtp } from "@/lib/mailer";
import { sendSmsOtpWithGetOtp } from "@/lib/getotp";
import { generateNumericOtp, getOtpExpiry } from "@/lib/otp";
import { successResponse, errorResponse } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Rate limiting helper (implement with redis in production)
const registrationAttempts = new Map();

function checkRateLimit(email) {
  const now = Date.now();
  const attempts = registrationAttempts.get(email) || [];
  const recentAttempts = attempts.filter((time) => now - time < 60000); // 1 minute window

  if (recentAttempts.length >= 3) {
    return false; // Too many attempts
  }

  recentAttempts.push(now);
  registrationAttempts.set(email, recentAttempts);
  return true;
}

export async function POST(req) {
  try {
    const body = await req.json();

    // 1) Validate input
    const parsed = studentRegisterSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const { email, password, firstName, lastName, phoneNumber } = parsed.data;

    // Rate limiting check
    if (!checkRateLimit(email)) {
      return errorResponse(
        "Too many registration attempts. Please try again in 1 minute.",
        429
      );
    }

    // 2) DB connect
    await connectDB();

    // 3) Prevent duplicate email (single query for efficiency)
    const existing = await Student.findOne({
      $or: [{ email }, { phoneNumber }],
    }).select("email phoneNumber");

    if (existing) {
      if (existing.email === email) {
        return errorResponse("Email is already registered as a student", 409);
      }

      if (existing.phoneNumber === phoneNumber) {
        return errorResponse(
          "Phone number is already registered for another student",
          409
        );
      }
    }

    // 4) Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const emailOtp = generateNumericOtp(6);
    const otpExpiry = getOtpExpiry(10);

    // 5) Send email OTP (non-blocking in production - use queue)
    try {
      if (process.env.NODE_ENV === "development") {
        console.log(`[DEV] Email OTP for ${email}:`, emailOtp);
      } else {
        await sendStudentEmailOtp(email, emailOtp);
      }
    } catch (err) {
      console.error("Email OTP error:", err);
      return errorResponse(
        "Failed to send email OTP. Please try again later.",
        502
      );
    }

    // 6) Send SMS OTP
    let smsData;
    let phoneOtpCode = null;

    try {
      if (process.env.NODE_ENV === "development") {
        phoneOtpCode = generateNumericOtp(6);
        console.log(`[DEV] SMS OTP for ${phoneNumber}:`, phoneOtpCode);
        smsData = {
          expire_date: otpExpiry.toISOString(),
          message_id: `mock_sms_${Date.now()}`,
        };
      } else {
        // Production: use GetOTP
        smsData = await sendSmsOtpWithGetOtp(phoneNumber);
      }
    } catch (err) {
      console.error("SMS OTP error:", err);
      return errorResponse(
        "Failed to send SMS OTP. Please check your phone number and try again.",
        502
      );
    }

    const phoneOtpMessageId = smsData?.message_id || null;

    // 7) Create student with proper defaults
    const student = await Student.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phoneNumber: phoneNumber.trim(),

      emailOtp,
      emailOtpExpiresAt: otpExpiry,

      phoneOtpCode, // only non-null in development
      phoneOtpExpiresAt: smsData?.expire_date
        ? new Date(smsData.expire_date)
        : otpExpiry,

      isEmailVerified: false,
      isPhoneVerified: false,
      phoneOtpMessageId,

      registrationStatus: "pending_phone_verification",
    });

    console.log(
      `[AUDIT] Student registered: ${student._id} (${student.email})`
    );

    // 8) Return safe response (no sensitive data)
    return successResponse(
      {
        studentId: String(student._id),
        email: student.email,
        requiresVerification: true,
      },
      "Student registered. OTPs sent to email and phone.",
      201
    );
  } catch (error) {
    console.error("Student registration error:", error);

    // Handle specific MongoDB errors
    if (error.code === 11000) {
      // Duplicate key error
      const field = Object.keys(error.keyPattern)[0];
      return errorResponse(
        `This ${field} is already registered. Please use a different ${field}.`,
        409
      );
    }

    return errorResponse("Internal server error", 500);
  }
}
