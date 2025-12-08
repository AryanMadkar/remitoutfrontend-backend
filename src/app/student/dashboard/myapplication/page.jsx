// app/student/dashbord/myapplication/page.jsx
import Link from "next/link";

export default function ApplicationsPage() {
  const applications = [
    { id: 1, name: "Loan Application", status: "Pending", date: "2025-12-01" },
    { id: 2, name: "KYC Verification", status: "Approved", date: "2025-11-28" },
    { id: 3, name: "Document Upload", status: "Rejected", date: "2025-11-25" },
  ];

  const getStatusClass = (status) => {
    if (status === "Approved") return "bg-green-50 text-green-700 border-green-200";
    if (status === "Pending") return "bg-yellow-50 text-yellow-700 border-yellow-200";
    if (status === "Rejected") return "bg-red-50 text-red-700 border-red-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-4">
      {/* Page title */}
      <h1 className="text-xl font-bold text-gray-900">My Applications</h1>
      <p className="text-sm text-gray-600">
        View the status of all your loan and KYC applications.
      </p>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-orange-100 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-orange-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Application
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-orange-50/40">
                <td className="px-4 py-3 text-gray-900">{app.name}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${getStatusClass(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{app.date}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/student/dashbord/myapplication/${app.id}`}
                    className="text-xs font-medium text-orange-600 hover:underline"
                  >
                    View details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {applications.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-500">
            No applications found.
          </div>
        )}
      </div>
    </div>
  );
}
