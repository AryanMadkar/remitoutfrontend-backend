// app/student/application/kyc/page.jsx
"use client";

import { useState, useRef } from "react";
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
  User,
  Home,
} from "lucide-react";
import DocumentUpload from "@/components/application/DocumentUpload";
import DocumentPreview from "@/components/application/DocumentPreview";

const DOCUMENT_TYPES = {
  AADHAAR: {
    name: "Aadhaar Card",
    sides: [
      { id: "aadhaar_front", label: "Front Side" },
      { id: "aadhaar_back", label: "Back Side" },
    ],
  },
  PAN: {
    name: "PAN Card",
    sides: [{ id: "pan_front", label: "Front Side" }],
  },
  PASSPORT: {
    name: "Passport",
    sides: [{ id: "passport_main", label: "Main Page" }],
  },
};

export default function KYCPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    dateOfBirth: "",
    address: "",
  });
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [verifying, setVerifying] = useState(false);

  const handleFileUpload = async (file, documentId) => {
    setUploading(documentId);
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const objectUrl = URL.createObjectURL(file);
    setDocuments((prev) => ({
      ...prev,
      [documentId]: {
        url: objectUrl,
        name: file.name,
        type: file.type,
        uploadedAt: new Date().toISOString(),
      },
    }));
    setUploading(null);
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

    // Check all required documents are uploaded
    const requiredDocs = DOCUMENT_TYPES[formData.documentType]?.sides || [];
    const allUploaded = requiredDocs.every((doc) => documents[doc.id]);

    if (!allUploaded) {
      alert("Please upload all required document sides");
      return;
    }

    setVerifying(true);

    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // API call would go here
    router.push("/student/application/academic");
  };

  const selectedDocType = DOCUMENT_TYPES[formData.documentType];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Shield className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900">
            KYC Verification
          </h2>
        </div>
        <p className="text-gray-600">
          Verify your identity with government-issued documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Document Type
              </label>
              <select
                value={formData.documentType}
                onChange={(e) => {
                  setFormData({ ...formData, documentType: e.target.value });
                  // Clear documents when type changes
                  Object.keys(documents).forEach((key) => {
                    if (documents[key]?.url) {
                      URL.revokeObjectURL(documents[key].url);
                    }
                  });
                  setDocuments({});
                }}
                className="form-select"
                required
              >
                <option value="">Select document type</option>
                {Object.entries(DOCUMENT_TYPES).map(([key, doc]) => (
                  <option key={key} value={key}>
                    {doc.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Document Number
              </label>
              <input
                type="text"
                value={formData.documentNumber}
                onChange={(e) =>
                  setFormData({ ...formData, documentNumber: e.target.value })
                }
                className="form-input"
                placeholder="Enter document number"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="form-input"
                required
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Residential Address
              </label>
              <textarea
                rows={3}
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="form-input"
                placeholder="Full address with PIN code"
                required
              />
            </div>
          </div>
        </div>

        {/* Document Upload Section */}
        {formData.documentType && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                Document Upload
              </h3>
              <span className="text-xs text-gray-500">
                {selectedDocType.sides.length} side(s) required
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedDocType.sides.map((side) => (
                <DocumentUpload
                  key={side.id}
                  label={side.label}
                  documentId={side.id}
                  isUploaded={!!documents[side.id]}
                  isUploading={uploading === side.id}
                  onUpload={handleFileUpload}
                  onRemove={() => removeDocument(side.id)}
                  onPreview={() => setPreviewDoc(documents[side.id])}
                />
              ))}
            </div>

            {/* Uploaded Documents Preview */}
            {Object.keys(documents).length > 0 && (
              <div className="pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-4">
                  Uploaded Documents
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {Object.entries(documents).map(([id, doc]) => (
                    <div
                      key={id}
                      className="group relative border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 transition-colors"
                    >
                      <div className="aspect-video bg-gray-100 flex items-center justify-center">
                        {doc.type.startsWith("image/") ? (
                          <img
                            src={doc.url}
                            alt={id}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="p-4 text-center">
                            <CreditCard className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <span className="text-xs text-gray-500">
                              PDF Document
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium text-gray-900 truncate">
                          {id
                            .split("_")
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {doc.name}
                        </p>
                      </div>
                      <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="p-1 bg-white rounded shadow-sm hover:bg-gray-50"
                        >
                          <Eye className="w-3 h-3 text-gray-600" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeDocument(id)}
                          className="p-1 bg-white rounded shadow-sm hover:bg-red-50"
                        >
                          <X className="w-3 h-3 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Verification Animation */}
        {verifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verifying Documents
              </h3>
              <p className="text-gray-600">
                Please wait while we verify your documents...
              </p>
            </div>
          </motion.div>
        )}

        <div className="flex justify-between pt-8 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            disabled={
              !formData.documentType || Object.keys(documents).length === 0
            }
            className="px-8 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {verifying ? (
              <span className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying...</span>
              </span>
            ) : (
              "Continue to Academic Records"
            )}
          </button>
        </div>
      </form>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {previewDoc && (
          <DocumentPreview
            document={previewDoc}
            onClose={() => setPreviewDoc(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
