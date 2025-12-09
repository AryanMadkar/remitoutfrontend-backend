// app/student/application/co-borrower/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, CreditCard, Upload, User, Phone, Mail, Briefcase, DollarSign, Shield } from "lucide-react";
import FormField from "@/components/application/FormField";
import DocumentUpload from "@/components/application/DocumentUpload";

const CO_BORROWER_RELATIONSHIPS = [
  { value: "FATHER", label: "Father" },
  { value: "MOTHER", label: "Mother" },
  { value: "SPOUSE", label: "Spouse" },
  { value: "SIBLING", label: "Sibling" },
  { value: "GUARDIAN", label: "Guardian" },
  { value: "OTHER", label: "Other Relative" },
];

export default function CoBorrowerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    occupation: "",
    annualIncome: "",
    panNumber: "",
    aadhaarNumber: "",
    address: "",
  });
  
  const [kycDocuments, setKycDocuments] = useState({
    panFront: null,
    panBack: null,
    aadhaarFront: null,
    aadhaarBack: null,
    passport: null,
  });
  
  const [financialDocuments, setFinancialDocuments] = useState([]);
  const [uploading, setUploading] = useState({});
  const [verifying, setVerifying] = useState(false);

  const handleKycUpload = async (file, docType) => {
    setUploading((prev) => ({ ...prev, [docType]: true }));
    
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const objectUrl = URL.createObjectURL(file);
    setKycDocuments((prev) => ({
      ...prev,
      [docType]: {
        url: objectUrl,
        name: file.name,
        type: file.type,
      },
    }));
    
    setUploading((prev) => ({ ...prev, [docType]: false }));
  };

  const handleFinancialUpload = async (files) => {
    setUploading((prev) => ({ ...prev, financial: true }));
    
    // Simulate uploads
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const newDocuments = Array.from(files || []).map((file) => ({
      id: Date.now() + Math.random(),
      url: URL.createObjectURL(file),
      name: file.name,
      type: file.type,
      month: file.name, // In real app, extract month from filename or ask user
    }));
    
    setFinancialDocuments([...financialDocuments, ...newDocuments]);
    setUploading((prev) => ({ ...prev, financial: false }));
  };

  const removeFinancialDocument = (id) => {
    const doc = financialDocuments.find((d) => d.id === id);
    if (doc?.url) {
      URL.revokeObjectURL(doc.url);
    }
    setFinancialDocuments(financialDocuments.filter((d) => d.id !== id));
  };

  const getRequiredKycDocs = () => {
    const docs = [];
    if (formData.panNumber) {
      docs.push("panFront");
      docs.push("panBack");
    }
    if (formData.aadhaarNumber) {
      docs.push("aadhaarFront");
      docs.push("aadhaarBack");
    }
    return docs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = [
      "name",
      "relationship",
      "phone",
      "email",
      "occupation",
      "annualIncome",
    ];
    
    const isValid = requiredFields.every((field) => formData[field]);
    
    if (!isValid) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Validate KYC documents
    const requiredKycDocs = getRequiredKycDocs();
    const kycUploaded = requiredKycDocs.every((doc) => kycDocuments[doc]);
    
    if (!kycUploaded) {
      alert("Please upload all required KYC documents");
      return;
    }
    
    // Validate financial documents
    if (financialDocuments.length < 6) {
      alert("Please upload at least 6 months of bank statements");
      return;
    }
    
    setVerifying(true);
    
    // Simulate verification
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // API call would go here
    router.push("/student/application/results");
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
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-2xl font-light text-gray-900">
            Co-Borrower Details
          </h2>
        </div>
        <p className="text-gray-600">
          Add guarantor details to strengthen your loan application
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-12">
        {/* Personal Information Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b pb-2">
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" required>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="form-input pl-10"
                  required
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </FormField>

            <FormField label="Relationship" required>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Select relationship</option>
                {CO_BORROWER_RELATIONSHIPS.map((rel) => (
                  <option key={rel.value} value={rel.value}>
                    {rel.label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Phone Number" required>
              <div className="relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter phone number"
                  className="form-input pl-10"
                  required
                />
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </FormField>

            <FormField label="Email Address" required>
              <div className="relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="form-input pl-10"
                  required
                />
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </FormField>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b pb-2">
            Financial Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Occupation / Business" required>
              <div className="relative">
                <input
                  type="text"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="e.g., Business Owner, Engineer"
                  className="form-input pl-10"
                  required
                />
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </FormField>

            <FormField label="Annual Income (INR)" required>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="10000"
                  value={formData.annualIncome}
                  onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                  placeholder="Enter annual income"
                  className="form-input pl-10"
                  required
                />
                <DollarSign className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </FormField>

            <FormField label="PAN Number">
              <div className="relative">
                <input
                  type="text"
                  value={formData.panNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })
                  }
                  placeholder="ABCDE1234F"
                  maxLength={10}
                  className="form-input pl-10"
                />
                <CreditCard className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
            </FormField>

            <FormField label="Aadhaar Number">
              <input
                type="text"
                value={formData.aadhaarNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    aadhaarNumber: e.target.value.replace(/\D/g, ""),
                  })
                }
                placeholder="12-digit number"
                maxLength={12}
                className="form-input"
              />
            </FormField>

            <div className="md:col-span-2">
              <FormField label="Address">
                <textarea
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter complete address"
                  className="form-textarea"
                />
              </FormField>
            </div>
          </div>
        </div>

        {/* KYC Documents Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b pb-2">
            KYC Documents
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.panNumber && (
              <>
                <DocumentUpload
                  label="PAN Front"
                  documentId="panFront"
                  isUploaded={!!kycDocuments.panFront}
                  isUploading={uploading.panFront}
                  onUpload={(file) => handleKycUpload(file, "panFront")}
                />
                <DocumentUpload
                  label="PAN Back"
                  documentId="panBack"
                  isUploaded={!!kycDocuments.panBack}
                  isUploading={uploading.panBack}
                  onUpload={(file) => handleKycUpload(file, "panBack")}
                />
              </>
            )}
            
            {formData.aadhaarNumber && (
              <>
                <DocumentUpload
                  label="Aadhaar Front"
                  documentId="aadhaarFront"
                  isUploaded={!!kycDocuments.aadhaarFront}
                  isUploading={uploading.aadhaarFront}
                  onUpload={(file) => handleKycUpload(file, "aadhaarFront")}
                />
                <DocumentUpload
                  label="Aadhaar Back"
                  documentId="aadhaarBack"
                  isUploaded={!!kycDocuments.aadhaarBack}
                  isUploading={uploading.aadhaarBack}
                  onUpload={(file) => handleKycUpload(file, "aadhaarBack")}
                />
              </>
            )}
          </div>
        </div>

        {/* Financial Documents Section */}
        <div className="space-y-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider border-b pb-2">
            Financial Documents
          </h3>
          
          <div className="space-y-4">
            <FormField label="Bank Statements (Last 6 months minimum)">
              <div className="space-y-4">
                {financialDocuments.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {financialDocuments.map((doc) => (
                      <div
                        key={doc.id}
                        className="relative border border-gray-200 rounded-lg p-3 hover:border-blue-300 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                              📊
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                Bank Statement
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFinancialDocument(doc.id)}
                            className="p-1 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
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
                      onChange={(e) => handleFinancialUpload(e.target.files)}
                      disabled={uploading.financial}
                    />
                    <div className="space-y-3">
                      {uploading.financial ? (
                        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Upload bank statements
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Minimum 6 months recommended • PDF, JPG, PNG
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {financialDocuments.length} of 6+ months uploaded
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

        {/* Verification Animation */}
        {verifying && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Verifying Co-Borrower Details
              </h3>
              <p className="text-gray-600">
                Processing documents and financial information...
              </p>
            </div>
          </motion.div>
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
            disabled={financialDocuments.length < 6}
            className="px-8 py-3 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {verifying ? "Processing..." : "Submit Application"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}