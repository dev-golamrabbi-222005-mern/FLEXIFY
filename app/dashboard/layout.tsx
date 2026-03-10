// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import DashboardNavbar from "./Share/DashboardNavbar";
import Sidebar from "./sidebar/Sidebar";


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    // ❶ h-screen + overflow-hidden — locks the whole layout to viewport height
    <div className="h-screen overflow-hidden flex flex-col bg-[var(--bg-primary)]">
      {/* Navbar — fixed at top, never scrolls */}
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((o) => !o)}
      />

      {/* ❷ flex-1 + overflow-hidden — fills remaining height, clips children */}
      <div className="flex flex-1 overflow-hidden">
        {/* ❸ Sidebar — h-full keeps it exactly as tall as this row */}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* ❹ Only this scrolls — sidebar stays put */}
        <main className="flex-1 overflow-y-auto p-4 md:px-0">{children}</main>
      </div>
    </div>
  );
}
