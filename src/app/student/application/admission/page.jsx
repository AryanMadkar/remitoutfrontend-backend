// app/student/application/admission/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Trash2, Upload, Check, University, Calendar } from "lucide-react";
import FormField from "@/components/application/FormField";

export default function AdmissionPage() {
  const router = useRouter();
  const [admissionLetters, setAdmissionLetters] = useState([
    {
      id: 1,
      university: "",
      program: "",
      intakeDate: "",
      letterType: "OFFER",
      status: "ACCEPTED",
      documents: [],
    },
  ]);
  const [uploading, setUploading] = useState(false);

  const addLetter = () => {
    setAdmissionLetters([
      ...admissionLetters,
      {
        id: Date.now(),
        university: "",
        program: "",
        intakeDate: "",
        letterType: "OFFER",
        status: "ACCEPTED",
        documents: [],
      },
    ]);
  };

  const removeLetter = (id) => {
    if (admissionLetters.length > 1) {
      setAdmissionLetters(admissionLetters.filter((letter) => letter.id !== id));
    }
  };

  const updateLetter = (id, field, value) => {
    setAdmissionLetters(
      admissionLetters.map((letter) =>
        letter.id === id ? { ...letter, [field]: value } : letter
      )
    );
  };

  const handleFileUpload = async (files, letterId) => {
    setUploading(true);
    
    // Simulate uploads
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newDocuments = Array.from(files || []).map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
    }));
    
    setAdmissionLetters(
      admissionLetters.map((letter) =>
        letter.id === letterId
          ? { ...letter, documents: [...letter.documents, ...newDocuments] }
          : letter
      )
    );
    
    setUploading(false);
  };

  const removeDocument = (letterId, docId) => {
    setAdmissionLetters(
      admissionLetters.map((letter) =>
        letter.id === letterId
          ? {
              ...letter,
              documents: letter.documents.filter((doc) => doc.id !== docId),
            }
          : letter
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate at least one letter
    if (admissionLetters.length === 0) {
      alert("Please add at least one admission letter");
      return;
    }
    
    // Validate each letter has university and document
    const isValid = admissionLetters.every(
      (letter) => letter.university && letter.documents.length > 0
    );
    
    if (!isValid) {
      alert("Please fill in all required fields and upload documents");
      return;
    }
    
    // API call would go here
    router.push("/student/application/co-borrower");
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
            <FileText className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900">
            Admission Letters
          </h2>
        </div>
        <p className="text-gray-600">
          Upload offer letters from universities you've been accepted to
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <AnimatePresence>
          {admissionLetters.map((letter, index) => (
            <motion.div
              key={letter.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="relative border border-gray-200 rounded-lg p-6 bg-white"
            >
              <div className="absolute top-4 right-4">
                {admissionLetters.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLetter(letter.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <University className="w-4 h-4 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  Admission Letter {index + 1}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField label="University Name" required>
                  <div className="relative">
                    <input
                      type="text"
                      value={letter.university}
                      onChange={(e) =>
                        updateLetter(letter.id, "university", e.target.value)
                      }
                      placeholder="e.g., Stanford University"
                      className="form-input pl-10"
                      required
                    />
                    <University className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </FormField>

                <FormField label="Program / Course" required>
                  <input
                    type="text"
                    value={letter.program}
                    onChange={(e) =>
                      updateLetter(letter.id, "program", e.target.value)
                    }
                    placeholder="e.g., Master of Computer Science"
                    className="form-input"
                    required
                  />
                </FormField>

                <FormField label="Intake Date">
                  <div className="relative">
                    <input
                      type="date"
                      value={letter.intakeDate}
                      onChange={(e) =>
                        updateLetter(letter.id, "intakeDate", e.target.value)
                      }
                      className="form-input pl-10"
                    />
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  </div>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Letter Type">
                    <select
                      value={letter.letterType}
                      onChange={(e) =>
                        updateLetter(letter.id, "letterType", e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="OFFER">Offer Letter</option>
                      <option value="ADMIT">Admit Letter</option>
                      <option value="CONDITIONAL">Conditional Offer</option>
                      <option value="UNCONDITIONAL">Unconditional Offer</option>
                    </select>
                  </FormField>

                  <FormField label="Status">
                    <select
                      value={letter.status}
                      onChange={(e) =>
                        updateLetter(letter.id, "status", e.target.value)
                      }
                      className="form-select"
                    >
                      <option value="ACCEPTED">Accepted</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONSIDERING">Considering</option>
                    </select>
                  </FormField>
                </div>

                {/* Documents Upload */}
                <div className="md:col-span-2">
                  <FormField label="Admission Letter Document" required>
                    <div className="space-y-4">
                      {letter.documents.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {letter.documents.map((doc) => (
                            <div
                              key={doc.id}
                              className="relative border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                                    📄
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {doc.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Admission Letter
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      window.open(doc.url, "_blank")
                                    }
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                  >
                                    View
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      removeDocument(letter.id, doc.id)
                                    }
                                    className="p-1 hover:bg-red-50 rounded"
                                  >
                                    <Trash2 className="w-3 h-3 text-red-500" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <label className="block">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                          <input
                            type="file"
                            multiple
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="sr-only"
                            onChange={(e) =>
                              handleFileUpload(e.target.files, letter.id)
                            }
                            disabled={uploading}
                          />
                          <div className="space-y-3">
                            {uploading ? (
                              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    Upload admission letter
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">
                                    PDF, JPG, PNG (max 10MB each)
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </label>
                    </div>
                  </FormField>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          type="button"
          onClick={addLetter}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <Plus className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-700">
              Add Another Admission Letter
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Add multiple universities you've applied to
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
            disabled={admissionLetters.length === 0}
            className="px-8 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Continue to Co-Borrower
          </button>
        </div>
      </form>
    </motion.div>
  );
}