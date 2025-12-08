"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Eye, X } from "lucide-react";
import Link from "next/link";

const MOCK_APPLICATION = {
  id: "1",
  title: "Course Details",
  applicantName: "Harish M",
  courseCountry: "",
  degreeType: "Bachelor’s (secured loan)",
  loanAmount: "",
  referralCode: "REF8792464",
};

const DOCUMENT_SECTIONS = [
  {
    id: "kyc",
    title: "Student KYC Documents",
    fields: [
      { id: "pan", label: "PAN Card", fileName: "pan_card.jpg" },
      { id: "aadhaar", label: "Aadhaar Card", fileName: "aadhaar_card.jpg" },
      { id: "passport", label: "Passport", fileName: "passport.pdf" },
    ],
  },
  {
    id: "marksheets",
    title: "Academic Marksheets",
    fields: [
      {
        id: "12th",
        label: "12th grade marksheet",
        fileName: "12th_marksheet.pdf",
      },
      {
        id: "grad",
        label: "Graduation marksheet",
        fileName: "graduation_marksheet.pdf",
      },
    ],
  },
  {
    id: "work",
    title: "Work Experience",
    fields: [
      {
        id: "exp",
        label: "Experience letter",
        fileName: "experience_letter.pdf",
      },
    ],
  },
];

export default function ApplicationDetailPage({ params }) {
  const application = { ...MOCK_APPLICATION, id: params.id };

  const [openSectionIds, setOpenSectionIds] = useState(
    DOCUMENT_SECTIONS.map((s) => s.id)
  );
  const [previewDoc, setPreviewDoc] = useState(null); // {label, fileName}

  const toggleSection = (id) => {
    setOpenSectionIds((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/student/dashbord/myapplication"
        className="text-xs sm:text-sm text-orange-600 hover:underline"
      >
        ← Back to My Applications
      </Link>

      {/* Page header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {application.title}
          </h1>
          <p className="text-sm text-gray-600">
            Application ID #{application.id}
          </p>
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg border border-orange-200 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50">
          Edit
        </button>
      </header>

      {/* Main layout: left quick profile + right form */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]">
        {/* Left column: mini profile / summary */}
        <aside className="rounded-xl border border-orange-100 bg-white shadow-sm p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-lg font-semibold">
              {application.applicantName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900">
                {application.applicantName}
              </p>
              <p className="text-xs text-gray-500">Unique ID: HYU67994603</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-700">
            <div>
              <p className="font-semibold text-gray-900">Education</p>
              <p>Course & university details will appear here.</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Test Scores</p>
              <p>GRE, IELTS, TOEFL or others if available.</p>
            </div>
          </div>
        </aside>

        {/* Right column: course form + documents */}
        <section className="rounded-xl border border-orange-100 bg-white shadow-sm p-4 sm:p-6 space-y-6">
          {/* Course questions */}
          <div className="space-y-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Course Details
            </h2>

            <div className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-gray-700 font-medium">
                  1. Where are you planning to study?
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter country and city"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  2. Type of degree?
                </label>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  <button className="rounded-full border border-orange-300 bg-orange-50 px-3 py-1 font-medium text-orange-700">
                    Bachelor (secured loan)
                  </button>
                  <button className="rounded-full border border-gray-200 px-3 py-1 text-gray-700">
                    Masters
                  </button>
                  <button className="rounded-full border border-gray-200 px-3 py-1 text-gray-700">
                    Other
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  3. What is the duration of the course?
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter duration (e.g. 2 years)"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  4. What is the loan amount required?
                </label>
                <input
                  type="text"
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Enter required amount"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Referral Code
                </label>
                <input
                  type="text"
                  defaultValue={application.referralCode}
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium">
                  Additional details (optional)
                </label>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Add any extra information you want banks to see."
                />
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              Attached Documents
            </h3>

            <div className="space-y-3">
              {DOCUMENT_SECTIONS.map((section) => {
                const isOpen = openSectionIds.includes(section.id);
                return (
                  <div
                    key={section.id}
                    className="rounded-lg border border-gray-200 bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(section.id)}
                      className="flex w-full items-center justify-between px-3 sm:px-4 py-2 sm:py-3"
                    >
                      <span className="text-xs sm:text-sm font-medium text-gray-900">
                        {section.title}
                      </span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="border-t border-gray-200 px-3 sm:px-4 py-3 space-y-2">
                        {section.fields.map((field) => (
                          <div
                            key={field.id}
                            className="flex items-center justify-between gap-2 rounded-md bg-white border border-gray-200 px-3 py-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="h-4 w-4 text-orange-500" />
                              <div className="min-w-0">
                                <p className="text-xs font-medium text-gray-900 truncate">
                                  {field.label}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate">
                                  {field.fileName}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewDoc({
                                  label: field.label,
                                  fileName: field.fileName,
                                  // replace with your real URL:
                                  url: "/sample.pdf",
                                })
                              }
                              className="inline-flex items-center gap-1 rounded-full border border-orange-200 px-2 py-1 text-[11px] font-medium text-orange-700 hover:bg-orange-50"
                            >
                              <Eye className="h-3 w-3" />
                              View
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </div>

      {/* Preview modal / overlay */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="relative w-full max-w-4xl h-[80vh] bg-gray-900/90 p-4 sm:p-6">
            <button
              onClick={() => setPreviewDoc(null)}
              className="absolute right-4 top-4 rounded-full bg-black/60 p-2 text-white hover:bg-black"
              aria-label="Close preview"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-3 flex items-center justify-between text-xs sm:text-sm text-white">
              <span className="font-medium">{previewDoc.fileName}</span>
              <span>{previewDoc.label}</span>
            </div>

            <div className="h-full w-full bg-white flex items-center justify-center">
              {/* Replace this iframe src with your real doc viewer URL */}
              <iframe
                src={previewDoc.url}
                className="h-full w-full"
                title={previewDoc.fileName}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
