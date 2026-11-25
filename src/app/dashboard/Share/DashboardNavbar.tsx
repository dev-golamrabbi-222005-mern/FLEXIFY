"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import ThemeToggle from "./ThemeToggle";
import { Bell,  CheckCheck } from "lucide-react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import Pusher from "pusher-js";
import { toast } from "react-toastify";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}
interface DashboardNavbarProps {
  sidebarOpen: boolean;
  onMenuToggle: () => void;
  user: {
    role: string;
    email: string;
    _id?: string;
  } | null;
}

const DashboardNavbar = ({
  sidebarOpen,
  onMenuToggle,
  user,
}: DashboardNavbarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotif, setShowNotif] = useState(false);
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
    if (!user?.role) return;

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const roleChannelName = `role-${user.role}`;
  const userChannelName = `user-${user.email.replace(/[@.]/g, "-")}`;

  const roleChannel = pusher.subscribe(roleChannelName);
  const userChannel = pusher.subscribe(userChannelName);
   const handleNewNotification = (data: { message: string }) => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substring(2, 9),
      message: data.message,
      time: new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: true 
      }),
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    toast.info(data.message, { 
      icon: <Bell size={16} className="text-[var(--primary)]" /> 
    });
  };
  roleChannel.bind("new-update", handleNewNotification);
  userChannel.bind("new-update", handleNewNotification);

    return () => {
      pusher.unsubscribe(roleChannelName);
    pusher.unsubscribe(userChannelName);
    };
  }, [user?.role , user?.email]);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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

         <div className="relative">
            <button 
              onClick={() => setShowNotif(!showNotif)}
              className={`p-2 rounded-lg transition-all relative ${
                showNotif ? 'bg-[var(--primary)] text-white' : 'hover:bg-[var(--bg-secondary)] text-[var(--text-primary)]'
              }`}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-black h-4 w-4 flex items-center justify-center rounded-full border-2 border-[var(--bg-nav-footer)]">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {showNotif && (
              <div className="absolute right-0 mt-3 w-64 md:w-80 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-2xl z-50 overflow-hidden">
                <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-tertiary)]">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-[10px] text-[var(--primary)] font-bold flex items-center gap-1 hover:underline">
                      <CheckCheck size={12} /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center">
                      <p className="text-[11px] text-[var(--text-secondary)] font-medium">No new updates</p>
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div key={n.id} className={`p-4 border-b border-[var(--border-color)] last:border-0 transition-colors ${n.read ? 'opacity-50' : 'bg-[rgba(244,121,32,0.05)] border-l-2 border-l-[var(--primary)]'}`}>
                        <p className="text-[11px] text-[var(--text-primary)] leading-relaxed">{n.message}</p>
                        <p className="text-[9px] text-[var(--text-secondary)] mt-2 font-bold">{n.time}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="md:hidden p-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors" onClick={onMenuToggle}>
            {sidebarOpen ? <FiX className="w-5 h-5 text-[var(--text-primary)]" /> : <FiMenu className="w-5 h-5 text-[var(--text-primary)]" />}
          </button>
        </div>
      </div>

          <div className="sm:hidden w-full flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-[var(--text-secondary)]" />
          <p className="text-[11px] font-semibold text-[var(--text-secondary)]">{formatDate(currentDate)}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => changeDay("prev")} className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors"><ChevronLeft size={14} /></button>
          <span className="text-[11px] font-bold text-[var(--primary)]">Day {currentDate.getDate()}</span>
          <button onClick={() => changeDay("next")} className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors"><ChevronRight size={14} /></button>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
