'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Inbox, 
  FileText, 
  LogOut, 
  HeadphonesIcon,
  X 
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/student/dashbord' },
    { icon: Inbox, label: 'Inbox', href: '/student/dashbord/inbox' },
    { icon: FileText, label: 'My Applications', href: '/student/dashbord/myapplication' },
  ];

  const bottomItems = [
    { icon: LogOut, label: 'Log out', href: '/logout' },
    { icon: HeadphonesIcon, label: 'Support', href: '/student/dashbord/support' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-orange-100 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-orange-100">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-gray-800">
            <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white">R</div>
            <span>REMITOUT</span>
          </div>
           
          {/* Close Button (Mobile Only) */}
          <button
            onClick={onClose}
            className="absolute right-4 top-4 lg:hidden text-gray-500 hover:text-orange-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col h-[calc(100%-4rem)] justify-between py-6">
          {/* Main Navigation */}
          <nav className="space-y-2 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-200'
                      : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={isActive ? 'text-white' : 'text-gray-400 group-hover:text-orange-500'} 
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Bottom Actions */}
          <div className="px-3 space-y-2">
            <div className="h-px bg-orange-100 my-2 mx-2" />
            
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-colors group"
                >
                  <Icon 
                    size={20} 
                    className="text-gray-400 group-hover:text-orange-500" 
                  />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
