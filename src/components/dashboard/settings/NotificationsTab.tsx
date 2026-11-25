"use client";

import React, { useState } from "react";
import { Bell, Save } from "lucide-react";
import { toast } from "react-toastify";
import { SettingsTabProps } from "./types";

export function NotificationsTab({}: SettingsTabProps) {
  const [preferences, setPreferences] = useState({
    workoutReminders: true,
    coachMessages: true,
    weeklyDigest: false,
    soundEnabled: true,
  });

  const toggle = (key: keyof typeof preferences) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("flexify_notifications_prefs", JSON.stringify(preferences));
    toast.success("Notification preferences saved!");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Bell size={18} />
          </div>
          <span>Notification Alerts & Sounds</span>
        </div>

        <div className="space-y-4">
          {[
            { key: "workoutReminders", label: "Workout Reminders", desc: "Receive alerts when it is time for your scheduled session" },
            { key: "coachMessages", label: "Coach & Trainee Messages", desc: "Instant notifications for feedback, plan updates, and inquiries" },
            { key: "weeklyDigest", label: "Weekly Progress Digest", desc: "Summary of your consistency and calorie metrics on Sunday" },
            { key: "soundEnabled", label: "Sound Effects", desc: "Play subtle audio cues when new notifications arrive" },
          ].map(({ key, label, desc }) => {
            const isChecked = preferences[key as keyof typeof preferences];
            return (
              <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
                <div>
                  <p className="text-sm font-bold text-[var(--text-primary)]">{label}</p>
                  <p className="text-xs text-[var(--text-secondary)]">{desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => toggle(key as keyof typeof preferences)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    isChecked ? "bg-[var(--primary)]" : "bg-[var(--border-color)]"
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                      isChecked ? "translate-x-7" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
        >
          <Save size={18} />
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
