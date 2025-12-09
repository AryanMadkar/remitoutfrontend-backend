// app/student/application/academic/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, BookOpen, Award, FileText, Upload } from "lucide-react";
import FormField from "@/components/application/FormField";
import DocumentUpload from "@/components/application/DocumentUpload";

const EDUCATION_LEVELS = [
  { value: "10TH", label: "10th Grade", key: "tenth" },
  { value: "12TH", label: "12th Grade", key: "twelfth" },
  { value: "BACHELORS", label: "Bachelor's Degree", key: "bachelors" },
  { value: "MASTERS", label: "Master's Degree", key: "masters" },
  { value: "DIPLOMA", label: "Diploma", key: "diploma" },
  { value: "OTHER", label: "Other", key: "other" },
];

export default function AcademicPage() {
  const router = useRouter();
  const [records, setRecords] = useState([
    {
      id: 1,
      level: "10TH",
      institution: "",
      board: "",
      year: "",
      percentage: "",
      documents: [],
    },
  ]);
  const [uploadingDocs, setUploadingDocs] = useState({});

  const addRecord = () => {
    setRecords([
      ...records,
      {
        id: Date.now(),
        level: "",
        institution: "",
        board: "",
        year: "",
        percentage: "",
        documents: [],
      },
    ]);
  };

  const removeRecord = (id) => {
    if (records.length > 1) {
      setRecords(records.filter((record) => record.id !== id));
    }
  };

  const updateRecord = (id, field, value) => {
    setRecords(
      records.map((record) =>
        record.id === id ? { ...record, [field]: value } : record
      )
    );
  };

  const handleDocumentUpload = async (file, recordId) => {
    setUploadingDocs((prev) => ({ ...prev, [recordId]: true }));
    
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const objectUrl = URL.createObjectURL(file);
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        return {
          ...record,
          documents: [
            ...record.documents,
            {
              id: Date.now(),
              url: objectUrl,
              name: file.name,
              type: file.type,
            },
          ],
        };
      }
      return record;
    });
    
    setRecords(updatedRecords);
    setUploadingDocs((prev) => ({ ...prev, [recordId]: false }));
  };

  const removeDocument = (recordId, docId) => {
    const updatedRecords = records.map((record) => {
      if (record.id === recordId) {
        const doc = record.documents.find((d) => d.id === docId);
        if (doc?.url) {
          URL.revokeObjectURL(doc.url);
        }
        return {
          ...record,
          documents: record.documents.filter((d) => d.id !== docId),
        };
      }
      return record;
    });
    
    setRecords(updatedRecords);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required records
    const isValid = records.every(
      (record) =>
        record.level &&
        record.institution &&
        record.year &&
        record.percentage
    );
    
    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }
    
    // API call would go here
    router.push("/student/application/work");
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case "10TH":
      case "12TH":
        return <BookOpen className="w-4 h-4" />;
      case "BACHELORS":
      case "MASTERS":
        return <Award className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Award className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900">Academic Records</h2>
        </div>
        <p className="text-gray-600">
          Provide your educational background and upload supporting documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence>
          {records.map((record, index) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="relative border border-gray-200 rounded-lg p-6 bg-white"
            >
              <div className="absolute top-4 right-4">
                {records.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecord(record.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Academic Record {index + 1}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="Education Level" required>
                  <div className="relative">
                    <select
                      value={record.level}
                      onChange={(e) =>
                        updateRecord(record.id, "level", e.target.value)
                      }
                      className="form-select pl-10"
                      required
                    >
                      <option value="">Select level</option>
                      {EDUCATION_LEVELS.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      {getLevelIcon(record.level)}
                    </div>
                  </div>
                </FormField>

                <FormField label="Institution Name" required>
                  <input
                    type="text"
                    value={record.institution}
                    onChange={(e) =>
                      updateRecord(record.id, "institution", e.target.value)
                    }
                    placeholder="e.g., Delhi Public School"
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField label="Board / University">
                  <input
                    type="text"
                    value={record.board}
                    onChange={(e) =>
                      updateRecord(record.id, "board", e.target.value)
                    }
                    placeholder="e.g., CBSE, Delhi University"
                    className="form-input"
                  />
                </FormField>

                <FormField label="Year of Completion" required>
                  <input
                    type="number"
                    min="1950"
                    max="2025"
                    value={record.year}
                    onChange={(e) =>
                      updateRecord(record.id, "year", e.target.value)
                    }
                    placeholder="e.g., 2023"
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField label="Percentage / GPA" required>
                  <input
                    type="text"
                    value={record.percentage}
                    onChange={(e) =>
                      updateRecord(record.id, "percentage", e.target.value)
                    }
                    placeholder="e.g., 85% or 3.8"
                    className="form-input"
                    required
                  />
                </FormField>

                <div className="md:col-span-2">
                  <FormField label="Supporting Documents">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {record.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="relative border border-gray-200 rounded p-3 hover:border-blue-300 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                📄
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {doc.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {doc.type.split("/").pop().toUpperCase()}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeDocument(record.id, doc.id)}
                              className="absolute top-1 right-1 p-1 hover:bg-red-50 rounded"
                            >
                              <Trash2 className="w-3 h-3 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block mb-2">
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="sr-only"
                              onChange={(e) => {
                                Array.from(e.target.files || []).forEach((file) => {
                                  handleDocumentUpload(file, record.id);
                                });
                              }}
                            />
                            <div className="space-y-2">
                              {uploadingDocs[record.id] ? (
                                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                              ) : (
                                <>
                                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                                  <p className="text-sm text-gray-600">
                                    Click or drag to upload documents
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Marksheets, transcripts, certificates
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </FormField>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={addRecord}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Add Another Academic Record
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Add your previous qualifications
          </p>
        </button>

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
            className="px-8 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Work Experience
          </button>
        </div>
      </form>
    </motion.div>
  );
}