// components/application/DocumentUpload.jsx
"use client";

import { useState, useEffect } from "react";
import { Upload, Check, Loader2, File, X } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

export default function DocumentUpload({
  label,
  documentId,
  isUploaded,
  isUploading,
  onUpload,
  onRemove,
  onPreview,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const shouldReduceMotion = isMobile || prefersReducedMotion;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file, documentId);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onUpload(file, documentId);
    }
  };

  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-900">
        <motion.div
          animate={
            !shouldReduceMotion && !isUploaded
              ? { rotate: [0, 10, -10, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        >
          <File className="h-4 w-4 text-orange-500" />
        </motion.div>
        {label}
        {!isUploaded && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type="file"
          id={documentId}
          onChange={handleFileChange}
          className="sr-only"
          accept=".pdf,.jpg,.jpeg,.png"
          disabled={isUploading}
        />

        <motion.label
          htmlFor={documentId}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`group relative block overflow-hidden rounded-xl border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300 ${
            isUploaded
              ? "border-emerald-400 bg-gradient-to-br from-emerald-50 to-emerald-100/50"
              : isDragging
              ? "border-orange-500 bg-gradient-to-br from-orange-50 to-purple-50 scale-105"
              : "border-gray-300 bg-white hover:border-orange-400 hover:bg-gradient-to-br hover:from-orange-50/50 hover:to-purple-50/50"
          }`}
          whileHover={
            shouldReduceMotion || isUploading
              ? {}
              : {
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }
          }
          whileTap={isUploading ? {} : { scale: 0.98 }}
        >
          {/* Background animation - desktop only */}
          {!shouldReduceMotion && !isUploaded && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-orange-400/10 via-purple-400/10 to-orange-400/10"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                backgroundSize: "200% 200%",
              }}
            />
          )}

          <div className="relative space-y-4">
            {/* Icon */}
            <div className="flex justify-center">
              {isUploading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Loader2 className="h-12 w-12 text-orange-500" />
                </motion.div>
              ) : isUploaded ? (
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                    <Check className="h-8 w-8 text-white" strokeWidth={3} />
                  </div>
                  {/* Success ring animation - desktop only */}
                  {!shouldReduceMotion && (
                    <>
                      <motion.div
                        className="absolute inset-0 rounded-full border-4 border-emerald-400"
                        animate={{
                          scale: [1, 1.5],
                          opacity: [1, 0],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          repeatDelay: 2,
                        }}
                      />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-400 blur-xl"
                        animate={{
                          scale: [1, 1.3, 1],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                        }}
                      />
                    </>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-orange-100 group-hover:to-purple-100 transition-all duration-300"
                  animate={
                    !shouldReduceMotion && isDragging
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 10, -10, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <Upload className="h-8 w-8 text-gray-400 group-hover:text-orange-500 transition-colors" />
                </motion.div>
              )}
            </div>

            {/* Text */}
            <div>
              <motion.p
                className={`text-base font-semibold ${
                  isUploaded
                    ? "text-emerald-600"
                    : "text-gray-900 group-hover:text-orange-600"
                }`}
                animate={
                  !shouldReduceMotion && isUploaded
                    ? {
                        scale: [1, 1.05, 1],
                      }
                    : {}
                }
                transition={{
                  duration: 0.5,
                }}
              >
                {isUploading
                  ? "Uploading..."
                  : isUploaded
                  ? "✓ Uploaded Successfully"
                  : isDragging
                  ? "Drop file here"
                  : "Click to upload or drag & drop"}
              </motion.p>
              <p className="mt-2 text-xs text-gray-500">
                PDF, JPG, PNG (max 5MB)
              </p>

              {/* Additional info on hover - desktop only */}
              {!isMobile && !isUploaded && (
                <motion.p
                  className="mt-2 text-xs text-orange-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  initial={{ y: -5 }}
                  animate={{ y: 0 }}
                >
                  Supported formats: .pdf, .jpg, .jpeg, .png
                </motion.p>
              )}
            </div>

            {/* Progress bar for uploading */}
            {isUploading && (
              <motion.div
                className="w-full h-1 bg-gray-200 rounded-full overflow-hidden"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-purple-500"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
              </motion.div>
            )}
          </div>
        </motion.label>

        {/* Remove button for uploaded files */}
        {isUploaded && onRemove && (
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              onRemove(documentId);
            }}
            className="absolute top-2 right-2 rounded-full bg-red-500 p-2 text-white shadow-lg hover:bg-red-600 transition-colors z-10"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
              delay: 0.2,
            }}
            whileHover={shouldReduceMotion ? {} : { scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X className="h-4 w-4" />
          </motion.button>
        )}
      </div>

      {/* Upload tips - desktop only */}
      {!isMobile && !isUploaded && (
        <motion.div
          className="flex items-start gap-2 rounded-lg bg-orange-50 border border-orange-200 p-3"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.3 }}
        >
          <div className="rounded-full bg-orange-500 p-1 mt-0.5">
            <Upload className="h-3 w-3 text-white" />
          </div>
          <p className="text-xs text-orange-800 leading-relaxed">
            <strong>Tip:</strong> Ensure your document is clear and all details
            are visible. Blurry or incomplete documents may delay processing.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}