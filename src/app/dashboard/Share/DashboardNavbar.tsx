"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { Bell, CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";
import {
  NotificationDrawer,
  NotificationItem,
} from "@/components/dashboard/notifications/NotificationDrawer";
import { cleanChannelIdentifier } from "@/lib/notifications/dispatch";

interface DashboardNavbarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
  user: {
    role: string;
    email: string;
    _id?: string;
  } | null;
}

const STORAGE_KEY = "flexify_dashboard_notifications";

const DashboardNavbar = ({
  sidebarOpen,
  onMenuToggle,
  user,
}: DashboardNavbarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showDrawer, setShowDrawer] = useState(false);

  // Load persisted notifications on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (e) {
      console.warn("Failed to load notifications from storage", e);
    }
  }, []);

  const saveNotifications = (items: NotificationItem[]) => {
    setNotifications(items);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 50)));
    } catch (e) {
      console.warn("Failed to save notifications to storage", e);
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const changeDay = (type: "prev" | "next") => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (type === "next" ? 1 : -1));
    setCurrentDate(newDate);
  };

  useEffect(() => {
    if (!user?.role || !user?.email) return;

    const pusherKey = process.env.NEXT_PUBLIC_PUSHER_KEY;
    const pusherCluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;
    if (!pusherKey || !pusherCluster) return;

    const pusher = new Pusher(pusherKey, {
      cluster: pusherCluster,
    });

    const roleChannelName = `role-${cleanChannelIdentifier(user.role)}`;
    const userChannelName = `user-${cleanChannelIdentifier(user.email)}`;

    const roleChannel = pusher.subscribe(roleChannelName);
    const userChannel = pusher.subscribe(userChannelName);

    const handleNewNotification = (data: {
      id?: string;
      title?: string;
      message: string;
      type?: string;
      link?: string;
    }) => {
      const newNotif: NotificationItem = {
        id: data.id || Math.random().toString(36).substring(2, 9),
        title: data.title || "New Update",
        message: data.message,
        type: data.type || "system",
        link: data.link,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => {
        const updated = [newNotif, ...prev.filter((item) => item.id !== newNotif.id)];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 50)));
        } catch {
          // Ignore storage quota errors
        }
        return updated;
      });

      toast.info(data.message, {
        icon: <Bell size={16} className="text-[var(--primary)]" />,
      });
    };

    roleChannel.bind("new-update", handleNewNotification);
    userChannel.bind("new-update", handleNewNotification);

    return () => {
      pusher.unsubscribe(roleChannelName);
      pusher.unsubscribe(userChannelName);
    };
  }, [user?.role, user?.email]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    saveNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const handleItemClick = (id: string) => {
    saveNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <nav className="bg-[var(--bg-nav-footer)] sticky top-0 z-50 shadow-md w-full">
      <div className="flex items-center justify-between px-4 py-2 w-full">
        {/* ── Logo ── */}
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/Logo-Flexify.png"
            alt="Flexify"
            width={100}
            height={100}
            className="w-24 md:w-28"
          />
        </Link>

        {/* ── Date Navigator — sm+ ── */}
        <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
          <CalendarDays
            className="text-[var(--text-secondary)] shrink-0"
            size={18}
          />
          <div className="leading-tight">
            <p className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wide">
              Day {currentDate.getDate()}, Week{" "}
              {Math.ceil(currentDate.getDate() / 7)}
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              {formatDate(currentDate)}
            </p>
          </div>
          <div className="flex items-center gap-1 ml-1">
            <button
              onClick={() => changeDay("prev")}
              className="p-1 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ChevronLeft size={16} className="text-[var(--text-secondary)]" />
            </button>
            <button
              onClick={() => changeDay("next")}
              className="p-1 rounded-lg hover:bg-[var(--bg-primary)] transition-colors"
            >
              <ChevronRight
                size={16}
                className="text-[var(--text-secondary)]"
              />
            </button>
          </div>
        </div>

        {/* ── Right Actions ── */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          <button
            onClick={() => setShowDrawer(true)}
            className={`p-2 rounded-lg transition-all relative ${
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
            className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
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

      <div className="sm:hidden w-full flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-[var(--text-secondary)]" />
          <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
            {formatDate(currentDate)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => changeDay("prev")}
            className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[11px] font-bold text-[var(--primary)]">
            Day {currentDate.getDate()}
          </span>
          <button
            onClick={() => changeDay("next")}
            className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

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
};

export default DashboardNavbar;
