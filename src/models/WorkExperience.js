// models/WorkExperience.js
import mongoose from "mongoose";

const employmentTypeEnum = [
  "full_time",
  "part_time",
  "internship_paid",
  "internship_unpaid",
  "freelance",
  "contract",
  "temporary",
  "volunteer",
  "apprenticeship",
  "self_employed",
  "other",
];

const salarySlipSchema = new mongoose.Schema(
  {
    month: {
      type: String,
      enum: [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
      ],
      required: true,
    },
    year: {
      type: Number,
      min: 2000,
      max: () => new Date().getFullYear() + 1,
      required: true,
    },
    documentUrl: {
      type: String,
      required: true,
    },
    aiExtractedSalary: {
      type: Number,
      min: 0,
      default: null,
    },
    extractionConfidence: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.5,
    },
    extractedAt: {
      type: Date,
      default: Date.now,
    },
    extractionStatus: {
      type: String,
      enum: ["pending", "success", "failed", "manual_review"],
      default: "pending",
    },
  },
  { _id: true }
);

const workExperienceSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true, // One work experience record per student
      index: true,
    },

    // ===== FRESHER STATUS (NEW) =====
    isFresher: {
      type: Boolean,
      default: false,
    },

    // If isFresher is true, the following fields are optional/ignored
    experiences: [
      {
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
          enum: employmentTypeEnum,
          default: "full_time",
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
          default: null,
        },
        currentlyWorking: {
          type: Boolean,
          default: false,
        },
        monthsWorked: {
          type: Number,
          min: 0,
          default: 0,
        },
        isPaid: {
          type: Boolean,
          default: true,
        },
        stipendAmount: {
          type: Number,
          min: 0,
          default: null,
        },
        experienceLetterUrl: {
          type: String,
        },
        offerLetterUrl: {
          type: String,
          default: null,
        },
        joiningLetterUrl: {
          type: String,
          default: null,
        },
        employeeIdCardUrl: {
          type: String,
          default: null,
        },
        salarySlips: {
          type: [salarySlipSchema],
          default: [],
        },
        verified: {
          type: Boolean,
          default: false,
        },
        verificationNotes: {
          type: String,
          default: null,
        },
        verificationConfidence: {
          type: Number,
          min: 0,
          max: 1,
          default: 0.5,
        },
        extractedData: {
          type: mongoose.Schema.Types.Mixed,
          select: false,
        },
        extractionStatus: {
          type: String,
          enum: ["pending", "success", "failed", "manual_review"],
          default: "pending",
        },
        extractedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Overall verification
    overallVerificationStatus: {
      type: String,
      enum: ["pending", "partial", "complete", "manual_review"],
      default: "pending",
    },
    lastVerifiedAt: Date,
    totalExperienceYears: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
workExperienceSchema.index({ student: 1 });
workExperienceSchema.index({ isFresher: 1 });
workExperienceSchema.index({ "experiences.verified": 1 });
workExperienceSchema.index({ "experiences.employmentType": 1 });
workExperienceSchema.index({ overallVerificationStatus: 1 });

// Virtual for total experience
workExperienceSchema.virtual("experienceYears").get(function () {
  if (this.isFresher) return 0;
  return Math.round((this.totalExperienceYears) * 100) / 100;
});

// Method to calculate total experience
workExperienceSchema.methods.calculateTotalExperience = function () {
  if (this.isFresher) {
    this.totalExperienceYears = 0;
    return 0;
  }

  let totalMonths = 0;
  this.experiences.forEach((exp) => {
    if (exp.startDate) {
      const end = exp.currentlyWorking || !exp.endDate ? new Date() : exp.endDate;
      const start = exp.startDate;
      const months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth());
      exp.monthsWorked = Math.max(0, Math.round(months));
      totalMonths += exp.monthsWorked;
    }
  });

  this.totalExperienceYears = totalMonths / 12;
  return this.totalExperienceYears;
};

// Method to update verification status
workExperienceSchema.methods.updateVerificationStatus = function () {
  if (this.isFresher) {
    this.overallVerificationStatus = "complete";
    this.lastVerifiedAt = new Date();
    return;
  }

  const verifiedCount = this.experiences.filter((exp) => exp.verified).length;
  const totalCount = this.experiences.length;

  if (verifiedCount === 0) {
    this.overallVerificationStatus = "pending";
  } else if (verifiedCount < totalCount) {
    this.overallVerificationStatus = "partial";
  } else {
    this.overallVerificationStatus = "complete";
  }

  this.lastVerifiedAt = new Date();
};

// Pre-save hook
workExperienceSchema.pre("save", async function () {
  if (
    this.isNew ||
    this.isModified("experiences") ||
    this.isModified("isFresher")
  ) {
    this.calculateTotalExperience();
    this.updateVerificationStatus();
  }
});

export default mongoose.models.WorkExperience ||
  mongoose.model("WorkExperience", workExperienceSchema);
