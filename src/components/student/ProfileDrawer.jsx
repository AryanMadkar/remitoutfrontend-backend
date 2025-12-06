'use client';
import { X, Mail, Phone, MapPin, User } from 'lucide-react';

export default function ProfileDrawer({ isOpen, onClose }) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X size={24} className="text-gray-600" />
        </button>

        {/* Scrollable Content */}
        <div className="h-full overflow-y-auto">
          {/* Profile Image Section */}
          <div className="relative h-32 bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-green-400 to-cyan-500 overflow-hidden">
                <img 
                  src="/profile.jpg" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-3xl font-bold">H</div>';
                  }}
                />
              </div>
            </div>
          </div>

          <div className="pt-14 pb-6 px-6">
            {/* Title and Edit */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-800">My Profile</h2>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                Edit
              </button>
            </div>

            {/* Unique ID */}
            <div className="mb-4 pb-4 border-b border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Unique ID:</p>
              <p className="text-sm font-semibold text-gray-800">HYU67994003</p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <User size={16} className="text-gray-400" />
                <span>Harish M Kanol</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>+91 76374 86793</span>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail size={16} className="text-gray-400" />
                <span>kanolm@gmail.com</span>
              </div>
              
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin size={16} className="text-gray-400 mt-0.5" />
                <span>234, Sweet Life Apt., Cross Rd, Indranagar, Bengaluru, Karnataka 560982</span>
              </div>
            </div>

            {/* Profile Status */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Profile Status</h3>
              
              <div className="flex items-center justify-between gap-4">
                {/* Profile Complete Circle */}
                <div className="flex flex-col items-center">
                  <div className="relative w-20 h-20">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="#fee5d9"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="32"
                        stroke="#fb923c"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${2 * Math.PI * 32}`}
                        strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.68)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-orange-500">68%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">Profile<br/>Complete</p>
                </div>

                {/* Documents Uploaded */}
                <div className="flex flex-col items-center">
                  <div className="text-center">
                    <span className="text-3xl font-bold text-orange-500">07</span>
                    <span className="text-xl text-gray-300">/13</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center">Documents<br/>Uploaded</p>
                </div>
              </div>
            </div>

            {/* Join Community Button */}
            <button className="w-full py-3 px-4 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2">
              <User size={18} />
              <span>Join Community</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
