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

    personalInfo: {
      fullName: { type: String, default: "" },
      email: { type: String, default: "" },
      phoneNumber: { type: String, default: "" },
      city: { type: String, default: "" },
      referralCode: { type: String, default: "" },
      howDidYouFindUs: { type: String, default: "" }, // dropdown
    },

    courseDetails: {
      targetCountries: { type: [String], default: [] }, // multi‑select
      degreeTypes: { type: [String], default: [] }, // Bachelors / Masters / Others
      courseDurationMonths: { type: Number, default: null }, // 12 / 24 / 36 / 42
    },

    // You can extend these sections with more fields as you add more question cards
    academicDetails: {
      data: { type: Schema.Types.Mixed, default: {} },
    },

    coBorrowerInfo: {
      data: { type: Schema.Types.Mixed, default: {} },
    },

    documentUpload: {
      data: { type: Schema.Types.Mixed, default: {} },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.StudentQuestionnaire ||
  mongoose.model("StudentQuestionnaire", StudentQuestionnaireSchema);
