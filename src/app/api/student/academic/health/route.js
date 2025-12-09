// app/api/student/academic/health/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const AI_SERVER_URL = process.env.ACADEMIC_AI_SERVER_URL || "http://localhost:5002";

export async function GET(request) {
  try {
    // Check AI server health
    const response = await axios.get(`${AI_SERVER_URL}/api/health`, {
      timeout: 5000,
    });

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: "Academic AI server is healthy",
        data: response.data,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Academic AI server returned unexpected status",
        status: response.status,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Academic AI Server Health Check Failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Academic AI server is unavailable",
        error: error.code || error.message,
        serverUrl: AI_SERVER_URL,
      },
      { status: 503 }
    );
  }
}
