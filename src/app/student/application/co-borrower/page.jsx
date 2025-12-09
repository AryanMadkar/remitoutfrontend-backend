// app/(student)/application/co-borrower/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ApplicationLayout from '@/components/ApplicationLayout';
import { Users, Upload, CheckCircle, CreditCard } from 'lucide-react';

export default function CoBorrowerPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: '',
    occupation: '',
    annualIncome: '',
    panNumber: '',
    aadhaarNumber: '',
  });
  const [bankStatements, setBankStatements] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (files) => {
    setUploading(true);
    const uploadPromises = Array.from(files).map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      return { id: Date.now() + Math.random(), name: file.name, url: data.url };
    });
    
    try {
      const uploaded = await Promise.all(uploadPromises);
      setBankStatements([...bankStatements, ...uploaded]);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bankStatements.length < 6) {
      alert('Please upload at least 6 months of bank statements');
      return;
    }
    
    const payload = {
      ...formData,
      bankStatements: bankStatements.map(s => s.url),
    };
    
    const res = await fetch('/api/students/co-borrower', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (res.ok) {
      router.push('/application/results');
    }
  };

  return (
    <ApplicationLayout currentStep={6}>
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Co-Borrower Details</h2>
            <p className="text-purple-600 text-sm">Add your co-borrower/guarantor information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="Co-borrower's full name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Relationship
              </label>
              <select
                required
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              >
                <option value="">Select relationship</option>
                <option value="Father">Father</option>
                <option value="Mother">Mother</option>
                <option value="Spouse">Spouse</option>
                <option value="Sibling">Sibling</option>
                <option value="Guardian">Guardian</option>
              </select>
            </div>
          </div>

          {/* Contact */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Phone Number
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="+91 9876543210"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="email@example.com"
              />
            </div>
          </div>

          {/* Financial Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Occupation
              </label>
              <input
                type="text"
                required
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="Job title/business"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Annual Income
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.annualIncome}
                onChange={(e) => setFormData({ ...formData, annualIncome: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="Annual income in INR"
              />
            </div>
          </div>

          {/* ID Numbers */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-2">
                <CreditCard className="w-4 h-4" />
                PAN Number
              </label>
              <input
                type="text"
                required
                value={formData.panNumber}
                onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="ABCDE1234F"
                maxLength="10"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-2 block">
                Aadhaar Number
              </label>
              <input
                type="text"
                required
                value={formData.aadhaarNumber}
                onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                placeholder="1234 5678 9012"
                maxLength="12"
              />
            </div>
          </div>

          {/* Bank Statements Upload */}
          <div>
            <label className="text-sm font-semibold text-purple-900 mb-3 block">
              6 Months Bank Statements
            </label>
            <motion.label
              whileHover={{ scale: 1.01 }}
              className="relative flex flex-col items-center justify-center p-8 border-2 border-dashed border-purple-300 rounded-xl cursor-pointer hover:border-purple-500 transition-all bg-purple-50/50"
            >
              <input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
                className="sr-only"
                disabled={uploading}
              />
              
              {uploading ? (
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-purple-200 border-t-purple-600 mb-3" />
              ) : (
                <Upload className="w-10 h-10 text-purple-400 mb-3" />
              )}
              
              <p className="text-base font-semibold text-purple-900 mb-1">
                Upload 6 months bank statements
              </p>
              <p className="text-sm text-purple-500">
                PDF or images (one file per month recommended)
              </p>
            </motion.label>

            {/* Uploaded Files */}
            {bankStatements.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium text-purple-900">
                  Uploaded: {bankStatements.length} file(s) {bankStatements.length >= 6 && '✓'}
                </p>
                {bankStatements.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-xs text-purple-900 truncate">{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Warning */}
          {bankStatements.length > 0 && bankStatements.length < 6 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-900">
                ⚠️ Please upload at least 6 months of bank statements to proceed
              </p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-4">
            <motion.button
              type="button"
              onClick={() => router.back()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 border-2 border-purple-200 text-purple-700 font-semibold py-4 rounded-xl hover:bg-purple-50 transition-all"
            >
              ← Back
            </motion.button>
            <motion.button
              type="submit"
              disabled={bankStatements.length < 6}
              whileHover={{ scale: bankStatements.length >= 6 ? 1.02 : 1 }}
              whileTap={{ scale: bankStatements.length >= 6 ? 0.98 : 1 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Application →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </ApplicationLayout>
  );
}
