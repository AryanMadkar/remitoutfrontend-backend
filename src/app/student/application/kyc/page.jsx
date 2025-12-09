// app/student/application/kyc/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Upload,
  X,
  Check,
  Eye,
  Loader2,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import DocumentUpload from "@/components/application/DocumentUpload";
import DocumentPreview from "@/components/application/DocumentPreview";
import axios from "@/lib/axios";

const DOCUMENT_TYPES = {
  AADHAAR: {
    name: "Aadhaar Card",
    sides: [
      { id: "aadhaar_front", label: "Front Side", required: true },
      { id: "aadhaar_back", label: "Back Side", required: true },
    ],
  },
  PAN: {
    name: "PAN Card",
    sides: [
      { id: "pan_front", label: "Front Side", required: true },
      { id: "pan_back", label: "Back Side (Optional)", required: false },
    ],
  },
  PASSPORT: {
    name: "Passport",
    sides: [{ id: "passport", label: "Main Page (Optional)", required: false }],
  },
};

export default function KYCPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // KYC Status Check
  const [kycStatus, setKycStatus] = useState(null);
  const [canSubmit, setCanSubmit] = useState(true);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const [aiServerHealth, setAiServerHealth] = useState(null);

  // Check KYC status on mount
  useEffect(() => {
    checkKycStatus();
    checkAiServerHealth();
  }, []);

  const checkKycStatus = async () => {
    try {
      const response = await axios.get("/api/student/kyc/verify");
      if (response.data.success) {
        const { kycStatus: status, canSubmit: canSubmitStatus } =
          response.data.data;
        setKycStatus(status);
        setCanSubmit(canSubmitStatus);

        if (!canSubmitStatus) {
          if (status === "verified") {
            setError(
              "⛔ Your KYC is already verified! You cannot submit documents again."
            );
          } else if (status === "manual_review") {
            setError(
              "⏳ Your KYC is under manual review. Please wait for the review to complete."
            );
          }
        }
      }
    } catch (err) {
      console.error("Error checking KYC status:", err);
    } finally {
      setCheckingStatus(false);
    }
  };

  const checkAiServerHealth = async () => {
    try {
      const response = await axios.get("/api/student/kyc/health");
      setAiServerHealth(response.data.success);
    } catch (err) {
      setAiServerHealth(false);
      console.error("AI server health check failed:", err);
    }
  };

  const handleFileUpload = async (file, documentId) => {
    setUploading(documentId);
    setError("");

    try {
      // Validate file size (max 10MB per file)
      if (file.size > 10 * 1024 * 1024) {
        setError(`File ${file.name} is too large. Maximum size is 10MB.`);
        setUploading(null);
        return;
      }

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError(
          `File ${file.name} has invalid type. Only JPEG, PNG, and WebP are allowed.`
        );
        setUploading(null);
        return;
      }

      // Create preview
      const objectUrl = URL.createObjectURL(file);

      setDocuments((prev) => ({
        ...prev,
        [documentId]: {
          file: file,
          url: objectUrl,
          name: file.name,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        },
      }));
    } catch (err) {
      setError(`Failed to upload ${file.name}`);
      console.error("Upload error:", err);
    } finally {
      setUploading(null);
    }
  };

  const removeDocument = (documentId) => {
    if (documents[documentId]?.url) {
      URL.revokeObjectURL(documents[documentId].url);
    }

    setDocuments((prev) => {
      const { [documentId]: _, ...rest } = prev;
      return rest;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Double check KYC status before submission
    if (!canSubmit) {
      setError(
        "⛔ KYC submission not allowed. Please check your current KYC status."
      );
      return;
    }

    // Check AI server health
    if (aiServerHealth === false) {
      setError(
        "⚠️ AI processing server is currently unavailable. Please try again later."
      );
      return;
    }

    // Validate required documents
    const requiredDocs = ["aadhaar_front", "aadhaar_back", "pan_front"];
    const missingDocs = requiredDocs.filter((doc) => !documents[doc]);

    if (missingDocs.length > 0) {
      setError(
        `Please upload all required documents: ${missingDocs.join(", ")}`
      );
      return;
    }

    setVerifying(true);

    try {
      // Create FormData
      const formData = new FormData();

      // Add all uploaded documents
      for (const [docId, docData] of Object.entries(documents)) {
        if (docData.file) {
          formData.append(docId, docData.file);
        }
      }

      console.log("📤 Submitting KYC documents...");

      // Submit to backend
      const response = await axios.post("/api/student/kyc/verify", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        },
      });

      if (response.data.success) {
        const result = response.data.data;
        setSuccess(
          `✅ KYC documents processed successfully! Status: ${result.kycStatus}`
        );

        // Wait and redirect
        setTimeout(() => {
          router.push("/student/application/academic");
        }, 3000);
      } else {
        setError(response.data.message || "Failed to process KYC documents");
      }
    } catch (err) {
      console.error("KYC submission error:", err);

      if (err.response?.status === 403) {
        setError(
          err.response.data.message ||
            "⛔ KYC submission not allowed. Your KYC may already be verified."
        );
      } else if (err.response?.status === 503) {
        setError(
          "⚠️ AI processing server is unavailable. Please try again later."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Failed to process KYC documents. Please try again."
        );
      }
    } finally {
      setVerifying(false);
    }
  };

  if (checkingStatus) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-700 font-medium">Checking KYC status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl">
              <Shield className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                KYC Verification
              </h1>
              <p className="text-gray-700">
                Verify your identity with government-issued documents
              </p>
            </div>
          </div>

          {/* AI Server Status */}
          {aiServerHealth === false && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <XCircle
                className="text-red-600 mt-0.5 flex-shrink-0"
                size={20}
              />
              <div>
                <p className="text-sm font-semibold text-red-900">
                  AI Processing Server Unavailable
                </p>
                <p className="text-sm text-red-700 mt-1">
                  The document processing server is currently down. Please try
                  again later.
                </p>
              </div>
            </div>
          )}

          {/* KYC Status Banner */}
          {kycStatus && kycStatus !== "pending" && (
            <div
              className={`mb-6 p-4 rounded-lg border flex items-start gap-3 ${
                kycStatus === "verified"
                  ? "bg-green-50 border-green-200"
                  : kycStatus === "manual_review"
                  ? "bg-yellow-50 border-yellow-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              {kycStatus === "verified" ? (
                <CheckCircle className="text-green-600 mt-0.5" size={20} />
              ) : kycStatus === "manual_review" ? (
                <Clock className="text-yellow-600 mt-0.5" size={20} />
              ) : (
                <AlertCircle className="text-red-600 mt-0.5" size={20} />
              )}
              <div>
                <p
                  className={`text-sm font-semibold ${
                    kycStatus === "verified"
                      ? "text-green-900"
                      : kycStatus === "manual_review"
                      ? "text-yellow-900"
                      : "text-red-900"
                  }`}
                >
                  {kycStatus === "verified"
                    ? "✅ KYC Already Verified"
                    : kycStatus === "manual_review"
                    ? "⏳ KYC Under Manual Review"
                    : "❌ KYC Rejected"}
                </p>
                <p
                  className={`text-sm mt-1 ${
                    kycStatus === "verified"
                      ? "text-green-700"
                      : kycStatus === "manual_review"
                      ? "text-yellow-700"
                      : "text-red-700"
                  }`}
                >
                  {kycStatus === "verified"
                    ? "Your identity has been verified. No further action needed."
                    : kycStatus === "manual_review"
                    ? "Your documents are being reviewed by our team. You will be notified once the review is complete."
                    : "Your KYC was rejected. You may resubmit your documents."}
                </p>
              </div>
            </div>
          )}

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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Document Upload Sections */}
            {Object.entries(DOCUMENT_TYPES).map(([key, docType]) => (
              <div key={key} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <CreditCard size={20} className="text-purple-600" />
                  {docType.name}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {docType.sides.map((side) => (
                    <DocumentUpload
                      key={side.id}
                      label={side.label}
                      documentId={side.id}
                      onUpload={handleFileUpload}
                      uploading={uploading === side.id}
                      document={documents[side.id]}
                      onRemove={() => removeDocument(side.id)}
                      onPreview={() => setPreviewDoc(documents[side.id])}
                      disabled={!canSubmit || verifying}
                      required={side.required}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Uploaded Documents Summary */}
            {Object.keys(documents).length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-sm font-semibold text-purple-900 mb-2">
                  Uploaded Documents ({Object.keys(documents).length})
                </h4>
                <div className="space-y-2">
                  {Object.entries(documents).map(([id, doc]) => (
                    <div
                      key={id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 font-medium">
                        {id
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </span>
                      <div className="flex items-center gap-2">
                        <Check className="text-green-600" size={16} />
                        <button
                          type="button"
                          onClick={() => removeDocument(id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={verifying}
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Verification Animation */}
            <AnimatePresence>
              {verifying && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                >
                  <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
                    <Loader2 className="w-16 h-16 animate-spin text-purple-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      Verifying Documents
                    </h3>
                    <p className="text-gray-600">
                      Please wait while we process and verify your documents
                      with AI...
                    </p>
                    <p className="text-sm text-gray-500 mt-4">
                      This may take up to 2 minutes
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-purple-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                disabled={verifying}
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={
                  verifying ||
                  !canSubmit ||
                  Object.keys(documents).length < 3 ||
                  aiServerHealth === false
                }
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield size={18} />
                    Submit for Verification
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Document Preview Modal */}
      {previewDoc && (
        <DocumentPreview
          document={previewDoc}
          onClose={() => setPreviewDoc(null)}
        />
      )}
    </div>
  );
}
