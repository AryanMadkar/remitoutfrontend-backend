// app/student/application/work/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  Plus,
  Trash2,
  Upload,
  Calendar,
  Building2,
  CheckCircle,
  AlertCircle,
  Loader2,
  XCircle,
  UserCheck,
} from "lucide-react";
import axios from "@/lib/axios";

export default function WorkExperiencePage() {
  const router = useRouter();

  const [isFresher, setIsFresher] = useState(false);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      experienceLetter: null,
      offerLetter: null,
      salarySlips: [],
    },
  ]);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [aiServerHealth, setAiServerHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(true);
  const [existingData, setExistingData] = useState(null);

  useEffect(() => {
    checkExistingData();
    checkAiServerHealth();
  }, []);

  const checkAiServerHealth = async () => {
    try {
      const response = await axios.get("/api/student/work/health");
      setAiServerHealth(response.data.success);
      console.log(
        "🏥 Work AI Server Health:",
        response.data.success ? "Online" : "Offline"
      );
    } catch (err) {
      setAiServerHealth(false);
      console.error("Work AI server health check failed:", err);
    } finally {
      setCheckingHealth(false);
    }
  };

  const checkExistingData = async () => {
    try {
      const response = await axios.get("/api/student/work/experience");
      if (response.data.success && response.data.data.exists) {
        setExistingData(response.data.data);
        setIsFresher(response.data.data.isFresher);
      }
    } catch (err) {
      console.error("Error checking existing work experience:", err);
    }
  };

  const handleFresherToggle = async (checked) => {
    setIsFresher(checked);
    setError("");
    setSuccess("");

    if (checked) {
      try {
        setUploading(true);
        const response = await axios.post("/api/student/work/fresher", {
          isFresher: true,
        });

        if (response.data.success) {
          setSuccess("✅ Successfully marked as fresher!");
          // Go to next step (Admission Letters)
          setTimeout(() => {
            router.push("/student/application/admission");
          }, 2000);
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to update fresher status"
        );
        setIsFresher(false);
      } finally {
        setUploading(false);
      }
    }
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        experienceLetter: null,
        offerLetter: null,
        salarySlips: [],
      },
    ]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const handleFileSelect = (expId, type, file) => {
    setExperiences(
      experiences.map((exp) => {
        if (exp.id === expId) {
          if (type === "salarySlip") {
            return {
              ...exp,
              salarySlips: [...exp.salarySlips, file],
            };
          } else {
            return {
              ...exp,
              [type]: file,
            };
          }
        }
        return exp;
      })
    );
    setError("");
  };

  const handleRemoveFile = (expId, type, index = null) => {
    setExperiences(
      experiences.map((exp) => {
        if (exp.id === expId) {
          if (type === "salarySlip" && index !== null) {
            const newSlips = [...exp.salarySlips];
            newSlips.splice(index, 1);
            return {
              ...exp,
              salarySlips: newSlips,
            };
          } else {
            return {
              ...exp,
              [type]: null,
            };
          }
        }
        return exp;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If fresher, just move to next step
    if (isFresher) {
      router.push("/student/application/admission");
      return;
    }

    // Validate that at least one experience letter is uploaded
    const hasExperienceLetter = experiences.some(
      (exp) => exp.experienceLetter
    );
    if (!hasExperienceLetter) {
      setError("Please upload at least one experience letter");
      return;
    }

    if (aiServerHealth === false) {
      setError(
        "⚠️ AI processing server is currently unavailable. Please try again later."
      );
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");
    setUploadProgress(0);

    try {
      const formData = new FormData();

      // Append all documents
      experiences.forEach((exp, index) => {
        if (exp.experienceLetter) {
          formData.append(`experience_letter_${index}`, exp.experienceLetter);
        }
        if (exp.offerLetter) {
          formData.append(`offer_letter_${index}`, exp.offerLetter);
        }
        exp.salarySlips.forEach((slip, slipIndex) => {
          formData.append(`salary_slip_${index}_${slipIndex}`, slip);
        });
      });

      console.log("📤 Uploading work experience documents...");

      const response = await axios.post(
        "/api/student/work/experience",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        }
      );

      if (response.data.success) {
        setSuccess(
          `✅ Work experience processed successfully! Extracted ${response.data.data.experienceCount} experiences (${response.data.data.totalYears?.toFixed(
            1
          )} years total)`
        );
        // After success, go to next step (Admission Letters)
        setTimeout(() => {
          router.push("/student/application/admission");
        }, 3000);
      }
    } catch (err) {
      console.error("Work experience submission error:", err);
      if (err.response?.status === 403) {
        setError(err.response.data.message || "Cannot add work experience");
      } else if (err.response?.status === 503) {
        setError(
          "⚠️ AI processing server is unavailable. Please try again later."
        );
      } else if (err.response?.status === 401) {
        setError("🔒 Session expired. Please login again.");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to process work experience. Please try again."
        );
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (checkingHealth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">
            Checking server status...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-blue-100"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Work Experience
                </h1>
              </div>
            </div>
            <p className="text-gray-700">
              {isFresher
                ? "You're marked as a fresher - no work experience required"
                : "Upload your work experience documents for AI-powered verification"}
            </p>
          </div>

          {/* AI Server Status */}
          {aiServerHealth !== null && (
            <div
              className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${
                aiServerHealth
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              {aiServerHealth ? (
                <CheckCircle className="text-green-600" size={20} />
              ) : (
                <XCircle className="text-red-600" size={20} />
              )}
              <div>
                <p
                  className={`text-sm font-medium ${
                    aiServerHealth ? "text-green-900" : "text-red-900"
                  }`}
                >
                  {aiServerHealth
                    ? "✅ Work AI Server Online"
                    : "❌ Work AI Server Unavailable"}
                </p>
                {!aiServerHealth && (
                  <p className="text-xs text-red-700 mt-1">
                    The AI extraction server is currently down. Please try
                    again later.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Existing Data */}
          {existingData && (
            <div className="mb-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="text-blue-600" size={20} />
                <p className="text-sm font-medium text-blue-900">
                  {existingData.isFresher
                    ? "✅ You are marked as a fresher"
                    : `✅ ${
                        existingData.experiences?.length || 0
                      } work experience(s) recorded (${existingData.totalYears?.toFixed(
                        1
                      )} years total)`}
                </p>
              </div>
            </div>
          )}

          {/* Fresher Toggle */}
          <div className="mb-8 p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isFresher}
                onChange={(e) => handleFresherToggle(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500"
                disabled={uploading || existingData?.isFresher}
              />
              <div className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-purple-600" />
                <span className="text-base font-medium text-gray-900">
                  I am a fresher (no work experience)
                </span>
              </div>
            </label>
            {isFresher && (
              <p className="mt-2 text-sm text-purple-700 ml-8">
                No work documents required. Click Complete to continue.
              </p>
            )}
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3"
            >
              <CheckCircle className="text-green-600" size={20} />
              <p className="text-sm font-medium text-green-900">{success}</p>
            </motion.div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="text-red-600" size={20} />
              <p className="text-sm font-medium text-red-900">{error}</p>
            </motion.div>
          )}

          {/* Work Experience Forms */}
          {!isFresher && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <AnimatePresence>
                {experiences.map((exp, index) => (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-6 border-2 border-gray-200 rounded-xl space-y-4"
                  >
                    {/* Experience Header */}
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Work Experience {index + 1}
                      </h3>
                      {experiences.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeExperience(exp.id)}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                          disabled={uploading}
                        >
                          <Trash2 size={20} />
                        </button>
                      )}
                    </div>

                    {/* Experience Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Experience Letter
                      </label>
                      {exp.experienceLetter ? (
                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className="text-green-600"
                              size={18}
                            />
                            <span className="text-sm text-gray-700">
                              {exp.experienceLetter.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {(
                                exp.experienceLetter.size /
                                (1024 * 1024)
                              ).toFixed(2)}{" "}
                              MB
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFile(exp.id, "experienceLetter")
                            }
                            className="text-sm text-red-600 hover:text-red-700"
                            disabled={uploading}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="relative block border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileSelect(
                                  exp.id,
                                  "experienceLetter",
                                  file
                                );
                              }
                            }}
                            className="sr-only"
                            disabled={uploading}
                          />
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm font-medium text-gray-700">
                              Upload Experience Letter
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              PDF, JPG, PNG (max 10MB)
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Offer Letter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Letter (Optional)
                      </label>
                      {exp.offerLetter ? (
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <CheckCircle
                              className="text-blue-600"
                              size={18}
                            />
                            <span className="text-sm text-gray-700">
                              {exp.offerLetter.name}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFile(exp.id, "offerLetter")
                            }
                            className="text-sm text-red-600 hover:text-red-700"
                            disabled={uploading}
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <label className="relative block border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileSelect(exp.id, "offerLetter", file);
                              }
                            }}
                            className="sr-only"
                            disabled={uploading}
                          />
                          <div className="text-center">
                            <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                            <p className="text-sm text-gray-700">
                              Upload Offer Letter
                            </p>
                          </div>
                        </label>
                      )}
                    </div>

                    {/* Salary Slips */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Salary Slips (Optional – Min 3 recommended)
                      </label>
                      <div className="space-y-2">
                        {exp.salarySlips.map((slip, slipIndex) => (
                          <div
                            key={slipIndex}
                            className="flex items-center justify-between p-2 bg-gray-50 border border-gray-200 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">
                              {slip.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFile(exp.id, "salarySlip", slipIndex)
                              }
                              className="text-xs text-red-600 hover:text-red-700"
                              disabled={uploading}
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        {exp.salarySlips.length < 12 && (
                          <label className="relative block border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleFileSelect(exp.id, "salarySlip", file);
                                }
                              }}
                              className="sr-only"
                              disabled={uploading}
                            />
                            <div className="text-center">
                              <Plus className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                              <p className="text-xs text-gray-700">
                                Add Salary Slip
                              </p>
                            </div>
                          </label>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Add Another Experience */}
              {!isFresher && experiences.length < 5 && (
                <button
                  type="button"
                  onClick={addExperience}
                  className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2 font-medium"
                  disabled={uploading}
                >
                  <Plus size={20} />
                  Add Another Work Experience
                </button>
              )}

              {/* Upload Progress */}
              {uploading && uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-700">
                    <span>Processing with AI...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
                  disabled={uploading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={uploading || aiServerHealth === false}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing with AI...
                    </>
                  ) : (
                    <>
                      <span>Submit Work Experience</span>
                      <CheckCircle size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Fresher Complete Button */}
          {isFresher && !uploading && (
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => router.push("/student/application/admission")}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all flex items-center gap-2"
              >
                <span>Complete</span>
                <CheckCircle size={18} />
              </button>
            </div>
          )}

          {/* Help Text */}
          <motion.div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isFresher
                ? "🎓 No work experience required for freshers"
                : "🤖 AI-powered extraction • 🔒 Secure processing • ⚡ Instant verification"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
