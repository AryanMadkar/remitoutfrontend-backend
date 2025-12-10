// app/api/student/work/fresher/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import WorkExperience from "@/models/WorkExperience";
import { getAuthFromCookies } from "@/lib/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";

// GET - Check fresher status
export async function GET(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const workExperience = await WorkExperience.findOne({ student: studentId });

    if (!workExperience) {
      return successResponse(
        { exists: false, isFresher: null },
        "No work experience record found"
      );
    }

    return successResponse(
      {
        exists: true,
        isFresher: workExperience.isFresher,
        experienceCount: workExperience.experiences?.length || 0,
        totalYears: workExperience.totalExperienceYears || 0,
      },
      "Work experience status retrieved"
    );
  } catch (error) {
    console.error("GET Fresher Status Error:", error);
    return errorResponse("Failed to fetch fresher status", 500, error.message);
  }
}

// POST - Set fresher status
export async function POST(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const body = await request.json();
    const isFresher = body.isFresher === true;

    const student = await Student.findById(studentId);
    if (!student) {
      return errorResponse("Student not found", 404);
    }

    // Create or update work experience record
    let workExperience = await WorkExperience.findOne({ student: studentId });

    if (!workExperience) {
      workExperience = new WorkExperience({
        student: studentId,
        isFresher: isFresher,
        experiences: [],
        overallVerificationStatus: isFresher ? "complete" : "pending",
      });
    } else {
      workExperience.isFresher = isFresher;
      if (isFresher) {
        workExperience.experiences = []; // Clear experiences if fresher
        workExperience.overallVerificationStatus = "complete";
      }
    }

    await workExperience.save();

    // Update student reference
    if (!student.workExperience) {
      student.workExperience = workExperience._id;
    }

    if (isFresher) {
      student.hasCompletedWorkExperience = true;
    }

    await student.save();

    return successResponse(
      {
        isFresher: workExperience.isFresher,
        workExperienceId: workExperience._id,
        status: workExperience.overallVerificationStatus,
      },
      isFresher
        ? "✅ Marked as fresher successfully"
        : "Status updated, please add work experience",
      200
    );
  } catch (error) {
    console.error("POST Fresher Status Error:", error);
    return errorResponse("Failed to update fresher status", 500, error.message);
  }
}
