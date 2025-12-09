// app/student/onboarding/page.jsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowLeft } from "lucide-react";
import Image from "next/image";

// Components (defined in same file for now to give you one complete copy-paste, but you should separate them)
import Stepper from "@/components/onboarding/Stepper";
import Step1Personal from "@/components/onboarding/Step1Personal";
import Step2Course from "@/components/onboarding/Step2Course";
// Add other steps as placeholders or fully implemented if you have their designs
import StepPlaceholder from "@/components/onboarding/StepPlaceholder";

const TOTAL_STEPS = 5;

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    source: "",
    fullName: "",
    email: "",
    phone: "",
    location: "",
    referralCode: "",
    // Step 2
    degreeType: [], // multi-select checkboxes
    studyCountries: [], // multi-select
    courseDuration: "",
    // ... future steps
  });

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Personal
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <Step2Course
            data={formData}
            updateData={updateFormData}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      default:
        return (
          <StepPlaceholder
            step={currentStep}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Top Purple Header */}
      <div className="bg-gradient-to-r from-[#6a11cb] to-[#2575fc] text-white pt-8 pb-16 px-4 relative overflow-hidden">
        {/* Background Patterns (optional, for "pixel perfect" feel) */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/3 -translate-x-1/4 blur-2xl"></div>

        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Let's Get you Registered
          </h1>
          <p className="text-blue-100 text-sm md:text-base opacity-90">
            Let us know you better to find you the best offers and services!
          </p>
        </div>
      </div>

      {/* Stepper overlapping the header */}
      <div className="max-w-5xl mx-auto w-full px-4 -mt-8 relative z-20">
        <Stepper currentStep={currentStep} totalSteps={TOTAL_STEPS} />
      </div>

      {/* Main Content Card */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 mt-8 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[500px] p-6 md:p-10 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="h-full"
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Navigation (Global for steps that share it) */}
        <div className="flex justify-center items-center gap-4 mt-8">
            {/* Dots indicator */}
           <div className="flex gap-2">
               {[...Array(3)].map((_, i) => (
                   <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-orange-500' : 'bg-gray-200'}`}></div>
               ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
