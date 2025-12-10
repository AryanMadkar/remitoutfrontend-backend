// app/api/student/work/health/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const WORK_AI_SERVER_URL = process.env.WORK_AI_SERVER_URL || "http://localhost:5003";

export async function GET(request) {
  try {
    const response = await axios.get(`${WORK_AI_SERVER_URL}/api/health`, {
      timeout: 5000,
    });

    if (response.status === 200) {
      return NextResponse.json({
        success: true,
        message: "Work AI server is healthy",
        data: response.data,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Work AI server returned unexpected status",
        status: response.status,
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Work AI Server Health Check Failed:", error.message);

    return NextResponse.json(
      {
        success: false,
        message: "Work AI server is unavailable",
        error: error.code || error.message,
        serverUrl: WORK_AI_SERVER_URL,
      },
      { status: 503 }
    );
  }
}
