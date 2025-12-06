export default function ApplicationDetailPage({ params }) {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Application #{params.id}
      </h1>
      
      <div className="bg-white rounded-xl border border-orange-100 shadow-sm p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Application Type</label>
            <p className="text-lg text-gray-800 mt-1">Loan Application</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="text-lg text-gray-800 mt-1">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                Pending Review
              </span>
            </p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-600">Submitted Date</label>
            <p className="text-lg text-gray-800 mt-1">December 1, 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
