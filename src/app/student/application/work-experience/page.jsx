// app/student/application/work/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Plus, Trash2, Upload, Calendar, Building2 } from "lucide-react";
import FormField from "@/components/application/FormField";

export default function WorkExperiencePage() {
  const router = useRouter();
  const [hasExperience, setHasExperience] = useState(true);
  const [experiences, setExperiences] = useState([
    {
      id: 1,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      isCurrent: false,
      description: "",
      salarySlips: [],
      experienceLetter: null,
    },
  ]);

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        isCurrent: false,
        description: "",
        salarySlips: [],
        experienceLetter: null,
      },
    ]);
  };

  const removeExperience = (id) => {
    if (experiences.length > 1) {
      setExperiences(experiences.filter((exp) => exp.id !== id));
    }
  };

  const updateExperience = (id, field, value) => {
    setExperiences(
      experiences.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const handleFileUpload = async (file, experienceId, type) => {
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const objectUrl = URL.createObjectURL(file);
    
    if (type === "salarySlip") {
      setExperiences(
        experiences.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                salarySlips: [
                  ...exp.salarySlips,
                  { id: Date.now(), url: objectUrl, name: file.name },
                ],
              }
            : exp
        )
      );
    } else if (type === "experienceLetter") {
      setExperiences(
        experiences.map((exp) =>
          exp.id === experienceId
            ? {
                ...exp,
                experienceLetter: {
                  url: objectUrl,
                  name: file.name,
                },
              }
            : exp
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (hasExperience) {
      // Validate experiences
      const isValid = experiences.every(
        (exp) =>
          exp.company &&
          exp.position &&
          exp.startDate &&
          (exp.isCurrent || exp.endDate)
      );
      
      if (!isValid) {
        alert("Please fill in all required fields");
        return;
      }
    }
    
    // API call would go here
    router.push("/student/application/admission");
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
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-light text-gray-900">
              Work Experience
            </h2>
            <div className="flex items-center space-x-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!hasExperience}
                  onChange={(e) => setHasExperience(!e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  I am a fresher (no work experience)
                </span>
              </label>
            </div>
          </div>
        </div>
        <p className="text-gray-600">
          Add your professional background and upload supporting documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {hasExperience && (
          <AnimatePresence>
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className="relative border border-gray-200 rounded-lg p-6 bg-white"
              >
                <div className="absolute top-4 right-4">
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-gray-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Work Experience {index + 1}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField label="Company Name" required>
                    <div className="relative">
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, "company", e.target.value)
                        }
                        placeholder="e.g., Google Inc."
                        className="form-input pl-10"
                        required
                      />
                      <Building2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </FormField>

                  <FormField label="Position / Role" required>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={(e) =>
                        updateExperience(exp.id, "position", e.target.value)
                      }
                      placeholder="e.g., Software Engineer"
                      className="form-input"
                      required
                    />
                  </FormField>

                  <FormField label="Start Date" required>
                    <div className="relative">
                      <input
                        type="date"
                        value={exp.startDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "startDate", e.target.value)
                        }
                        className="form-input pl-10"
                        required
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </FormField>

                  <FormField label="End Date" required={!exp.isCurrent}>
                    <div className="relative">
                      <input
                        type="date"
                        value={exp.endDate}
                        onChange={(e) =>
                          updateExperience(exp.id, "endDate", e.target.value)
                        }
                        className={`form-input pl-10 ${
                          exp.isCurrent ? "bg-gray-50 text-gray-400" : ""
                        }`}
                        disabled={exp.isCurrent}
                        required={!exp.isCurrent}
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </FormField>

                  <div className="md:col-span-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={exp.isCurrent}
                        onChange={(e) =>
                          updateExperience(exp.id, "isCurrent", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-600">
                        I currently work here
                      </span>
                    </label>
                  </div>

                  <div className="md:col-span-2">
                    <FormField label="Job Description">
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, "description", e.target.value)
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        className="form-textarea"
                      />
                    </FormField>
                  </div>

                  {/* Experience Letter Upload */}
                  <div className="md:col-span-2">
                    <FormField label="Experience / Offer Letter">
                      <div className="space-y-3">
                        {exp.experienceLetter ? (
                          <div className="flex items-center justify-between border border-gray-200 rounded-lg p-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center">
                                📄
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {exp.experienceLetter.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Experience Letter
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                window.open(exp.experienceLetter.url, "_blank")
                              }
                              className="text-sm text-blue-600 hover:text-blue-800"
                            >
                              View
                            </button>
                          </div>
                        ) : (
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                              <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="sr-only"
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    handleFileUpload(
                                      file,
                                      exp.id,
                                      "experienceLetter"
                                    );
                                  }
                                }}
                              />
                              <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                              <p className="text-sm text-gray-600">
                                Upload experience or offer letter
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PDF, JPG, PNG (max 5MB)
                              </p>
                            </div>
                          </label>
                        )}
                      </div>
                    </FormField>
                  </div>

                  {/* Salary Slips Upload */}
                  <div className="md:col-span-2">
                    <FormField label="Salary Slips (Last 3 months)">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {exp.salarySlips.map((slip) => (
                            <div
                              key={slip.id}
                              className="border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                                    💵
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      {slip.name}
                                    </p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    window.open(slip.url, "_blank")
                                  }
                                  className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                  View
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {exp.salarySlips.length < 3 && (
                          <label className="block">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer">
                              <input
                                type="file"
                                multiple
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="sr-only"
                                onChange={(e) => {
                                  Array.from(e.target.files || []).forEach(
                                    (file) => {
                                      handleFileUpload(
                                        file,
                                        exp.id,
                                        "salarySlip"
                                      );
                                    }
                                  );
                                }}
                              />
                              <div className="space-y-2">
                                <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                                <p className="text-sm text-gray-600">
                                  Upload salary slips
                                </p>
                                <p className="text-xs text-gray-500">
                                  Minimum 3 months recommended
                                </p>
                              </div>
                            </div>
                          </label>
                        )}
                      </div>
                    </FormField>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {hasExperience && experiences.length > 0 && (
          <button
            type="button"
            onClick={addExperience}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center justify-center space-x-2">
              <Plus className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Add Another Work Experience
              </span>
            </div>
          </button>
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
            className="px-8 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Continue to Admission Letters
          </button>
        </div>
      </form>
    </motion.div>
  );
}