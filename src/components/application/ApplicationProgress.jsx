// components/application/ApplicationProgress.jsx
"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function ApplicationProgress({ steps }) {
  const pathname = usePathname();
  const currentStep = pathname.split("/").pop() || "education";
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between relative">
        <div className="absolute top-3 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
        <div 
          className="absolute top-3 left-0 h-0.5 bg-blue-600 -z-10 transition-all duration-500"
          style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
        />
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <motion.div
              initial={false}
              animate={{
                scale: currentIndex >= index ? 1.1 : 1,
                backgroundColor: currentIndex >= index ? "#2563eb" : "#e5e7eb",
              }}
              className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                currentIndex > index ? "ring-4 ring-blue-100" : ""
              }`}
            >
              {currentIndex > index ? (
                <CheckIcon className="w-3 h-3 text-white" />
              ) : (
                <span className="text-xs font-medium text-white">
                  {index + 1}
                </span>
              )}
            </motion.div>
            <span className={`mt-2 text-xs font-medium text-center ${
              currentIndex >= index ? "text-gray-900" : "text-gray-500"
            }`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  );
}