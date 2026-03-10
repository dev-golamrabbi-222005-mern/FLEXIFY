"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar/Sidebar";
import DashboardNavbar from "./Share/DashboardNavbar";
import Providers from "../(website)/providers";

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F8F9FD] text-slate-900">
      <Providers>
        {/* Mobile Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
          fixed inset-y-0 left-0 z-[70] w-72 bg-white transform transition-transform duration-300 ease-in-out border-r border-gray-100
          md:relative md:translate-x-0 md:sticky md:top-0 md:h-screen
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        >
          <Sidebar onClose={() => setIsSidebarOpen(false)} />
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 py-4 flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2"
            >
              <Menu size={24} />
            </button>
            <div className="flex-1">
              <DashboardNavbar />
            </div>
          </header>

          <main className="p-4 md:p-8">
            <div className="max-w-[1400px] mx-auto">{children}</div>
          </main>
        </div>
      </Providers>
    </div>
  );
}
