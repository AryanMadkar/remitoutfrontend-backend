// app/(student)/application/results/page.js
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, CheckCircle, TrendingUp, Clock } from 'lucide-react';

export default function ResultsPage() {
  const [nbfcs, setNbfcs] = useState([]);

  useEffect(() => {
    // Fetch matched NBFCs
    fetch('/api/loan/matched-nbfcs')
      .then((res) => res.json())
      .then((data) => setNbfcs(data.nbfcs || []));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex p-4 bg-green-100 rounded-full mb-4"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.6 }}
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h1 className="text-4xl font-bold text-purple-900 mb-2">
            Application Complete!
          </h1>
          <p className="text-purple-600 text-lg">
            We found {nbfcs.length} lenders matching your profile
          </p>
        </motion.div>

        {/* NBFC Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {nbfcs.map((nbfc, idx) => (
            <motion.div
              key={nbfc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-2xl transition-all"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{nbfc.companyName}</h3>
                      <p className="text-purple-100 text-sm">{nbfc.registrationNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="p-6 space-y-4">
                {/* Interest Rate */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Interest Rate</span>
                  </div>
                  <span className="text-lg font-bold text-purple-700">
                    {nbfc.interestRate || '8.5'}%
                  </span>
                </div>

                {/* Processing Time */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-purple-900">Processing Time</span>
                  </div>
                  <span className="text-sm font-semibold text-purple-700">7-10 days</span>
                </div>

                {/* Contact */}
                <div className="pt-4 border-t border-purple-100">
                  <p className="text-sm text-purple-600 mb-1">Contact</p>
                  <p className="text-sm font-medium text-purple-900">{nbfc.email}</p>
                  <p className="text-sm font-medium text-purple-900">{nbfc.phoneNumber}</p>
                </div>

                {/* Apply Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    // Handle application to NBFC
                    alert(`Applying to ${nbfc.companyName}`);
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                >
                  Apply Now →
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {nbfcs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-purple-600">No lenders found. Please contact support.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
