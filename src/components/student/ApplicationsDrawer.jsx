'use client';
import { X, FileText } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsDrawer({ isOpen, onClose }) {
  const applications = [
    { id: 1, name: 'Loan Application', status: 'Pending', date: '2025-12-01', amount: '₹5,00,000' },
    { id: 2, name: 'KYC Verification', status: 'Approved', date: '2025-11-28', amount: '₹3,00,000' },
    { id: 3, name: 'Document Upload', status: 'Rejected', date: '2025-11-25', amount: '₹2,50,000' },
    { id: 4, name: 'Personal Loan', status: 'Pending', date: '2025-11-20', amount: '₹1,00,000' },
    { id: 5, name: 'Home Loan', status: 'Approved', date: '2025-11-15', amount: '₹50,00,000' },
  ];

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
        className={`fixed top-0 right-0 h-full w-full sm:w-[440px] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="bg-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">My Applications</h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white bg-orange-600 px-3 py-1 rounded-full">
              {applications.length}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-orange-600 transition-colors"
            >
              <X size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Scrollable Applications */}
        <div className="h-[calc(100%-64px)] overflow-y-auto">
          <div className="divide-y divide-gray-100">
            {applications.map((app) => (
              <div key={app.id} className="p-4 hover:bg-orange-50/30 transition-colors">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText size={20} className="text-orange-600" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 mb-1">{app.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{app.amount}</p>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                        app.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {app.status}
                      </span>
                      <span className="text-xs text-gray-500">{app.date}</span>
                    </div>

                    <Link 
                      href={`/dashboard/applications/${app.id}`}
                      onClick={onClose}
                      className="inline-block px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Button */}
          <div className="p-4">
            <Link 
              href="/dashboard/applications"
              onClick={onClose}
              className="block w-full py-3 text-center text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors border-2 border-purple-600"
            >
              View All Applications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
