// app/(student)/application/kyc/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ApplicationLayout from '@/components/ApplicationLayout';
import { Shield, Upload, FileText, CheckCircle } from 'lucide-react';

export default function KYCPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    documentType: '',
    documentNumber: '',
    dateOfBirth: '',
    address: '',
    frontImage: null,
    backImage: null,
  });
  const [uploading, setUploading] = useState({ front: false, back: false });
  const [uploadedFiles, setUploadedFiles] = useState({ front: null, back: null });

  const handleFileUpload = async (file, side) => {
    setUploading({ ...uploading, [side]: true });
    
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      
      setUploadedFiles({ ...uploadedFiles, [side]: data.url });
      setFormData({ ...formData, [`${side}Image`]: data.url });
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading({ ...uploading, [side]: false });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/students/kyc', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    
    if (res.ok) {
      router.push('/application/academic');
    }
  };

  return (
    <ApplicationLayout currentStep={2}>
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">KYC Verification</h2>
            <p className="text-purple-600 text-sm">Verify your identity documents</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Document Type */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-900 mb-2">
              <FileText className="w-4 h-4" />
              Document Type
            </label>
            <select
              required
              value={formData.documentType}
              onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
            >
              <option value="">Select document type</option>
              <option value="AADHAAR">Aadhaar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENSE">Driving License</option>
              <option value="VOTER_ID">Voter ID</option>
            </select>
          </div>

          {/* Document Number */}
          <div>
            <label className="text-sm font-semibold text-purple-900 mb-2 block">
              Document Number
            </label>
            <input
              type="text"
              required
              value={formData.documentNumber}
              onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
              placeholder="Enter document number"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="text-sm font-semibold text-purple-900 mb-2 block">
              Date of Birth
            </label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
            />
          </div>

          {/* Address */}
          <div>
            <label className="text-sm font-semibold text-purple-900 mb-2 block">
              Current Address
            </label>
            <textarea
              required
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
              placeholder="Enter your complete address"
            />
          </div>

          {/* File Uploads */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Front Side */}
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-3 block">
                Front Side
              </label>
              <motion.label
                whileHover={{ scale: 1.02 }}
                className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all bg-purple-50/50"
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'front')}
                  className="sr-only"
                />
                {uploading.front ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600" />
                ) : uploadedFiles.front ? (
                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                )}
                <span className="text-sm text-purple-600 font-medium">
                  {uploadedFiles.front ? 'Uploaded ✓' : 'Click to upload'}
                </span>
              </motion.label>
            </div>

            {/* Back Side */}
            <div>
              <label className="text-sm font-semibold text-purple-900 mb-3 block">
                Back Side
              </label>
              <motion.label
                whileHover={{ scale: 1.02 }}
                className="relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all bg-purple-50/50"
              >
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => handleFileUpload(e.target.files[0], 'back')}
                  className="sr-only"
                />
                {uploading.back ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-200 border-t-purple-600" />
                ) : uploadedFiles.back ? (
                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                ) : (
                  <Upload className="w-8 h-8 text-purple-400 mb-2" />
                )}
                <span className="text-sm text-purple-600 font-medium">
                  {uploadedFiles.back ? 'Uploaded ✓' : 'Click to upload'}
                </span>
              </motion.label>
            </div>
          </div>

          {/* Navigation Buttons */}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Academic Records →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </ApplicationLayout>
  );
}
