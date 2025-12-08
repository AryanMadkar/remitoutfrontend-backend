"use client";

import Image from "next/image";
import { Mail, Phone, MapPin, User, Edit, FileText, Award } from "lucide-react";

export default function ProfileSidebar({ className = "" }) {
  const userData = {
    name: "Harish M",
    email: "harish.m@example.com",
    phone: "+91 98765 43210",
    address: "Mumbai, Maharashtra",
    uniqueId: "HYU67994003",
    profileComplete: 85,
    documentsUploaded: 12
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-full w-80 border-l border-gray-200 bg-white overflow-y-auto ${className}`}
    >
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Profile</h2>
          <button
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Edit profile"
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        {/* Profile Picture & Basic Info */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-3">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {userData.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <h3 className="text-lg font-bold text-gray-900">{userData.name}</h3>
          <p className="text-xs text-gray-500 mt-1">ID: {userData.uniqueId}</p>
        </div>

        {/* Progress Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-3 border border-orange-100">
            <div className="flex items-center justify-center mb-1">
              <Award className="h-4 w-4 text-orange-600" />
            </div>
            <div className="text-xl font-bold text-orange-700 text-center">{userData.profileComplete}%</div>
            <div className="text-[10px] text-gray-600 text-center mt-0.5">Profile Complete</div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-100">
            <div className="flex items-center justify-center mb-1">
              <FileText className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-blue-700 text-center">{userData.documentsUploaded}</div>
            <div className="text-[10px] text-gray-600 text-center mt-0.5">Documents</div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">Contact Info</h4>
          
          <div className="space-y-2">
            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500">Email</p>
                <p className="text-xs font-medium text-gray-900 truncate">{userData.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <Phone className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500">Phone</p>
                <p className="text-xs font-medium text-gray-900">{userData.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <MapPin className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-500">Location</p>
                <p className="text-xs font-medium text-gray-900">{userData.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button className="w-full py-2.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all">
            Edit Profile
          </button>
          <button className="w-full py-2.5 px-4 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
            View Documents
          </button>
        </div>

        {/* Additional Info Card */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-lg p-4 border border-orange-100">
          <h4 className="text-sm font-semibold text-orange-900 mb-2">Complete Your Profile</h4>
          <p className="text-xs text-gray-600 mb-3">
            Add more details to increase your loan approval chances.
          </p>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-600 to-amber-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${userData.profileComplete}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
