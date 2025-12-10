// app/student/application/academic/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  XCircle,
} from "lucide-react";
import axios from "@/lib/axios";

const STEPS = [
  {
    id: "class10",
    title: "Class 10th Marksheet",
    icon: BookOpen,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "class12",
    title: "Class 12th Marksheet",
    icon: BookOpen,
    accept: ".pdf,.jpg,.jpeg,.png",
  },
  {
    id: "graduation",
    title: "Graduation Documents",
    icon: GraduationCap,
    accept: ".pdf",
  },
];

export default function AcademicRecordsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [documents, setDocuments] = useState({
    class10: null,
    class12: null,
    graduation: null,
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({
    class10: false,
    class12: false,
    graduation: false,
  });
  const [aiServerHealth, setAiServerHealth] = useState(null);
  const [checkingHealth, setCheckingHealth] = useState(true);

  useEffect(() => {
    checkExistingRecords();
    checkAiServerHealth();
  }, []);

  const checkAiServerHealth = async () => {
    try {
      const response = await axios.get("/api/student/academic/health");
      setAiServerHealth(response.data.success);
      console.log(
        "🏥 Academic AI Server Health:",
        response.data.success ? "Online" : "Offline"
      );
    } catch (err) {
      setAiServerHealth(false);
      console.error("Academic AI server health check failed:", err);
    } finally {
      setCheckingHealth(false);
    }
  };

  const checkExistingRecords = async () => {
    try {
      const class10Res = await axios.get("/api/student/academic/class10");
      if (class10Res.data.success && class10Res.data.data.exists) {
        setCompletedSteps((prev) => ({ ...prev, class10: true }));
      }

      const class12Res = await axios.get("/api/student/academic/class12");
      if (class12Res.data.success && class12Res.data.data.exists) {
        setCompletedSteps((prev) => ({ ...prev, class12: true }));
      }

      const graduationRes = await axios.get("/api/student/academic/graduation");
      if (graduationRes.data.success && graduationRes.data.data.exists) {
        setCompletedSteps((prev) => ({ ...prev, graduation: true }));
      }

      if (completedSteps.class10 && !completedSteps.class12) {
        setCurrentStep(1);
      } else if (completedSteps.class10 && completedSteps.class12) {
        setCurrentStep(2);
      }
    } catch (err) {
      console.error("Error checking existing records:", err);
    }
  };

  const handleFileSelect = (stepId, file) => {
    setDocuments((prev) => ({
      ...prev,
      [stepId]: file,
    }));
    setError("");
  };

  const handleRemoveFile = (stepId) => {
    setDocuments((prev) => ({
      ...prev,
      [stepId]: null,
    }));
  };

  const handleSubmitStep = async () => {
    const stepId = STEPS[currentStep].id;
    const file = documents[stepId];

    if (!file) {
      setError("Please upload a document before proceeding");
      return;
    }

    // Check AI server health
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
      formData.append(stepId, file);

      const endpoint = `/api/student/academic/${stepId}`;

      console.log(`📤 Uploading ${stepId} to ${endpoint}...`);

      const response = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setSuccess(`✅ ${STEPS[currentStep].title} processed successfully!`);
        setCompletedSteps((prev) => ({ ...prev, [stepId]: true }));

        setTimeout(() => {
          if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
            setSuccess("");
            setError("");
          } else {
            setTimeout(() => {
              router.push("/student/work-experience");
            }, 2000);
          }
        }, 2000);
      } else {
        setError(response.data.message || "Failed to process document");
      }
    } catch (err) {
      console.error(`${stepId} submission error:`, err);

      if (err.response?.status === 403) {
        setError(
          err.response.data.message || "This record is already verified"
        );
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
            "Failed to process document. Please try again."
        );
      }
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  if (checkingHealth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Checking server status...</p>
        </div>
      </div>
    );
  }

  const currentStepData = STEPS[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
                      completedSteps[step.id]
                        ? "bg-green-500 text-white"
                        : index === currentStep
                        ? "bg-purple-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {completedSteps[step.id] ? (
                      <CheckCircle size={24} />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium text-center ${
                      index === currentStep
                        ? "text-purple-600"
                        : completedSteps[step.id]
                        ? "text-green-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-4 transition-all ${
                      completedSteps[step.id] ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        >
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Icon className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentStepData.title}
              </h1>
            </div>
            <p className="text-gray-700">
              Upload your {currentStepData.title.toLowerCase()} for AI-powered
              data extraction
            </p>

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
                      ? "✅ AI Processing Server Online"
                      : "❌ AI Processing Server Unavailable"}
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

          {/* File Upload Area */}
          <div className="mb-8">
            <label
              htmlFor={`file-${currentStepData.id}`}
              className={`relative block border-2 border-dashed rounded-xl p-8 transition-all ${
                documents[currentStepData.id]
                  ? "border-purple-300 bg-purple-50 cursor-default"
                  : aiServerHealth === false
                  ? "border-gray-300 bg-gray-50 cursor-not-allowed opacity-50"
                  : "border-gray-300 hover:border-purple-400 hover:bg-purple-50 cursor-pointer"
              }`}
            >
              <input
                id={`file-${currentStepData.id}`}
                type="file"
                accept={currentStepData.accept}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileSelect(currentStepData.id, file);
                }}
                className="sr-only"
                disabled={
                  uploading ||
                  completedSteps[currentStepData.id] ||
                  aiServerHealth === false
                }
              />

              {documents[currentStepData.id] ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Upload className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {documents[currentStepData.id].name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(
                          documents[currentStepData.id].size /
                          1024 /
                          1024
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      handleRemoveFile(currentStepData.id);
                    }}
                    className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                    disabled={uploading}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">
                    {currentStepData.id === "graduation"
                      ? "PDF only, up to 10MB"
                      : "PDF, JPG, PNG up to 10MB"}
                  </p>
                </div>
              )}
            </label>

            {completedSteps[currentStepData.id] && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
                <CheckCircle className="text-green-600" size={20} />
                <p className="text-sm font-medium text-green-900">
                  ✅ This document has already been processed and extracted. Redirecting...
                </p>
                {setTimeout(() => {
                  router.push("/student/application/work-experience");
                }, 2000)}
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && uploadProgress > 0 && (
            <div className="mb-6 space-y-2">
              <div className="flex justify-between text-sm text-gray-700">
                <span>🤖 Processing with AI...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100">
            <button
              type="button"
              onClick={() => {
                if (currentStep > 0) {
                  setCurrentStep(currentStep - 1);
                  setError("");
                  setSuccess("");
                } else {
                  router.back();
                }
              }}
              className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors disabled:opacity-50"
              disabled={uploading}
            >
              <ArrowLeft className="inline mr-2" size={18} />
              {currentStep === 0 ? "Back" : "Previous"}
            </button>

            <button
              type="button"
              onClick={handleSubmitStep}
              disabled={
                uploading ||
                !documents[currentStepData.id] ||
                completedSteps[currentStepData.id] ||
                aiServerHealth === false
              }
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing with AI...
                </>
              ) : currentStep === STEPS.length - 1 ? (
                <>
                  Complete
                  <CheckCircle size={18} />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            🤖 AI-powered extraction • 🔒 Secure processing • ⚡ Instant data
            capture
          </p>
        </div>
      </div>
    </div>
  );
}
