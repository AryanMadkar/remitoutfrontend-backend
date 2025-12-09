// app/(student)/application/admission/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import ApplicationLayout from '@/components/ApplicationLayout';
import { FileText, Upload, CheckCircle, X } from 'lucide-react';

export default function AdmissionPage() {
  const router = useRouter();
  const [admissionLetters, setAdmissionLetters] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      
      setAdmissionLetters([...admissionLetters, {
        id: Date.now(),
        name: file.name,
        url: data.url,
      }]);
    } catch (error) {
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (id) => {
    setAdmissionLetters(admissionLetters.filter(f => f.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (admissionLetters.length === 0) {
      alert('Please upload at least one admission letter');
      return;
    }
    
    const res = await fetch('/api/students/admission-letters', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ letters: admissionLetters }),
    });
    
    if (res.ok) {
      router.push('/application/co-borrower');
    }
  };

  return (
    <ApplicationLayout currentStep={5}>
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <FileText className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Admission Letters</h2>
            <p className="text-purple-600 text-sm">Upload your university admission letters</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Upload Zone */}
          <motion.label
            whileHover={{ scale: 1.01 }}
            className="relative flex flex-col items-center justify-center p-12 border-2 border-dashed border-purple-300 rounded-2xl cursor-pointer hover:border-purple-500 transition-all bg-gradient-to-br from-purple-50/50 to-white"
          >
            <input
              type="file"
              accept="image/*,application/pdf"
              multiple
              onChange={(e) => {
                Array.from(e.target.files).forEach(handleFileUpload);
              }}
              className="sr-only"
              disabled={uploading}
            />
            
            {uploading ? (
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200 border-t-purple-600 mb-4" />
            ) : (
              <Upload className="w-12 h-12 text-purple-400 mb-4" />
            )}
            
            <p className="text-lg font-semibold text-purple-900 mb-1">
              Click to upload admission letters
            </p>
            <p className="text-sm text-purple-500">
              PDF, PNG, JPG (Max 10MB each)
            </p>
          </motion.label>

          {/* Uploaded Files List */}
          {admissionLetters.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-purple-900">Uploaded Documents ({admissionLetters.length})</h3>
              {admissionLetters.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm font-medium text-purple-900 truncate">{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-red-500" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Please upload clear copies of all admission letters from universities you've applied to or been accepted at. Multiple documents are accepted.
            </p>
          </div>

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
              disabled={admissionLetters.length === 0}
              whileHover={{ scale: admissionLetters.length > 0 ? 1.02 : 1 }}
              whileTap={{ scale: admissionLetters.length > 0 ? 0.98 : 1 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Co-Borrower Details →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </ApplicationLayout>
  );
}
