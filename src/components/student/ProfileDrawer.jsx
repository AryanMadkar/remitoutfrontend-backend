"use client";

import { X, Mail, Phone, MapPin, User, Edit } from "lucide-react";
import { useEffect, useState } from "react";

export default function ProfileDrawer({ isOpen, onClose }) {
  const [userData] = useState({
    name: "Student Name",
    email: "student@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra, India",
    uniqueId: "HYU67994003",
    profileComplete: 85,
    documentsUploaded: 12,
  });

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 h-full w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-orange-100 p-6">
            <h2 className="text-xl font-bold text-gray-900">Profile</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-50 rounded-lg transition-colors"
              aria-label="Close profile"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Avatar */}
            <div className="flex flex-col items-center">
              <div className="relative mb-3">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {userData.name.charAt(0).toUpperCase()}
                </div>
                <button
                  className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md hover:shadow-lg border border-orange-100"
                  aria-label="Edit profile picture"
                >
                  <Edit className="h-4 w-4 text-orange-600" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{userData.name}</h3>
              <p className="text-xs text-gray-500 mt-1">
                ID: {userData.uniqueId}
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
                <p className="text-xs text-gray-600">Profile Complete</p>
                <p className="text-2xl font-bold text-orange-700">
                  {userData.profileComplete}%
                </p>
              </div>
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                <p className="text-xs text-gray-600">Documents</p>
                <p className="text-2xl font-bold text-amber-700">
                  {userData.documentsUploaded}
                </p>
              </div>
            </div>

            {/* Contact info */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50">
                  <Mail className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-500">Email</p>
                    <p className="text-xs font-medium text-gray-900">
                      {userData.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50">
                  <Phone className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-500">Phone</p>
                    <p className="text-xs font-medium text-gray-900">
                      {userData.phone}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-orange-50">
                  <MapPin className="h-4 w-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-gray-500">Address</p>
                    <p className="text-xs font-medium text-gray-900">
                      {userData.address}
                    </p>
                    </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all">
                Edit Profile
              </button>
              <button className="w-full py-2.5 px-4 border border-orange-200 text-sm font-medium text-gray-800 rounded-lg hover:bg-orange-50">
                View Documents
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
