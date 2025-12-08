// models/Consultant.js
import mongoose from "mongoose";

const ConsultantSchema = new mongoose.Schema(
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
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    phoneNumber: {
      type: String,
      trim: true,
      sparse: true,
      maxlength: 15,
    },
    studentCount: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    registrationStatus: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
    deletedAt: Date,
  },
  { timestamps: true }
);

ConsultantSchema.index({ email: 1 }, { unique: true });
ConsultantSchema.index({ phoneNumber: 1 }, { sparse: true, unique: true });
ConsultantSchema.index({ isActive: 1, registrationStatus: 1 });
ConsultantSchema.index({ createdAt: -1 });

export default mongoose.models.Consultant || 
  mongoose.model("Consultant", ConsultantSchema);
