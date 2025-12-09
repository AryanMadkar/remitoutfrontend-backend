"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  FileText,
  LogOut,
  HeadphonesIcon,
  X,
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/student/dashbord" },
    // { icon: Inbox, label: "Inbox", href: "/student/dashboard/inbox" },
    // {
    //   icon: FileText,
    //   label: "My Applications",
    //   href: "/student/dashboard/myapplication",
    // },
  ];

  const bottomItems = [
    { icon: HeadphonesIcon, label: "Support", href: "/student/dashbord/support" },
    { icon: LogOut, label: "Log out", href: "/logout" },
  ];

  // Only Dashboard is exact; others are active for child routes too
  const isActive = (href) => {
    if (href === "/student/dashbord") {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-orange-100 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-orange-100">
            <Link href="/student/dashbord" className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Student
              </span>
            </Link>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-orange-50 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Main menu */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-orange-50 text-orange-700 border border-orange-200"
                          : "text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          active ? "text-orange-600" : "text-gray-500"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Bottom items */}
          <div className="border-t border-orange-100 p-3">
            <ul className="space-y-1">
              {bottomItems.map((item) => {
                const Icon = item.icon;
                const isLogout = item.label === "Log out";
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isLogout
                          ? "text-red-600 hover:bg-red-50"
                          : "text-gray-700 hover:bg-orange-50"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          isLogout ? "text-red-500" : "text-gray-500"
                        }`}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </aside>
    </>
  );
}
