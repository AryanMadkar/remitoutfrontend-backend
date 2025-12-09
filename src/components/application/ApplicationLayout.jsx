// components/ApplicationLayout.jsx
"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";

const STEPS = [
  { id: 1, name: "Education Details", path: "/application/education" },
  { id: 2, name: "KYC Verification", path: "/application/kyc" },
  { id: 3, name: "Academic Records", path: "/application/academic" },
  { id: 4, name: "Work Experience", path: "/application/work-experience" },
  { id: 5, name: "Admission Letters", path: "/application/admission" },
  { id: 6, name: "Co-Borrower Details", path: "/application/co-borrower" },
];

export default function ApplicationLayout({ children, currentStep = 1 }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-purple-900">
            Loan Application Portal
          </h1>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-5 left-0 w-full h-1 bg-purple-100">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-purple-600"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {/* Steps */}
          <div className="relative flex justify-between">
            {STEPS.map((step, idx) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;

              return (
                <motion.div
                  key={step.id}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Circle */}
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all
                      ${
                        isCompleted
                          ? "bg-purple-600 border-purple-600"
                          : isCurrent
                          ? "bg-white border-purple-600 ring-4 ring-purple-100"
                          : "bg-white border-purple-200"
                      }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${
                          isCurrent ? "text-purple-600" : "text-purple-300"
                        }`}
                      >
                        {step.id}
                      </span>
                    )}
                  </motion.div>

                  {/* Label */}
                  <p
                    className={`mt-2 text-xs font-medium text-center max-w-[100px] ${
                      isCurrent ? "text-purple-900" : "text-purple-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
