// components/application/DocumentUpload.jsx
"use client";

import { Upload, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function DocumentUpload({
  label,
  documentId,
  isUploaded,
  isUploading,
  onUpload,
  onRemove,
  onPreview,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file, documentId);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          id={documentId}
          onChange={handleFileChange}
          className="sr-only"
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <motion.label
          htmlFor={documentId}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`block border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isUploaded
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }`}
        >
          <div className="space-y-3">
            {isUploading ? (
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
            ) : isUploaded ? (
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-5 h-5 text-white" />
              </div>
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">
                {isUploaded ? "Uploaded" : "Click to upload"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PDF, JPG, PNG (max 5MB)
              </p>
            </div>
          </div>
        </motion.label>
      </div>
    </div>
  );
}