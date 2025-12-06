'use client';
import ProfileSidebar from '@/components/student/ProfileSidebar';
import { Upload } from 'lucide-react';

export default function DashboardPage() {
  const loanProposals = [
    { id: 1, bank: 'Bank Name', status: 'Pending', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut' },
    { id: 2, bank: 'Bank Name', status: 'Approved', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut' },
    { id: 3, bank: 'Bank Name', status: 'Pending', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut' },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Main Content - Takes 2 columns on desktop */}
      <div className="xl:col-span-2 space-y-6">
        
        {/* Track Progress Section */}
        <div className="bg-white rounded-xl border-2 border-blue-400 p-6">
          <h2 className="text-2xl font-bold text-orange-500 mb-6">Track Progress</h2>
          
          {/* Status Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            
            {/* Loan Status Card */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Loan Status</h3>
              
              <div className="flex items-center justify-between gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-500 mb-1">02</div>
                  <div className="text-xs text-gray-500">Received</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-300 mb-1">00</div>
                  <div className="text-xs text-gray-400">On Hold</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-300 mb-1">01</div>
                  <div className="text-xs text-gray-400">Rejected</div>
                </div>
              </div>
            </div>

            {/* Document Status Card */}
            <div className="border border-gray-200 rounded-lg p-5">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Document Status</h3>
              
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-100 rounded flex items-center justify-center">
                    <Upload size={24} className="text-gray-400" />
                  </div>
                  <div className="text-xs text-gray-500">Status: Pending</div>
                </div>
                
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">
                  Upload
                </button>
              </div>
            </div>
          </div>

          {/* Loan Proposals Section */}
          <div className="border-t-2 border-dotted border-blue-300 pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-orange-500">Loan Proposals</h3>
              <span className="text-sm text-gray-500">03</span>
            </div>

            <div className="space-y-4">
              {loanProposals.map((proposal) => (
                <div key={proposal.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">{proposal.bank}</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {proposal.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                      <span className="text-xs text-gray-500">Status:</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        proposal.status === 'Approved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button className="px-4 py-2 border border-orange-500 text-orange-600 rounded-lg text-sm font-medium hover:bg-orange-50 transition-colors">
                      Reject
                    </button>
                    <button className="px-4 py-2 border border-purple-600 text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors">
                      Accept
                    </button>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                      View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 text-purple-600 font-medium hover:bg-purple-50 rounded-lg transition-colors">
              View More ↓
            </button>
          </div>
        </div>
      </div>

      {/* Profile Sidebar - HIDDEN on mobile (below lg), VISIBLE on desktop */}
      <div className="hidden xl:block xl:col-span-1">
        <ProfileSidebar className="sticky top-24" />
      </div>
    </div>
  );
}
