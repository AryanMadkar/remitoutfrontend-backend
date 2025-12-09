// app/(student)/application/work-experience/page.js
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ApplicationLayout from '@/components/ApplicationLayout';
import { Briefcase, Plus, Trash2, Upload, CheckCircle } from 'lucide-react';

export default function WorkExperiencePage() {
  const router = useRouter();
  const [hasExperience, setHasExperience] = useState(true);
  const [experiences, setExperiences] = useState([
    { company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '', document: null },
  ]);

  const addExperience = () => {
    setExperiences([...experiences, { company: '', position: '', startDate: '', endDate: '', isCurrent: false, description: '', document: null }]);
  };

  const removeExperience = (index) => {
    setExperiences(experiences.filter((_, i) => i !== index));
  };

  const updateExperience = (index, field, value) => {
    const updated = [...experiences];
    updated[index][field] = value;
    setExperiences(updated);
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
      updateExperience(index, 'document', data.url);
    } catch (error) {
      alert('Upload failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = hasExperience ? { experiences } : { hasExperience: false };
    
    const res = await fetch('/api/students/work-experience', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    if (res.ok) {
      router.push('/application/admission');
    }
  };

  return (
    <ApplicationLayout currentStep={4}>
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-xl">
            <Briefcase className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-purple-900">Work Experience</h2>
            <p className="text-purple-600 text-sm">Tell us about your professional background</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Has Experience Toggle */}
          <div className="p-4 bg-purple-50 rounded-xl">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasExperience}
                onChange={(e) => setHasExperience(e.target.checked)}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="font-medium text-purple-900">
                I have work experience
              </span>
            </label>
          </div>

          {hasExperience && (
            <AnimatePresence>
              {experiences.map((exp, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 border-2 border-purple-100 rounded-xl space-y-4 relative"
                >
                  {experiences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}

                  <h3 className="font-semibold text-purple-900 mb-4">Experience {index + 1}</h3>

                  {/* Company & Position */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-purple-900 mb-2 block">
                        Company Name
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-purple-900 mb-2 block">
                        Position/Role
                      </label>
                      <input
                        type="text"
                        required
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        placeholder="Your role"
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-purple-900 mb-2 block">
                        Start Date
                      </label>
                      <input
                        type="month"
                        required
                        value={exp.startDate}
                        onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-purple-900 mb-2 block">
                        End Date
                      </label>
                      <input
                        type="month"
                        required={!exp.isCurrent}
                        disabled={exp.isCurrent}
                        value={exp.endDate}
                        onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                        className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all disabled:bg-gray-50"
                      />
                      <label className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          checked={exp.isCurrent}
                          onChange={(e) => updateExperience(index, 'isCurrent', e.target.checked)}
                          className="w-4 h-4 text-purple-600 rounded"
                        />
                        <span className="text-xs text-purple-600">Currently working here</span>
                      </label>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="text-sm font-semibold text-purple-900 mb-2 block">
                      Job Description
                    </label>
                    <textarea
                      rows={3}
                      value={exp.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                      placeholder="Brief description of your role and responsibilities"
                    />
                  </div>

                  {/* Document Upload */}
                  <div>
                    <label className="text-sm font-semibold text-purple-900 mb-3 block">
                      Upload Experience Letter/Offer Letter
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
                      {exp.document ? (
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

              {/* Add Experience Button */}
              <motion.button
                type="button"
                onClick={addExperience}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 font-semibold hover:bg-purple-50 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Another Experience
              </motion.button>
            </AnimatePresence>
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Continue to Admission Letters →
            </motion.button>
          </div>
        </form>
      </motion.div>
    </ApplicationLayout>
  );
}
