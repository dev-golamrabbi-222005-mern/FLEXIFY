"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiMenu, FiX } from "react-icons/fi";
import { Bell } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { NotificationDrawer } from "@/components/dashboard/notifications/NotificationDrawer";
import { useDashboardNotifications } from "./useDashboardNotifications";
import { DashboardDateNavigator } from "./DashboardDateNavigator";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
  user: {
    role: string;
    email: string;
    _id?: string;
  } | null;
}

export default function DashboardNavbar({
  sidebarOpen,
  onMenuToggle,
  user,
}: DashboardNavbarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const {
    notifications,
    showDrawer,
    setShowDrawer,
    unreadCount,
    markAllAsRead,
    clearAll,
    handleItemClick,
  } = useDashboardNotifications(user);

  const changeDay = (type: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (type === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md w-full">
      <div className="flex items-center justify-between px-4 py-2 w-full">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Logo-Flexify.png"
            alt="Flexify"
            width={100}
            height={100}
            className="w-24 md:w-28"
          />
        </Link>

        {/* Desktop Date Navigator */}
        <DashboardDateNavigator
          currentDate={currentDate}
          onPrevDay={() => changeDay("prev")}
          onNextDay={() => changeDay("next")}
        />

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={() => setShowDrawer(true)}
            className={`p-2 rounded-lg transition-all relative cursor-pointer ${
              showDrawer
                ? "bg-[var(--primary)] text-white"
                : "hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]"
            }`}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-[var(--bg-nav-footer)] animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors cursor-pointer"
            onClick={onMenuToggle}
          >
            {sidebarOpen ? (
              <FiX className="w-5 h-5 text-[var(--text-primary)]" />
            ) : (
              <FiMenu className="w-5 h-5 text-[var(--text-primary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Date Navigator */}
      <DashboardDateNavigator
        currentDate={currentDate}
        onPrevDay={() => changeDay("prev")}
        onNextDay={() => changeDay("next")}
        isMobile
      />

      <NotificationDrawer
        isOpen={showDrawer}
        onClose={() => setShowDrawer(false)}
        notifications={notifications}
        onMarkAllRead={markAllAsRead}
        onClearAll={clearAll}
        onItemClick={handleItemClick}
      />
    </nav>
  );
}
