// models/Admin.js
import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema(
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
    role: {
      type: String,
      default: 'admin',
      immutable: true,
    },
  },
  { timestamps: true }
);

AdminSchema.index({ email: 1 }, { unique: true });
AdminSchema.index({ role: 1 });
AdminSchema.index({ createdAt: -1 });
AdminSchema.index({ updatedAt: -1 });
AdminSchema.index({ deletedAt: -1 });
AdminSchema.index({ isActive: 1 });


export default mongoose.models.Admin || mongoose.model('Admin', AdminSchema);
