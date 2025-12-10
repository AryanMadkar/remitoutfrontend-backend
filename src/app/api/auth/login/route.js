// app/api/auth/login/route.js

import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db";

import Student from "@/models/Student";
import Admin from "@/models/Admin";
import Nbfc from "@/models/Nbfc";
import Consultant from "@/models/Consultant";

import { loginSchema } from "@/lib/validation";

import {
  signAuthToken,
  AUTH_COOKIE_NAME,
  AUTH_COOKIE_MAX_AGE,
} from "@/lib/auth";

import { errorResponse } from "@/lib/api-response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getRedirectPathForRole(role) {
  switch (role) {
    case "student":
      return "/student";
    case "admin":
      return "/admin/dashboard";
    case "nbfc":
      return "/nbfc/dashboard";
    case "consultant":
      return "/consultant/dashboard";
    default:
      return "/login"; // your login page route
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse("Validation failed", 400, parsed.error.flatten());
    }

    const { email, password } = parsed.data;

    await connectDB();

    // Try all roles by email
    const candidates = [
      { role: "student", Model: Student },
      { role: "admin", Model: Admin },
      { role: "nbfc", Model: Nbfc },
      { role: "consultant", Model: Consultant },
    ];

    let user = null;
    let role = null;

    for (const entry of candidates) {
      const found = await entry.Model.findOne({ email });
      if (found) {
        user = found;
        role = entry.role;
        break;
      }
    }

    if (!user || !role) {
      return errorResponse("Invalid credentials", 401);
    }

    // Extra check for students: must verify email + phone
    if (
      role === "student" &&
      (!user.isEmailVerified || !user.isPhoneVerified)
    ) {
      return errorResponse(
        "Please verify your email and phone before logging in",
        403
      );
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return errorResponse("Invalid credentials", 401);
    }

    // IMPORTANT: pass an object, not positional args
    const token = signAuthToken({ userId: user._id, role });

    const res = NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: {
          role,
          redirectPath: getRedirectPathForRole(role),
        },
      },
      { status: 200 }
    );

    res.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: AUTH_COOKIE_MAX_AGE,
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("Internal server error", 500);
  }
}
