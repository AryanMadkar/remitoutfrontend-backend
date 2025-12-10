// models/Student.js (UPDATE kycData section)

import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    phoneNumber: {
      type: String,
      trim: true,
    },

    // Invite flow fields
    inviteToken: {
      type: String,
      default: null,
    },
    inviteTokenExpiresAt: {
      type: Date,
      default: null,
    },
    registrationStatus: {
      type: String,
      enum: ["invited", "pending_phone_verification", "completed"],
      default: "completed",
    },

    // OTP fields
    emailOtp: String,
    emailOtpExpiresAt: Date,
    phoneOtpExpiresAt: Date,
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneOtpCode: {
      type: String,
      default: null,
    },
    questionnaire: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentQuestionnaire",
      default: null,
    },
    academicRecord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicRecord",
      default: null,
    },
    hasCompletedAcademicRecords: {
      type: Boolean,
      default: false,
    },
    phoneOtpMessageId: String,
    // In StudentSchema, add:

    // Consultant link
    consultant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Consultant",
      default: null,
    },

    createdByRole: {
      type: String,
      enum: ["student", "consultant", "admin", "nbfc"],
      default: "student",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "createdByRole",
      default: null,
    },

    kycStatus: {
      type: String,
      enum: ["pending", "verified", "rejected", "manual_review"],
      default: "pending",
    },

    kycVerifiedAt: Date,
    kycRejectedAt: Date,

    // ============================================================
    // UPDATED KYC DATA - Matches Python Server Response
    // ============================================================
    kycData: {
      // ===== AADHAAR DATA =====
      aadhaarNumber: String,
      aadhaarName: String,
      aadhaarDOB: String,
      aadhaarGender: String,
      aadhaarAddress: String,

      // ===== PAN DATA =====
      panNumber: String,
      panName: String,
      panDOB: String,
      panFatherName: String,

      // ===== PASSPORT DATA (Optional) =====
      passportNumber: String,
      passportName: String,
      passportDOB: String,
      passportIssueDate: String,
      passportExpiryDate: String,
      passportPlaceOfIssue: String,
      passportPlaceOfBirth: String,

      // ===== VERIFICATION METADATA =====
      verificationSource: {
        type: String,
        default: "aiextractiongroq",
      },
      lastVerifiedAt: Date,
      failureCount: {
        type: Number,
        default: 0,
      },
      failedAt: Date,

      // ===== EXTRACTED DATA (Full raw data from Python) =====
      extractedData: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },
      // Add this to your existing StudentSchema before export:
      workExperience: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkExperience",
        default: null,
      },
      hasCompletedWorkExperience: {
        type: Boolean,
        default: false,
      },

      // ===== CONFIDENCE & VERIFICATION =====
      verificationConfidence: {
        type: Number,
        min: 0,
        max: 100,
        default: 0,
      },
      verificationLevel: String, // "approved", "rejected", "needs_review"
      verificationReason: String,
      validationScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0,
      },

      // ===== EXTRACTION METADATA =====
      extractionMetadata: {
        processingTime: Number,
        totalAttempts: Number,
        extractionStatus: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
        modelUsed: String,
        verificationModel: String,
      },

      // ===== DOCUMENT COMPLETENESS =====
      documentCompleteness: {
        aadhaarFront: { type: Boolean, default: false },
        aadhaarBack: { type: Boolean, default: false },
        panFront: { type: Boolean, default: false },
        panBack: { type: Boolean, default: false },
        passport: { type: Boolean, default: false },
      },

      // ===== IDENTITY CONFIRMATION =====
      identityConfirmation: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
      },

      // ===== COMPLIANCE CHECKS =====
      complianceChecks: {
        nameMatch: { type: Boolean, default: false },
        dobMatch: { type: Boolean, default: false },
        genderMatch: { type: Boolean, default: false },
        documentFormatValid: { type: Boolean, default: false },
      },

      // ===== RISK ASSESSMENT =====
      riskAssessment: {
        overallRisk: {
          type: String,
          enum: ["low", "medium", "high"],
          default: "medium",
        },
        inconsistencyCount: {
          type: Number,
          default: 0,
        },
        qualityScore: {
          type: Number,
          min: 0,
          max: 1,
          default: 0,
        },
      },

      // ===== ISSUES =====
      validationIssues: [String],
      verificationIssues: [String],
    },
  },
  { timestamps: true }
);

// models/Student.js - Add indexes for performance

StudentSchema.index({ email: 1 });
StudentSchema.index({ consultant: 1 });
StudentSchema.index({ kycStatus: 1 });
StudentSchema.index({ registrationStatus: 1 });
StudentSchema.index({ createdAt: -1 });
StudentSchema.index({ isEmailVerified: 1, isPhoneVerified: 1 });

// Add soft delete field
StudentSchema.add({
  isActive: {
    type: Boolean,
    default: true,
  },
  deletedAt: Date,
});

export default mongoose.models.Student ||
  mongoose.model("Student", StudentSchema);
