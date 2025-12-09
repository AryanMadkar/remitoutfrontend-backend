// app/api/student/questionnaire/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import StudentQuestionnaire from "@/models/StudentQuestionnaire";
import { getAuthFromCookies } from "@/lib/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";
import { z } from "zod";

// Validation schema
const educationPlanSchema = z.object({
  targetCountry: z.string().min(1, "Target country is required"),
  degreeType: z.string().min(1, "Degree type is required"),
  courseDuration: z.string().min(1, "Course duration is required"),
  university: z.string().optional(),
  program: z.string().optional(),
  intakeYear: z.string().min(1, "Intake year is required"),
  loanAmount: z.string().min(1, "Loan amount is required"),
  currency: z.string().default("USD"),
  includeLivingExpenses: z.boolean().default(true),
});

// GET - Fetch existing questionnaire for logged-in student
export async function GET(request) {
  try {
    await connectDB();

    // Get authenticated user
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return errorResponse("Student not found", 404);
    }

    // Check if questionnaire exists
    let questionnaire = await StudentQuestionnaire.findOne({
      student: studentId,
    });

    if (!questionnaire) {
      return successResponse(
        { exists: false, data: null },
        "No questionnaire found"
      );
    }

    return successResponse(
      {
        exists: true,
        data: questionnaire,
        hasCompleted: student.hasCompletedQuestionnaire,
      },
      "Questionnaire retrieved successfully"
    );
  } catch (error) {
    console.error("GET Questionnaire Error:", error);
    return errorResponse("Failed to fetch questionnaire", 500, error.message);
  }
}

// POST - Create or update questionnaire
export async function POST(request) {
  try {
    await connectDB();

    // Get authenticated user
    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const body = await request.json();

    // Validate input
    const validation = educationPlanSchema.safeParse(body);
    if (!validation.success) {
      return errorResponse(
        "Validation failed",
        400,
        validation.error.format()
      );
    }

    const data = validation.data;

    // Find student
    const student = await Student.findById(studentId);
    if (!student) {
      return errorResponse("Student not found", 404);
    }

    // Check if questionnaire already exists and is completed
    let questionnaire = await StudentQuestionnaire.findOne({
      student: studentId,
    });

    if (questionnaire && questionnaire.isCompleted) {
      return errorResponse(
        "Questionnaire already completed. Cannot modify.",
        403
      );
    }

    // Prepare questionnaire data
    const questionnaireData = {
      student: studentId,
      personalInfo: {
        fullName: student.firstName
          ? `${student.firstName} ${student.lastName || ""}`.trim()
          : "",
        email: student.email || "",
        phoneNumber: student.phoneNumber || "",
        city: "",
        referralCode: "",
        howDidYouFindUs: "",
      },
      courseDetails: {
        targetCountry: data.targetCountry,
        degreeType: data.degreeType,
        courseDuration: data.courseDuration,
        university: data.university || "",
        program: data.program || "",
        intakeYear: data.intakeYear,
        loanAmount: data.loanAmount,
        currency: data.currency,
        includeLivingExpenses: data.includeLivingExpenses,
      },
      isCompleted: true,
      completedAt: new Date(),
      lastUpdatedSection: "courseDetails",
    };

    if (!questionnaire) {
      // Create new questionnaire
      questionnaire = new StudentQuestionnaire(questionnaireData);
      await questionnaire.save();

      // Update student reference
      student.questionnaire = questionnaire._id;
      student.hasCompletedQuestionnaire = true;
      await student.save();

      return successResponse(
        questionnaire,
        "Questionnaire created successfully",
        201
      );
    } else {
      // Update existing questionnaire
      Object.assign(questionnaire, questionnaireData);
      await questionnaire.save();

      // Update student flag
      if (!student.hasCompletedQuestionnaire) {
        student.hasCompletedQuestionnaire = true;
        await student.save();
      }

      return successResponse(
        questionnaire,
        "Questionnaire updated successfully",
        200
      );
    }
  } catch (error) {
    console.error("POST Questionnaire Error:", error);

    // Handle duplicate key error
    if (error.code === 11000) {
      return errorResponse("Questionnaire already exists for this student", 409);
    }

    return errorResponse("Failed to save questionnaire", 500, error.message);
  }
}

// PUT - Update specific section (partial update)
export async function PUT(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const body = await request.json();
    const { section, data } = body;

    if (!section || !data) {
      return errorResponse("Section and data are required", 400);
    }

    // Find questionnaire
    const questionnaire = await StudentQuestionnaire.findOne({
      student: studentId,
    });

    if (!questionnaire) {
      return errorResponse("Questionnaire not found", 404);
    }

    if (questionnaire.isCompleted) {
      return errorResponse(
        "Questionnaire already completed. Cannot modify.",
        403
      );
    }

    // Update specific section
    questionnaire[section] = data;
    questionnaire.lastUpdatedSection = section;
    await questionnaire.save();

    return successResponse(
      questionnaire,
      `${section} updated successfully`,
      200
    );
  } catch (error) {
    console.error("PUT Questionnaire Error:", error);
    return errorResponse("Failed to update questionnaire", 500, error.message);
  }
}

// DELETE - Delete questionnaire (optional, for testing)
export async function DELETE(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;

    // Delete questionnaire
    const result = await StudentQuestionnaire.findOneAndDelete({
      student: studentId,
    });

    if (!result) {
      return errorResponse("Questionnaire not found", 404);
    }

    // Update student reference
    await Student.findByIdAndUpdate(studentId, {
      questionnaire: null,
      hasCompletedQuestionnaire: false,
    });

    return successResponse(null, "Questionnaire deleted successfully", 200);
  } catch (error) {
    console.error("DELETE Questionnaire Error:", error);
    return errorResponse("Failed to delete questionnaire", 500, error.message);
  }
}
