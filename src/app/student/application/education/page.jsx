// app/student/application/education/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, GraduationCap, Calendar, DollarSign } from "lucide-react";
import FormField from "@/components/application/FormField";

export default function EducationPlanPage() {
  const router = useRouter();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API call would go here
    router.push("/student/application/kyc");
  };

  const currencies = [
    { value: "USD", label: "USD", symbol: "$" },
    { value: "EUR", label: "EUR", symbol: "€" },
    { value: "GBP", label: "GBP", symbol: "£" },
    { value: "INR", label: "INR", symbol: "₹" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-8">
        <h2 className="text-2xl font-light text-gray-900 mb-2">Education Plan</h2>
        <p className="text-gray-600">Start with your destination and academic goals</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            label="Target Country"
            icon={<MapPin className="w-4 h-4" />}
            required
          >
            <select
              value={formData.targetCountry}
              onChange={(e) => setFormData({ ...formData, targetCountry: e.target.value })}
              className="form-select"
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
            </select>
          </FormField>

          <FormField
            label="Degree Type"
            icon={<GraduationCap className="w-4 h-4" />}
            required
          >
            <select
              value={formData.degreeType}
              onChange={(e) => setFormData({ ...formData, degreeType: e.target.value })}
              className="form-select"
            >
              <option value="">Select degree</option>
              <option value="BACHELORS">Bachelor's Degree</option>
              <option value="MASTERS">Master's Degree</option>
              <option value="PHD">PhD</option>
              <option value="DIPLOMA">Diploma/Certificate</option>
            </select>
          </FormField>

          <FormField
            label="University Name"
            required
          >
            <input
              type="text"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              placeholder="e.g., Stanford University"
              className="form-input"
            />
          </FormField>

          <FormField
            label="Program / Course"
            required
          >
            <input
              type="text"
              value={formData.program}
              onChange={(e) => setFormData({ ...formData, program: e.target.value })}
              placeholder="e.g., Computer Science"
              className="form-input"
            />
          </FormField>

          <FormField
            label="Course Duration (Months)"
            icon={<Calendar className="w-4 h-4" />}
            required
          >
            <input
              type="number"
              min="1"
              value={formData.courseDuration}
              onChange={(e) => setFormData({ ...formData, courseDuration: e.target.value })}
              placeholder="e.g., 24"
              className="form-input"
            />
          </FormField>

          <FormField
            label="Intake Year"
            required
          >
            <select
              value={formData.intakeYear}
              onChange={(e) => setFormData({ ...formData, intakeYear: e.target.value })}
              className="form-select"
            >
              <option value="">Select year</option>
              {Array.from({ length: 5 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </FormField>

          <div className="md:col-span-2 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <FormField
                label="Loan Amount Required"
                icon={<DollarSign className="w-4 h-4" />}
                required
              >
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                    {currencies.find(c => c.value === formData.currency)?.symbol}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.loanAmount}
                    onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                    placeholder="Enter amount"
                    className="form-input rounded-l-none flex-1"
                  />
                </div>
              </FormField>
            </div>
            <FormField label="Currency">
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="form-select"
              >
                {currencies.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.includeLivingExpenses}
                  onChange={(e) => setFormData({ ...formData, includeLivingExpenses: e.target.checked })}
                  className="sr-only"
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${
                  formData.includeLivingExpenses ? 'bg-blue-600' : 'bg-gray-300'
                }`}>
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    formData.includeLivingExpenses ? 'transform translate-x-5' : 'transform translate-x-1'
                  }`} />
                </div>
              </div>
              <span className="text-sm font-medium text-gray-700">
                Include living expenses in loan amount
              </span>
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
          <button
            type="submit"
            className="group flex items-center space-x-2 px-8 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Continue to KYC Verification</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </form>
    </motion.div>
  );
}