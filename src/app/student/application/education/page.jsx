// app/(student)/application/education/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import ApplicationLayout from "@/components/ApplicationLayout";
import { GraduationCap, MapPin, Clock, DollarSign } from "lucide-react";

export default function EducationDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    targetCountry: "",
    degreeType: "",
    courseDurationMonths: "",
    courseDetails: "",
    loanAmountRequested: "",
    livingExpenseOption: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call
    const res = await fetch("/api/students/education-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      router.push("/application/kyc");
    }
  };

  return (
    <ApplicationLayout currentStep={1}>
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <GraduationCap className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">
              Education Details
            </h2>
            <p className="text-purple-600 text-sm">
              Tell us about your study plans
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Target Country */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-2">
              <MapPin className="w-4 h-4" />
              Target Country
            </label>
            <input
              type="text"
              required
              value={formData.targetCountry}
              onChange={(e) =>
                setFormData({ ...formData, targetCountry: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              placeholder="e.g., USA, UK, Canada"
            />
          </div>

          {/* Degree Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-2">
              <GraduationCap className="w-4 h-4" />
              Degree Type
            </label>
            <select
              required
              value={formData.degreeType}
              onChange={(e) =>
                setFormData({ ...formData, degreeType: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
            >
              <option value="">Select degree type</option>
              <option value="Bachelors">Bachelors</option>
              <option value="Masters">Masters</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {/* Course Duration */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-2">
              <Clock className="w-4 h-4" />
              Course Duration (Months)
            </label>
            <input
              type="number"
              required
              min="1"
              value={formData.courseDurationMonths}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  courseDurationMonths: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              placeholder="e.g., 24"
            />
          </div>

          {/* Course Details */}
          <div>
            <label className="text-sm font-semibold text-purple-900 mb-2 block">
              Course Details
            </label>
            <textarea
              required
              rows={4}
              value={formData.courseDetails}
              onChange={(e) =>
                setFormData({ ...formData, courseDetails: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
              placeholder="Describe your course, university, and program..."
            />
          </div>

          {/* Loan Amount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-2">
              <DollarSign className="w-4 h-4" />
              Loan Amount Requested
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.loanAmountRequested}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  loanAmountRequested: e.target.value,
                })
              }
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              placeholder="Amount in USD"
            />
          </div>

          {/* Living Expense Option */}
          <div>
            <label className="text-sm font-semibold text-purple-900 mb-3 block">
              Living Expenses
            </label>
            <div className="grid grid-cols-2 gap-4">
              {["WITH_LIVING_EXPENSE", "WITHOUT_LIVING_EXPENSE"].map(
                (option) => (
                  <motion.label
                    key={option}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center justify-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      formData.livingExpenseOption === option
                        ? "border-purple-600 bg-purple-50"
                        : "border-purple-100 hover:border-purple-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="livingExpense"
                      value={option}
                      checked={formData.livingExpenseOption === option}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          livingExpenseOption: e.target.value,
                        })
                      }
                      className="sr-only"
                    />
                    <span className="text-sm font-medium text-purple-900">
                      {option === "WITH_LIVING_EXPENSE"
                        ? "With Living Expense"
                        : "Without Living Expense"}
                    </span>
                  </motion.label>
                )
              )}
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
          >
            Continue to KYC Verification →
          </motion.button>
        </form>
      </motion.div>
    </ApplicationLayout>
  );
}
