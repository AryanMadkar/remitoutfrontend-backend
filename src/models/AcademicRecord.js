// models/AcademicRecord.js
import mongoose from "mongoose";

const MarksheetSchema = new mongoose.Schema({
  institutionName: String,
  boardUniversity: String,
  university: String,
  yearOfPassing: Number,
  percentage: { type: Number, min: 0, max: 100 },
  cgpa: { type: Number, min: 0, max: 10 },
  grade: String,
  degree: String,
  specialization: String,
  stream: String,
  subjects: [String],
}, { _id: false });

const AcademicRecordSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // Keep this, remove schema.index()
      // Remove index: true
    },
    stream: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "Other"],
      default: "Science",
    },
    courseName: String,
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    class10: MarksheetSchema,
    class12: MarksheetSchema,
    graduation: MarksheetSchema,
    postgraduation: MarksheetSchema,
    diploma: MarksheetSchema,
    verification: {
      valid: { type: Boolean, default: false },
      confidence: {
        type: String,
        enum: ["high", "medium", "low"],
        default: "low",
      },
      issues: [String],
    },
    extractionConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0,
    },
    processingTime: Number,
    requestId: String,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Remove the duplicate index line below
// AcademicRecordSchema.index({ student: 1 }, { unique: true });

AcademicRecordSchema.index({ status: 1 });
AcademicRecordSchema.index({ createdAt: -1 });

export default mongoose.models.AcademicRecord || 
  mongoose.model("AcademicRecord", AcademicRecordSchema);