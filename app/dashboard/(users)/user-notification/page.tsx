
"use client";

import { Bell, MessageCircle, AlertTriangle } from "lucide-react";

export default function Notifications() {
  return (
    <div className="space-y-8">
       <title>Notification | Dashboard - Flexify</title>
      {/* Header */}
      <div className="flex items-center gap-3">
        <Bell className="text-[var(--primary)]" />
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[var(--text-primary)]">
          Notifications
        </h2>
      </div>

      {/* Notification List */}
      <div className="space-y-4">
        {/* Workout Reminder */}
        <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-3">
          <Bell className="text-[var(--primary)]" size={18} />
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              Workout Reminder
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Time for your daily workout session 💪
            </p>
          </div>
        </div>

        {/* Coach Message */}
        <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-3">
          <MessageCircle className="text-[var(--primary)]" size={18} />
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              Coach Message
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              Your coach sent you a new message
            </p>
          </div>
        </div>

        {/* System Alert */}
        <div className="p-4 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center gap-3">
          <AlertTriangle className="text-[var(--primary)]" size={18} />
          <div>
            <p className="text-sm font-bold text-[var(--text-primary)]">
              System Alert
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              New update available in your dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

