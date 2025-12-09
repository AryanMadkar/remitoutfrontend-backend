// app/student/application/results/page.jsx
"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  CheckCircle, Building2, TrendingUp, Clock, 
  DollarSign, Percent, Award, Shield
} from "lucide-react";

const MOCK_NBFCS = [
  {
    id: 1,
    name: "EduFin Capital",
    interestRate: 8.5,
    processingTime: "5-7 days",
    maxAmount: "₹50 Lakhs",
    approvalRate: "95%",
    rating: 4.8,
    features: [
      "No collateral required",
      "Flexible repayment",
      "Quick disbursal",
    ],
    contact: {
      email: "contact@edufincapital.com",
      phone: "+91 1800 123 4567",
    },
  },
  {
    id: 2,
    name: "Global Student Loans",
    interestRate: 7.9,
    processingTime: "7-10 days",
    maxAmount: "₹75 Lakhs",
    approvalRate: "92%",
    rating: 4.6,
    features: [
      "Coverage for 50+ countries",
      "Co-signer optional",
      "Grace period included",
    ],
    contact: {
      email: "info@globalstudentloans.com",
      phone: "+91 1800 987 6543",
    },
  },
  {
    id: 3,
    name: "Academic Finance Inc.",
    interestRate: 9.2,
    processingTime: "3-5 days",
    maxAmount: "₹30 Lakhs",
    approvalRate: "98%",
    rating: 4.7,
    features: [
      "Instant approval",
      "Digital processing",
      "No hidden charges",
    ],
    contact: {
      email: "support@academicfinance.com",
      phone: "+91 1800 555 1234",
    },
  },
  {
    id: 4,
    name: "Future Education Funds",
    interestRate: 8.1,
    processingTime: "10-14 days",
    maxAmount: "₹1 Crore",
    approvalRate: "90%",
    rating: 4.5,
    features: [
      "High loan amounts",
      "Long repayment tenure",
      "Career counseling",
    ],
    contact: {
      email: "apply@futureeducation.com",
      phone: "+91 1800 222 3333",
    },
  },
];

export default function ResultsPage() {
  const [nbfcs, setNbfcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNbfc, setSelectedNbfc] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNbfcs(MOCK_NBFCS);
      setLoading(false);
    }, 1500);
  }, []);

  const applyToNbfc = (nbfc) => {
    setSelectedNbfc(nbfc);
    // In real app, this would redirect to application or show modal
    alert(`Redirecting to ${nbfc.name} application...`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Analyzing your profile and finding best matches...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      {/* Success Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex p-4 bg-green-100 rounded-full mb-4"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          Application Complete!
        </h1>
        <p className="text-gray-600 text-lg">
          We found {nbfcs.length} lenders matching your profile
        </p>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center"
        >
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">
            {nbfcs.length}
          </p>
          <p className="text-sm text-gray-600">Lenders Available</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center"
        >
          <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Percent className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">
            {Math.min(...nbfcs.map(n => n.interestRate)).toFixed(1)}%
          </p>
          <p className="text-sm text-gray-600">Lowest Interest Rate</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center"
        >
          <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">3-5</p>
          <p className="text-sm text-gray-600">Fastest Processing (Days)</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white border border-gray-200 rounded-lg p-4 text-center"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <Award className="w-6 h-6 text-amber-600" />
          </div>
          <p className="text-2xl font-light text-gray-900 mb-1">
            {Math.max(...nbfcs.map(n => n.rating)).toFixed(1)}
          </p>
          <p className="text-sm text-gray-600">Highest Rating</p>
        </motion.div>
      </div>

      {/* NBFC Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {nbfcs.map((nbfc, index) => (
          <motion.div
            key={nbfc.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all"
          >
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium">{nbfc.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(nbfc.rating)
                                ? "text-yellow-400"
                                : "text-white/40"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm">{nbfc.rating}</span>
                      <span className="text-sm opacity-80">
                        ({nbfc.approvalRate} approval)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-6 space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Interest Rate</span>
                  </div>
                  <p className="text-2xl font-light text-blue-600">
                    {nbfc.interestRate}%
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>Processing Time</span>
                  </div>
                  <p className="text-xl font-medium text-gray-900">
                    {nbfc.processingTime}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <DollarSign className="w-4 h-4" />
                    <span>Max Amount</span>
                  </div>
                  <p className="text-xl font-medium text-gray-900">
                    {nbfc.maxAmount}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Percent className="w-4 h-4" />
                    <span>Approval Rate</span>
                  </div>
                  <p className="text-xl font-medium text-gray-900">
                    {nbfc.approvalRate}
                  </p>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Key Features
                </h4>
                <ul className="space-y-2">
                  {nbfc.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      Contact Information
                    </p>
                    <p className="text-sm text-gray-600">{nbfc.contact.email}</p>
                    <p className="text-sm text-gray-600">{nbfc.contact.phone}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => applyToNbfc(nbfc)}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => alert(`Compare ${nbfc.name}`)}
                  className="border border-gray-300 text-gray-700 py-3 px-4 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Compare
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-blue-50 border border-blue-100 rounded-lg p-6"
      >
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Next Steps
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">1</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              Select a Lender
            </p>
            <p className="text-sm text-gray-600">
              Choose from the available lenders based on your preferences
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">2</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              Complete Application
            </p>
            <p className="text-sm text-gray-600">
              Fill the lender's specific application form
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium">3</span>
            </div>
            <p className="text-sm font-medium text-gray-900">
              Get Disbursement
            </p>
            <p className="text-sm text-gray-600">
              Receive funds directly to your account
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}