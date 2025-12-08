"use client";

import { X, FileText, Clock, CheckCircle, XCircle, Search, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ApplicationsDrawer({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const applications = [
    { id: 1, name: "Education Loan", status: "Pending", date: "2025-12-01", amount: "₹5,00,000", bank: "HDFC Bank" },
    { id: 2, name: "KYC Verification", status: "Approved", date: "2025-11-28", amount: "₹3,00,000", bank: "ICICI Bank" },
    { id: 3, name: "Document Upload", status: "Rejected", date: "2025-11-25", amount: "₹2,50,000", bank: "SBI" },
    { id: 4, name: "Personal Loan", status: "Pending", date: "2025-11-20", amount: "₹1,00,000", bank: "Axis Bank" },
    { id: 5, name: "Study Abroad Loan", status: "Approved", date: "2025-11-15", amount: "₹50,00,000", bank: "HDFC Bank" },
  ];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Rejected":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "Pending":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-700 border-green-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      case "Pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.bank.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || app.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-[520px] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">My Applications</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close applications"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Search & Filter */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search applications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                      filterStatus === status
                        ? "bg-orange-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="flex-1 overflow-y-auto p-4">
            {filteredApplications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <FileText className="h-12 w-12 mb-2 text-gray-400" />
                <p>No applications found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/student/dashbord/application/${app.id}`}
                    onClick={onClose}
                    className="block p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all hover:border-orange-300"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {getStatusIcon(app.status)}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{app.name}</h3>
                          <p className="text-sm text-gray-500 truncate">{app.bank}</p>
                        </div>
                      </div>
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{app.date}</span>
                      <span className="font-semibold text-orange-700">{app.amount}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4">
            <Link
              href="/student/dashbord/myapplication"
              onClick={onClose}
              className="block w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-medium rounded-lg text-center hover:shadow-lg transition-all"
            >
              View All Applications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
