"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./navbar";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Changed from gray-50 to white for cleaner look */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen transition-all duration-300">
        <Navbar onMenuClick={() => setSidebarOpen(true)} userName="Harish M" />

        <main className="flex-1 p-4 lg:p-8 pt-20 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
