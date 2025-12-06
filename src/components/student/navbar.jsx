'use client';
import { Menu, Search, Bell, ChevronDown, Inbox, FileText } from 'lucide-react';

export default function Navbar({ 
  onMenuClick, 
  onProfileClick, 
  onInboxClick, 
  onApplicationsClick,
  userName = "Harish M" 
}) {
  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-white border-b border-orange-100 z-30 transition-all duration-300">
      <div className="flex items-center justify-between h-full px-4 lg:px-8">
        
        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 -ml-2 text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          {/* Mobile Logo */}
          <span className="font-bold text-lg text-gray-800">REMITOUT</span>
        </div>

        {/* Search Bar (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-xl ml-4">
          <div className="relative w-full group">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" 
              size={18} 
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all text-sm"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Inbox Icon (Mobile Only) */}
          <button 
            onClick={onInboxClick}
            className="lg:hidden p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors relative"
          >
            <Inbox size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>

          {/* Applications Icon (Mobile Only) */}
          <button 
            onClick={onApplicationsClick}
            className="lg:hidden p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors"
          >
            <FileText size={20} />
          </button>

          {/* Search Icon (Mobile Only - Tablet) */}
          <button className="md:hidden p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-full">
            <Search size={20} />
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-orange-500 border-2 border-white rounded-full"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>

          {/* User Profile */}
          <button 
            onClick={onProfileClick}
            className="flex items-center gap-3 hover:bg-orange-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-orange-100"
          >
            <div className="w-8 h-8 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-sm">
              {userName.charAt(0)}
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-semibold text-gray-700 leading-none">{userName}</span>
            </div>
            <ChevronDown size={16} className="text-gray-400 hidden lg:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
