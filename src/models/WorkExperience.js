// models/WorkExperience.js
import mongoose from "mongoose";

const WorkExperienceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // One-to-one relationship
      index: true,
    },
    // Extracted data from AI
    companyName: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    jobTitle: {
      type: String,
      trim: true,
      maxlength: 150,
    },
    employmentType: {
      type: String,
      enum: [
        "full_time",
        "part_time",
        "contract",
        "internship_paid",
        "internship_unpaid",
        "freelance",
        "volunteer",
        "temporary",
      ],
      default: "full_time",
    },
    startDate: String, // DD/MM/YYYY
    endDate: String, // DD/MM/YYYY
    currentlyWorking: {
      type: Boolean,
      default: false,
    },
    isPaid: {
      type: Boolean,
      default: true,
    },
    stipendAmount: {
      type: Number,
      min: 0,
    },
    salarySlips: [String], // Array of salary slip mentions
    extractionConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    documentQuality: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    // AI Verification Results
    verification: {
      valid: { type: Boolean, default: false },
      confidence: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "low",
      },
      reason: String,
      issues: [String],
      warnings: [String],
    },
    // Cloudinary Storage (Delete on reupload)
    cloudinaryFiles: [{
      public_id: String,
      url: String,
      filename: String,
      size_mb: Number,
    }],
    // Processing Status
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    processingTime: Number, // seconds
    notes: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

// Indexes for performance
WorkExperienceSchema.index({ student: 1 });
WorkExperienceSchema.index({ status: 1 });
WorkExperienceSchema.index({ "verification.confidence": 1 });
WorkExperienceSchema.index({ createdAt: -1 });
WorkExperienceSchema.index({ updatedAt: -1 });
WorkExperienceSchema.index({ deletedAt: -1 });
WorkExperienceSchema.index({ isActive: 1 });

export default mongoose.models.WorkExperience || 
  mongoose.model("WorkExperience", WorkExperienceSchema);
