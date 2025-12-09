// models/StudentQuestionnaire.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const StudentQuestionnaireSchema = new Schema(
  {
    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // one questionnaire per student
      index: true,
    },

    // Personal Information
    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
      city: { type: String, default: "" },
      referralCode: { type: String, default: "" },
      howDidYouFindUs: { type: String, default: "" },
    },

    // Course/Education Details
    courseDetails: {
      targetCountry: { type: String, default: "" },
      degreeType: { type: String, default: "" },
      courseDuration: { type: String, default: "" },
      university: { type: String, default: "" },
      program: { type: String, default: "" },
      intakeYear: { type: String, default: "" },
      loanAmount: { type: String, default: "" },
      currency: { type: String, default: "USD" },
      includeLivingExpenses: { type: Boolean, default: true },
    },

    // Academic Details (extensible)
    academicDetails: {
      data: { type: Schema.Types.Mixed, default: {} },
    },

    // Co-Borrower Information
    coBorrowerInfo: {
      data: { type: Schema.Types.Mixed, default: {} },
    },

    // Document Upload
    documentUpload: {
      data: { type: Schema.Types.Mixed, default: {} },
    },

    // Completion Status
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
      default: null,
    },

    // Track last updated section
    lastUpdatedSection: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
StudentQuestionnaireSchema.index({ student: 1, isCompleted: 1 });

export default mongoose.models.StudentQuestionnaire ||
  mongoose.model("StudentQuestionnaire", StudentQuestionnaireSchema);
