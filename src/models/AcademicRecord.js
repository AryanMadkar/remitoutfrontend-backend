// models/AcademicRecord.js
import mongoose from "mongoose";

const marksheetSchema = new mongoose.Schema(
  {
    documentUrl: { type: String, required: true },
    institutionName: { type: String },
    boardUniversity: { type: String },
    yearOfPassing: { type: Number },
    percentage: { type: Number, min: 0, max: 100 },
    cgpa: { type: Number, min: 0, max: 10 },
    grade: { type: String },
    extractionStatus: {
      type: String,
      enum: ["success", "failed", "manual_review", "pending"],
      default: "pending",
    },
    extractionConfidence: { type: Number, min: 0, max: 1, default: 0 },
    extractedAt: { type: Date, default: Date.now },
    extractedData: {
      type: Object,
      select: false, // Won't be returned in queries by default
    },
    verificationReason: String,
  },
  { _id: true }
);

const class10Schema = new mongoose.Schema(
  {
    marksheets: [marksheetSchema],
    isVerified: { type: Boolean, default: false },
    verificationNotes: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const class12Schema = new mongoose.Schema(
  {
    marksheets: [marksheetSchema],
    stream: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationNotes: String,
    lastUpdated: { type: Date, default: Date.now },
  },
  { _id: false }
);

const higherEducationSchema = new mongoose.Schema(
  {
    educationType: {
      type: String,
      required: true,
      enum: [
        "diploma",
        "associate",
        "bachelor",
        "bachelors",
        "postgraduate_diploma",
        "master",
        "masters",
        "phd",
        "doctorate",
        "certificate",
        "professional",
        "vocational",
        "other",
      ],
    },
    courseName: { type: String, required: true },
    specialization: String,
    duration: String,
    marksheets: [marksheetSchema],
    isVerified: { type: Boolean, default: false },
    verificationNotes: String,
    addedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const academicRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },
    class10: class10Schema,
    class12: class12Schema,
    higherEducation: [higherEducationSchema],
    overallVerificationStatus: {
      type: String,
      enum: ["pending", "partial", "complete", "manual_review"],
      default: "pending",
    },
    lastVerifiedAt: Date,
  },
  { timestamps: true }
);

// Indexes
academicRecordSchema.index({ student: 1 });
academicRecordSchema.index({ "higherEducation.educationType": 1 });
academicRecordSchema.index({ overallVerificationStatus: 1 });

// Methods
academicRecordSchema.methods.updateVerificationStatus = function () {
  const hasClass10 = this.class10?.isVerified;
  const hasClass12 = this.class12?.isVerified;
  const hasHigherEd = this.higherEducation.some((edu) => edu.isVerified);

  if (hasClass10 && hasClass12 && hasHigherEd) {
    this.overallVerificationStatus = "complete";
  } else if (hasClass10 || hasClass12 || hasHigherEd) {
    this.overallVerificationStatus = "partial";
  } else {
    this.overallVerificationStatus = "pending";
  }

  this.lastVerifiedAt = new Date();
};

export default mongoose.models.AcademicRecord ||
  mongoose.model("AcademicRecord", academicRecordSchema);
