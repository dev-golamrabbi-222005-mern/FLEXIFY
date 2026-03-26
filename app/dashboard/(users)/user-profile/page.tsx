
"use client";

import { User, Settings, Moon, Shield, Lock } from "lucide-react";

export default function Profile() {
  return (
    <div className="space-y-8">
       <title>Profile | Dashboard - Flexify</title>
      {/* Header */}
      <div className="flex items-center gap-3">
        <User className="text-[var(--primary)]" />
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-[var(--text-primary)]">
          Profile
        </h2>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Personal Info */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
            Personal Info
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Name, email, and personal details
          </p>
        </div>

        {/* Fitness Data */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
            Fitness Data
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Weight, BMI, progress stats
          </p>
        </div>

        {/* Preferences */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2">
            Preferences
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Workout & diet preferences
          </p>
        </div>

        {/* Settings */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
            <Settings size={16} /> Settings
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            General account settings
          </p>
        </div>

        {/* Theme */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Moon size={16} /> Theme
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Switch dark/light mode
            </p>
          </div>
          <button className="text-xs font-bold bg-[var(--primary)] text-white px-3 py-1 rounded-lg">
            Toggle
          </button>
        </div>

        {/* Privacy */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Shield size={16} /> Privacy
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Manage your privacy settings
          </p>
        </div>

        {/* Password */}
        <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Lock size={16} /> Password
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Change your password securely
          </p>
        </div>
      </div>
    </div>
  );
}