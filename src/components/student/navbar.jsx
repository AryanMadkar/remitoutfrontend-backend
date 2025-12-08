"use client";

import { Menu, Search, Bell, ChevronDown, User } from "lucide-react";
import { useState } from "react";

export default function Navbar({
  onMenuClick,
  onProfileClick,
  userName = "Student",
}) {
  const [notificationCount] = useState(3);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <nav className="sticky top-0 z-40 border-b border-orange-100 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6 text-orange-700" />
          </button>

          {/* Desktop search */}
          <div className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search applications, documents..."
                className="w-full pl-10 pr-4 py-2 border border-orange-100 rounded-lg bg-orange-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all text-sm"
              />
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2 lg:gap-4">
          {/* Notifications */}
          <button
            className="p-2 hover:bg-orange-50 rounded-lg transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5 text-orange-700" />
            {notificationCount > 0 && (
              <span className="absolute top-0 right-0 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Profile – always opens drawer */}
          <button
            onClick={onProfileClick}
            className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg transition-colors"
            aria-label="Open profile"
          >
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-800">
                {userName}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-orange-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 border border-orange-100 rounded-lg bg-orange-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
          />
        </div>
      </div>
    </nav>
  );
}
