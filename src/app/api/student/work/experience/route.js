// app/api/student/work/experience/route.js
import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import { connectDB } from "@/lib/db";
import Student from "@/models/Student";
import WorkExperience from "@/models/WorkExperience";
import { getAuthFromCookies } from "@/lib/auth-server";
import { successResponse, errorResponse } from "@/lib/api-response";

const WORK_AI_SERVER_URL = process.env.WORK_AI_SERVER_URL || "http://localhost:5004";

// GET - Check existing work experiences
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
        { exists: false, data: null },
        "No work experience record found"
      );
    }

    return successResponse(
      {
        exists: true,
        isFresher: workExperience.isFresher,
        experiences: workExperience.experiences,
        totalYears: workExperience.totalExperienceYears,
        overallStatus: workExperience.overallVerificationStatus,
      },
      "Work experience retrieved successfully"
    );
  } catch (error) {
    console.error("GET Work Experience Error:", error);
    return errorResponse("Failed to fetch work experience", 500, error.message);
  }
}

// Update route.js - Replace POST handler (around line 50)
export async function POST(request) {
  try {
    await connectDB();

    const auth = await getAuthFromCookies();
    if (!auth || auth.role !== "student") {
      return errorResponse("Unauthorized", 401);
    }

    const studentId = auth.userId;
    const student = await Student.findById(studentId);

    if (!student) {
      return errorResponse("Student not found", 404);
    }

    // Check if work experience exists
    let workExperience = await WorkExperience.findOne({ student: studentId });

    // Check if fresher
    if (workExperience?.isFresher) {
      return errorResponse(
        "⛔ You are marked as a fresher. Cannot add work experience.",
        403
      );
    }

    // Parse form data
    const formData = await request.formData();
    const workDocuments = [];

    // Collect all uploaded files
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        console.log(`📎 File: ${key} - ${value.name} (${value.size} bytes)`);
        workDocuments.push({ key, file: value });
      }
    }

    if (workDocuments.length === 0) {
      return errorResponse("No work experience documents uploaded", 400);
    }

    console.log(`📁 Total files: ${workDocuments.length}`);

    // Validate file types and sizes
    for (const doc of workDocuments) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(doc.file.type)) {
        return errorResponse(
          `Invalid file type for ${doc.file.name}. Only JPG, PNG, and PDF allowed`,
          400
        );
      }

      if (doc.file.size > 10 * 1024 * 1024) {
        return errorResponse(
          `File ${doc.file.name} is too large. Maximum size is 10MB`,
          400
        );
      }
    }

    console.log(`📤 Forwarding to AI server: ${WORK_AI_SERVER_URL}/api/extract/sync`);

    // Create FormData for Python Flask server
    const pythonFormData = new FormData();

    for (const doc of workDocuments) {
      const buffer = Buffer.from(await doc.file.arrayBuffer());
      pythonFormData.append(doc.key, buffer, {
        filename: doc.file.name,
        contentType: doc.file.type,
      });
    }

    // Call AI extraction endpoint
    let extractionResponse;
    try {
      extractionResponse = await axios.post(
        `${WORK_AI_SERVER_URL}/api/extract/sync`,
        pythonFormData,
        {
          headers: {
            ...pythonFormData.getHeaders(),
          },
          timeout: 180000, // 3 minutes
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log("✅ AI extraction completed");
    } catch (extractError) {
      console.error("❌ AI Extraction Error:", extractError.message);

      if (extractError.code === "ECONNREFUSED") {
        return errorResponse(
          "⚠️ Work experience AI server is unavailable. Please ensure server is running.",
          503
        );
      }

      return errorResponse(
        "Work AI extraction failed",
        500,
        extractError.response?.data?.message || extractError.message
      );
    }

    const extractionResult = extractionResponse.data;
    console.log("📊 Extraction Result Structure:", JSON.stringify(extractionResult, null, 2));

    if (extractionResult.status !== "success") {
      return errorResponse(
        "Work AI extraction failed",
        500,
        extractionResult.message || "Unknown error"
      );
    }

    // ✅ FIXED: Extract work experiences from correct path
    // The result structure is: extractionResult.result.result.work_experiences
    const resultData = extractionResult.result?.result || extractionResult.result || {};
    const workExperiencesArray = resultData.work_experiences || [];

    console.log("📋 Work experiences array:", workExperiencesArray);

    if (!Array.isArray(workExperiencesArray) || workExperiencesArray.length === 0) {
      console.error("⚠️ No work experience data found in result");
      console.error("Result structure:", JSON.stringify(extractionResult, null, 2));
      
      return errorResponse(
        "No work experience data could be extracted from documents. Please ensure documents are clear and contain employment information.",
        422
      );
    }

    // ✅ FIXED: Transform each work experience correctly
    const transformedExperiences = workExperiencesArray.map((workExp) => {
      console.log("🔄 Processing work experience:", JSON.stringify(workExp, null, 2));
      
      // Extract the actual extracted_data object
      const extractedData = workExp.extracted_data || {};
      const verification = workExp.verification || {};
      const documentInfo = workExp.document || {};
      
      console.log("   - Extracted data:", extractedData);
      console.log("   - Verification:", verification);
      
      // ✅ FIXED: Get data from the correct nested structure
      const companyName = extractedData.company_name || "";
      const jobTitle = extractedData.job_title || "";
      const employmentType = extractedData.employment_type || "full_time";
      const startDate = extractedData.start_date || null;
      const endDate = extractedData.end_date || null;
      const currentlyWorking = extractedData.currently_working || false;
      const isPaid = extractedData.is_paid !== undefined ? extractedData.is_paid : true;
      const stipendAmount = extractedData.stipend_amount || null;
      
      console.log(`   ✅ Mapped: ${companyName} - ${jobTitle}`);
      
      return {
        companyName: companyName,
        jobTitle: jobTitle,
        employmentType: employmentType,
        startDate: startDate,
        endDate: endDate,
        currentlyWorking: currentlyWorking,
        isPaid: isPaid,
        stipendAmount: stipendAmount,
        experienceLetterUrl: documentInfo.filename || "",
        offerLetterUrl: null,
        verified: verification.valid || false,
        verificationConfidence: extractedData.extraction_confidence || 0.5,
        extractedData: extractedData, // Store full extracted data
        extractionStatus: "success",
        extractedAt: new Date(),
      };
    });

    console.log("✅ Transformed experiences:", JSON.stringify(transformedExperiences, null, 2));

    // Validate transformed data
    const validExperiences = transformedExperiences.filter(
      exp => exp.companyName && exp.jobTitle
    );

    if (validExperiences.length === 0) {
      console.error("❌ No valid experiences after transformation");
      console.error("Transformed data:", transformedExperiences);
      
      return errorResponse(
        "Could not extract valid company name and job title from documents",
        422
      );
    }

    console.log(`✅ ${validExperiences.length} valid experience(s) ready to save`);

    // Create or update work experience record
    if (!workExperience) {
      console.log("📝 Creating new work experience record...");
      workExperience = new WorkExperience({
        student: studentId,
        isFresher: false,
        experiences: validExperiences,
        overallVerificationStatus: "partial",
      });
    } else {
      console.log("📝 Updating existing work experience record...");
      workExperience.experiences.push(...validExperiences);
      workExperience.calculateTotalExperience();
      workExperience.updateVerificationStatus();
    }

    await workExperience.save();
    console.log("✅ Work experience saved to database");

    // Update student reference
    if (!student.workExperience) {
      student.workExperience = workExperience._id;
    }

    student.hasCompletedWorkExperience = true;
    await student.save();
    console.log("✅ Student record updated");

    // Get statistics
    const stats = resultData.statistics || {};

    return successResponse(
      {
        experiences: workExperience.experiences,
        totalYears: workExperience.totalExperienceYears,
        experienceCount: workExperience.experiences.length,
        overallStatus: workExperience.overallVerificationStatus,
        extractionSummary: stats,
      },
      "Work experience processed successfully",
      200
    );
  } catch (error) {
    console.error("❌ POST Work Experience Error:", error);
    console.error("Error stack:", error.stack);
    return errorResponse("Failed to process work experience", 500, error.message);
  }
}