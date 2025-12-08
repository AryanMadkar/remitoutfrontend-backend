"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./navbar";
import ProfileDrawer from "./ProfileDrawer";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="lg:pl-64">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          onProfileClick={() => setProfileOpen(true)}
        />
        <main className="p-4 lg:p-8">{children}</main>
      </div>

      {/* Profile drawer – only opens when profile icon is clicked */}
      <ProfileDrawer isOpen={profileOpen} onClose={() => setProfileOpen(false)} />
    </div>
  );
}
