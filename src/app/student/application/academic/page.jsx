// app/(student)/application/academic/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationLayout from '@/components/ApplicationLayout';
import { BookOpen, Plus, Trash2, Upload, CheckCircle } from 'lucide-react';

export default function AcademicPage() {
  const router = useRouter();
  const [records, setRecords] = useState([
    { level: '', institution: '', percentage: '', year: '', document: null },
  ]);

  const addRecord = () => {
    setRecords([...records, { level: '', institution: '', percentage: '', year: '', document: null }]);
  };

  const removeRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
  };

  const updateRecord = (index, field, value) => {
    const updated = [...records];
    updated[index][field] = value;
    setRecords(updated);
  };

  const handleFileUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      updateRecord(index, 'document', data.url);
    } catch (error) {
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const res = await fetch('/api/students/academic-records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ records }),
    });
    
    if (res.ok) {
      router.push('/application/work-experience');
    }
  };

  return (
    <ApplicationLayout currentStep={3}>
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <BookOpen className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Academic Records</h2>
            <p className="text-purple-600 text-sm">Add your educational qualifications</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence>
            {records.map((record, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 border-2 border-purple-100 rounded-xl space-y-4 relative"
              >
                {/* Delete Button */}
                {records.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRecord(index)}
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}

                <h3 className="font-semibold text-purple-900 mb-4">Record {index + 1}</h3>

                {/* Education Level */}
                <div>
                  <label className="text-sm font-semibold text-purple-900 mb-2 block">
                    Education Level
                  </label>
                  <select
                    required
                    value={record.level}
                    onChange={(e) => updateRecord(index, 'level', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  >
                    <option value="">Select level</option>
                    <option value="10th">10th Standard</option>
                    <option value="12th">12th Standard</option>
                    <option value="Diploma">Diploma</option>
                    <option value="Bachelors">Bachelor's Degree</option>
                    <option value="Masters">Master's Degree</option>
                  </select>
                </div>

                {/* Institution */}
                <div>
                  <label className="text-sm font-semibold text-purple-900 mb-2 block">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    required
                    value={record.institution}
                    onChange={(e) => updateRecord(index, 'institution', e.target.value)}
                    className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="School/College/University name"
                  />
                </div>

                {/* Grid: Percentage & Year */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-purple-900 mb-2 block">
                      Percentage/CGPA
                    </label>
                    <input
                      type="text"
                      required
                      value={record.percentage}
                      onChange={(e) => updateRecord(index, 'percentage', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      placeholder="e.g., 85% or 8.5 CGPA"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-purple-900 mb-2 block">
                      Year of Completion
                    </label>
                    <input
                      type="number"
                      required
                      min="1990"
                      max="2030"
                      value={record.year}
                      onChange={(e) => updateRecord(index, 'year', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      placeholder="2020"
                    />
                  </div>
                </div>

                {/* Document Upload */}
                <div>
                  <label className="text-sm font-semibold text-purple-900 mb-3 block">
                    Upload Certificate/Marksheet
                  </label>
                  <motion.label
                    whileHover={{ scale: 1.01 }}
                    className="relative flex items-center justify-center p-4 border-2 border-dashed border-purple-200 rounded-xl cursor-pointer hover:border-purple-400 transition-all bg-purple-50/50"
                  >
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={(e) => handleFileUpload(index, e.target.files[0])}
                      className="sr-only"
                    />
                    {record.document ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="text-sm text-purple-900 font-medium">Document Uploaded</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-purple-600 font-medium">Click to upload</span>
                      </div>
                    )}
                  </motion.label>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Record Button */}
          <motion.button
            type="button"
            onClick={addRecord}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-semibold hover:bg-purple-50 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Another Record
          </motion.button>

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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Work Experience →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </ApplicationLayout>
  );
}
