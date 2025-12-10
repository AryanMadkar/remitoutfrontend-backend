// app/student/application/education/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  GraduationCap,
  Calendar,
  DollarSign,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import FormField from "@/components/application/FormField";

export default function EducationPlanPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [hasExisting, setHasExisting] = useState(false);

  const [formData, setFormData] = useState({
    targetCountry: "",
    degreeType: "",
    courseDuration: "",
    university: "",
    program: "",
    intakeYear: "",
    loanAmount: "",
    currency: "USD",
    includeLivingExpenses: true,
  });

  // Check if questionnaire already exists
  useEffect(() => {
    checkExistingQuestionnaire();
  }, []);

  const checkExistingQuestionnaire = async () => {
    try {
      const res = await fetch("/api/student/questionnaire");
      const result = await res.json();

      if (result.success && result.data?.exists) {
        setHasExisting(true);
        if (result.data.data?.courseDetails) {
          setFormData(result.data.data.courseDetails);
        }
      }
    } catch (err) {
      console.error("Error checking questionnaire:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/student/questionnaire", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (result.success) {
        setSuccess("Education plan saved successfully!");
        setTimeout(() => {
          router.push("/student/application/kyc");
        }, 1500);
      } else {
        setError(result.message || "Failed to save education plan");
      }
    } catch (err) {
      setError("Network error. Please try again.");
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const currencies = [
    { value: "USD", label: "USD", symbol: "$" },
    { value: "EUR", label: "EUR", symbol: "€" },
    { value: "GBP", label: "GBP", symbol: "£" },
    { value: "INR", label: "INR", symbol: "₹" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Education Plan
            </h1>
            <p className="text-gray-700">
              Start with your destination and academic goals
            </p>

            {hasExisting && router.push("/student/application/kyc")}
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Target Country */}
            <FormField
              label="Target Country"
              icon={<MapPin size={18} />}
              required
            >
              <select
                value={formData.targetCountry}
                onChange={(e) =>
                  setFormData({ ...formData, targetCountry: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium transition-all"
                required
              >
                <option value="" className="text-gray-500">
                  Select country
                </option>
                <option value="United States" className="text-gray-900">
                  United States
                </option>
                <option value="United Kingdom" className="text-gray-900">
                  United Kingdom
                </option>
                <option value="Canada" className="text-gray-900">
                  Canada
                </option>
                <option value="Australia" className="text-gray-900">
                  Australia
                </option>
                <option value="Germany" className="text-gray-900">
                  Germany
                </option>
              </select>
            </FormField>

            {/* Degree Type */}
            <FormField
              label="Degree Type"
              icon={<GraduationCap size={18} />}
              required
            >
              <select
                value={formData.degreeType}
                onChange={(e) =>
                  setFormData({ ...formData, degreeType: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium transition-all"
                required
              >
                <option value="" className="text-gray-500">
                  Select degree
                </option>
                <option value="Bachelor's Degree" className="text-gray-900">
                  Bachelor's Degree
                </option>
                <option value="Master's Degree" className="text-gray-900">
                  Master's Degree
                </option>
                <option value="PhD" className="text-gray-900">
                  PhD
                </option>
                <option value="Diploma/Certificate" className="text-gray-900">
                  Diploma/Certificate
                </option>
              </select>
            </FormField>

            {/* University */}
            <FormField label="University (Optional)">
              <input
                type="text"
                value={formData.university}
                onChange={(e) =>
                  setFormData({ ...formData, university: e.target.value })
                }
                placeholder="e.g., Stanford University"
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400 transition-all"
              />
            </FormField>

            {/* Program */}
            <FormField label="Program/Major (Optional)">
              <input
                type="text"
                value={formData.program}
                onChange={(e) =>
                  setFormData({ ...formData, program: e.target.value })
                }
                placeholder="e.g., Computer Science"
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400 transition-all"
              />
            </FormField>

            {/* Course Duration */}
            <FormField
              label="Course Duration (Months)"
              icon={<Calendar size={18} />}
              required
            >
              <input
                type="number"
                value={formData.courseDuration}
                onChange={(e) =>
                  setFormData({ ...formData, courseDuration: e.target.value })
                }
                placeholder="e.g., 24"
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400 transition-all"
                required
              />
            </FormField>

            {/* Intake Year */}
            <FormField
              label="Intake Year"
              icon={<Calendar size={18} />}
              required
            >
              <select
                value={formData.intakeYear}
                onChange={(e) =>
                  setFormData({ ...formData, intakeYear: e.target.value })
                }
                className="w-full px-4 py-3 bg-white border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium transition-all"
                required
              >
                <option value="" className="text-gray-500">
                  Select year
                </option>
                {Array.from({ length: 5 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year} className="text-gray-900">
                      {year}
                    </option>
                  );
                })}
              </select>
            </FormField>

            {/* Loan Amount */}
            <FormField
              label="Loan Amount"
              icon={<DollarSign size={18} />}
              required
            >
              <div className="flex gap-2">
                <div className="flex items-center px-4 bg-purple-50 border border-purple-200 rounded-l-lg text-gray-900 font-bold">
                  {
                    currencies.find((c) => c.value === formData.currency)
                      ?.symbol
                  }
                </div>
                <input
                  type="number"
                  value={formData.loanAmount}
                  onChange={(e) =>
                    setFormData({ ...formData, loanAmount: e.target.value })
                  }
                  placeholder="Enter amount"
                  className="flex-1 px-4 py-3 bg-white border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium placeholder-gray-400 transition-all"
                  required
                />
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="px-4 py-3 bg-white border border-purple-200 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 font-medium transition-all"
                >
                  {currencies.map((currency) => (
                    <option
                      key={currency.value}
                      value={currency.value}
                      className="text-gray-900"
                    >
                      {currency.label}
                    </option>
                  ))}
                </select>
              </div>
            </FormField>

            {/* Living Expenses Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <input
                type="checkbox"
                id="livingExpenses"
                checked={formData.includeLivingExpenses}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    includeLivingExpenses: e.target.checked,
                  })
                }
                className="mt-1 w-4 h-4 text-purple-600 border-purple-300 rounded focus:ring-purple-500"
              />
              <label
                htmlFor="livingExpenses"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                Include living expenses in loan amount
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-purple-100">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Continue to KYC Verification
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
