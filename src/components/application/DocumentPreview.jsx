// components/application/DocumentPreview.jsx
"use client";

import { motion } from "framer-motion";
import { X, Download, RotateCw } from "lucide-react";

export default function DocumentPreview({ document, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">
            Document Preview
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.open(document.url, '_blank')}
              className="p-2 text-gray-600 hover:text-gray-900"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-4 overflow-auto max-h-[calc(90vh-80px)]">
          {document.type.startsWith("image/") ? (
            <div className="flex justify-center">
              <img
                src={document.url}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8">
              <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="text-4xl mb-2">📄</div>
                  <span className="text-sm text-gray-600">PDF Document</span>
                </div>
              </div>
              <p className="text-sm text-gray-900 font-medium">{document.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Click download to view this document
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}