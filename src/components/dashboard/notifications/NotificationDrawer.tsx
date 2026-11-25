"use client";

import React from "react";
import Link from "next/link";
import { X, CheckCheck, Trash2, Bell, CreditCard, Dumbbell, User, Mail, Sparkles } from "lucide-react";

export interface NotificationItem {
  id: string;
  title?: string;
  message: string;
  time: string;
  timestamp?: number;
  read: boolean;
  type?: string;
  link?: string;
}

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onClearAll: () => void;
  onItemClick: (id: string) => void;
}

export function NotificationDrawer({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onClearAll,
  onItemClick,
}: NotificationDrawerProps) {
  if (!isOpen) return null;

  const getIcon = (type?: string) => {
    switch (type) {
      case "payment":
        return <CreditCard size={16} className="text-emerald-400" />;
      case "workout":
        return <Dumbbell size={16} className="text-orange-400" />;
      case "coach":
        return <User size={16} className="text-blue-400" />;
      case "contact":
        return <Mail size={16} className="text-purple-400" />;
      default:
        return <Sparkles size={16} className="text-[var(--primary)]" />;
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm sm:max-w-md h-full bg-[var(--bg-secondary)] border-l border-[var(--border-color)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-base font-black uppercase text-[var(--text-primary)]">
                Notifications
              </h2>
              <p className="text-[11px] text-[var(--text-secondary)]">
                {unreadCount} unread update{unreadCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action bar */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between px-5 py-2.5 bg-[var(--bg-primary)]/50 border-b border-[var(--border-color)] text-xs">
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1.5 font-bold text-[var(--primary)] hover:underline"
            >
              <CheckCheck size={14} /> Mark all read
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 font-bold text-rose-400 hover:underline"
            >
              <Trash2 size={13} /> Clear all
            </button>
          </div>
        )}

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-[var(--text-muted)]">
              <Bell size={48} className="opacity-20 mb-3" />
              <p className="text-sm font-bold text-[var(--text-primary)]">
                All Caught Up!
              </p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-[200px]">
                You have no new alerts at the moment.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const Content = (
                <div
                  key={n.id}
                  onClick={() => onItemClick(n.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    n.read
                      ? "bg-[var(--bg-primary)]/40 border-[var(--border-color)] opacity-75"
                      : "bg-[var(--bg-primary)] border-[var(--primary)]/30 shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-[var(--bg-secondary)] border border-[var(--border-color)] shrink-0 mt-0.5">
                      {getIcon(n.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-black uppercase text-[var(--text-primary)] truncate">
                          {n.title || "Notification"}
                        </p>
                        <span className="text-[10px] text-[var(--text-muted)] shrink-0">
                          {n.time}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0 mt-2 shadow-[0_0_6px_var(--primary)]" />
                    )}
                  </div>
                </div>
              );

              return n.link ? (
                <Link key={n.id} href={n.link} onClick={onClose}>
                  {Content}
                </Link>
              ) : (
                Content
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
