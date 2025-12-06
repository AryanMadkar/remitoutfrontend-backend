'use client';
import { useState } from 'react';
import Sidebar from '@/components/student/Sidebar';
import Navbar from '@/components/student/navbar';
import ProfileDrawer from '@/components/student/ProfileDrawer';
import InboxDrawer from '@/components/student/InboxDrawer';
import ApplicationsDrawer from '@/components/student/ApplicationsDrawer';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);
  const [inboxDrawerOpen, setInboxDrawerOpen] = useState(false);
  const [applicationsDrawerOpen, setApplicationsDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <ProfileDrawer 
        isOpen={profileDrawerOpen} 
        onClose={() => setProfileDrawerOpen(false)} 
      />
      
      <InboxDrawer 
        isOpen={inboxDrawerOpen} 
        onClose={() => setInboxDrawerOpen(false)} 
      />
      
      <ApplicationsDrawer 
        isOpen={applicationsDrawerOpen} 
        onClose={() => setApplicationsDrawerOpen(false)} 
      />
      
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen transition-all duration-300">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          onProfileClick={() => setProfileDrawerOpen(true)}
          onInboxClick={() => setInboxDrawerOpen(true)}
          onApplicationsClick={() => setApplicationsDrawerOpen(true)}
          userName="Harish M" 
        />
        
        <main className="flex-1 p-4 lg:p-8 pt-20 bg-gray-50/50">
          {children}
        </main>
      </div>
    </div>
  );
}
