// app/student/application/layout.jsx
import ApplicationLayout from "@/components/application/ApplicationLayout";
import ApplicationProgress from "@/components/application/ApplicationProgress";

export const metadata = {
  title: "Student Loan Application | EduFin",
  description: "Professional education financing application",
};

export default function StudentApplicationLayout({ children }) {
  const steps = [
    { id: "education", title: "Education Plan" },
    { id: "kyc", title: "KYC Verification" },
    { id: "academic", title: "Academic Records" },
    { id: "work", title: "Work Experience" },
    { id: "admission", title: "Admission Letters" },
    { id: "co-borrower", title: "Co-Borrower" },
    { id: "results", title: "Results" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <header className="mb-12">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            Education Loan Application
          </h1>
          <p className="text-gray-600 mt-2 font-light">
            Complete your application in 7 steps
          </p>
          <ApplicationProgress steps={steps} />
        </header>

        <main className="bg-white border border-gray-200 shadow-sm rounded-lg p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
