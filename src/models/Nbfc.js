// models/Nbfc.js
import mongoose from 'mongoose';

const NbfcSchema = new mongoose.Schema(
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
    organizationName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      default: 'nbfc',
      immutable: true,
    },
  },
  { timestamps: true }
);

NbfcSchema.index({ email: 1 }, { unique: true });
NbfcSchema.index({ organizationName: 1 });


export default mongoose.models.Nbfc || mongoose.model('Nbfc', NbfcSchema);
