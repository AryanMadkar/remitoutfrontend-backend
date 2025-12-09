// app/student/questionnaire/page.jsx
"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Check, ArrowLeft, ArrowRight } from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Information", subtitle: "Let us know about you" },
  { id: 2, title: "Course Details", subtitle: "Where & what you want to study" },
  { id: 3, title: "Academic Details", subtitle: "Your education background" },
  { id: 4, title: "Co-borrower Info", subtitle: "Optional co-applicant details" },
  { id: 5, title: "Document Upload", subtitle: "Upload required documents" },
];

const QuestionnairePage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Fetch existing data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/student/questionnaire");
      if (res.data.data) {
        setData(res.data.data);
        setCurrentStep(res.data.data.currentStep || 1);
        if (res.data.data.isCompleted) {
          setIsCompleted(true);
        }
      }
    } catch (err) {
      console.error("Fetch questionnaire error:", err);
    }
  };

  const validateStep = useCallback((step) => {
    const errors = {};
    // Add validation per step - example
    if (step === 1) {
      if (!data.fullName) errors.fullName = "Required";
      if (!data.email) errors.email = "Required";
    }
    // Add more...
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [data]);

  const saveStep = async (nextStep = null) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        currentStep,
        ...(nextStep && { currentStep: nextStep }),
        isCompleted: nextStep === 6,
      };
      await axios.post("/api/student/questionnaire", payload);
      if (nextStep === 6) {
        setIsCompleted(true);
        router.push("/student/dashboard");
        return;
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      saveStep(currentStep + 1);
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const updateField = (field, value) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // Clear error
    setValidationErrors((prev) => ({ ...prev, [field]: "" }));
  };

  if (isCompleted) {
    return <div>Questionnaire completed! Redirecting...</div>;
  }

  const step = STEPS[currentStep - 1];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white p-4 md:p-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 rounded-2xl mb-6 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Let&apos;s Get You Registered</h1>
        <p className="text-purple-100">Let you register to find the best offers and services</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2 text-sm font-medium text-orange-600">
          {STEPS.slice(0, currentStep).map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2`}>
                {i + 1}
              </div>
              <span>{s.title}</span>
            </div>
          ))}
        </div>
        <div className="flex -space-x-1">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                i + 1 < currentStep
                  ? "bg-orange-500"
                  : i + 1 === currentStep
                  ? "bg-purple-500 border-4 border-purple-200"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step Content - Exact replica card */}
      <div className={`bg-white rounded-2xl p-6 md:p-8 shadow-lg border-4 border-purple-200 transition-all duration-500 ${
        currentStep === 1 ? "border-purple-300 ring-4 ring-purple-100/50" : ""
      }`}>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center text-xl font-bold mr-4">
            0{currentStep}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{step.title}</h2>
            <p className="text-gray-600">{step.subtitle}</p>
          </div>
        </div>

        {/* Dynamic fields per step - exact from images */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                value={data.fullName || ""}
                onChange={(e) => updateField("fullName", e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              />
              {validationErrors.fullName && <p className="text-red-500 text-sm mt-1">{validationErrors.fullName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email ID</label>
                <input type="email" value={data.email || ""} onChange={(e) => updateField("email", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input type="tel" value={data.phoneNumber || ""} onChange={(e) => updateField("phoneNumber", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Referral Code (Optional)</label>
              <input type="text" value={data.referralCode || ""} onChange={(e) => updateField("referralCode", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            {/* How found us - dropdown replica */}
            <div>
              <label className="block text-sm font-semibold mb-2">How did you find about us?</label>
              <select value={data.howFoundUs || ""} onChange={(e) => updateField("howFoundUs", e.target.value)} className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500">
                <option value="">Select</option>
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                {/* Add more from images */}
              </select>
            </div>
            {/* Course type radio */}
            <div>
              <label className="block text-sm font-semibold mb-4">Select the type of degree you want to pursue:</label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="courseType" value="masters_secured" checked={data.courseType === "masters_secured"} onChange={(e) => updateField("courseType", e.target.value)} className="mr-3" />
                  Masters (only secured loan)
                </label>
                {/* Replica others */}
              </div>
            </div>
          </div>
        )}

        {/* Add similar blocks for steps 3-5: checkboxes for countries, dropdown duration, etc. */}
        {currentStep === 3 && (
          <div>
            {/* Countries checkboxes */}
            <h3>Where are you planning to study? (Select all that apply)</h3>
            {/* Multi checkboxes */}
          </div>
        )}
        {/* Step 4,5 similar */}
      </div>

      {/* Bottom Nav - exact replica */}
      <div className="fixed bottom-4 left-4 right-4 md:relative md:mb-8 md:flex md:justify-between md:static">
        <button onClick={goBack} className="inline-flex items-center px-4 py-3 text-gray-600 hover:text-gray-800 transition">
          <ArrowLeft size={20} className="mr-2" />
          Back
        </button>
        <div className="flex items-center mx-auto md:ml-auto">
          <div className="flex space-x-1 mx-4">
            {STEPS.map((s) => (
              <div key={s.id} className={`w-2 h-2 rounded-full ${s.id === currentStep ? 'bg-purple-500' : 'bg-gray-300'}`} />
            ))}
          </div>
        </div>
        <button
          onClick={goNext}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg transition-all disabled:opacity-50 flex items-center"
        >
          {currentStep === 5 ? "Complete" : "Next"}
          <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    </div>
  );
};

export default QuestionnairePage;
