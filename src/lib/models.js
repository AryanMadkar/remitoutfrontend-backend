// lib/models.js (NEW FILE)
import mongoose from "mongoose";

// Import all models to register them
import Student from "./Student";
import Consultant from "./Consultant";
import Nbfc from "./Nbfc";
import Admin from "./Admin";
import WorkExperience from "./WorkExperience";

// Export for use in connectDB
export default {
  Student,
  Consultant,
  Nbfc,
  Admin,
  WorkExperience,
};
