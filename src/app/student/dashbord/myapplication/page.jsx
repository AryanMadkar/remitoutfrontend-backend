import Link from 'next/link';

export default function ApplicationsPage() {
  const applications = [
    { id: 1, name: 'Loan Application', status: 'Pending', date: '2025-12-01' },
    { id: 2, name: 'KYC Verification', status: 'Approved', date: '2025-11-28' },
    { id: 3, name: 'Document Upload', status: 'Rejected', date: '2025-11-25' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Applications</h1>
      
      <div className="bg-white rounded-xl border border-orange-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-orange-50 border-b border-orange-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Application</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-orange-50/50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-800">{app.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                    app.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {app.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                <td className="px-6 py-4">
                  <Link 
                    href={`/dashboard/applications/${app.id}`}
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
