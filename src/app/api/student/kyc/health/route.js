// app/api/student/kyc/health/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import { errorResponse, successResponse } from "@/lib/api-response";

const AI_SERVER_URL = process.env.AI_SERVER_URL || "http://localhost:5001";

export async function GET() {
  try {
    const response = await axios.get(`${AI_SERVER_URL}/health`, {
      timeout: 5000,
    });

    return successResponse(
      {
        aiServerStatus: "healthy",
        aiServerData: response.data,
      },
      "AI server is healthy"
    );
  } catch (error) {
    return errorResponse(
      "AI server is unavailable",
      503,
      {
        error: error.message,
        aiServerUrl: AI_SERVER_URL,
      }
    );
  }
}
