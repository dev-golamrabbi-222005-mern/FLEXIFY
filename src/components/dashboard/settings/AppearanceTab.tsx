"use client";

import React from "react";
import { Moon, Sun, Monitor, Check } from "lucide-react";
import ThemeToggle from "@/app/dashboard/Share/ThemeToggle";
import { SettingsTabProps } from "./types";

export function AppearanceTab({}: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Moon size={18} />
          </div>
          <span>Theme & Display Preferences</span>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Color Mode
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Switch between high-contrast dark mode and crisp light mode
              </p>
            </div>
            <ThemeToggle />
          </div>

          <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <p className="text-sm font-bold text-[var(--text-primary)] mb-2">
              Brand Accent Palette
            </p>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-[#27ae60] flex items-center justify-center text-white text-xs shadow-md">
                <Check size={16} />
              </span>
              <span className="w-8 h-8 rounded-full bg-[#f47920] opacity-40 cursor-not-allowed" />
              <span className="w-8 h-8 rounded-full bg-[#4b9eff] opacity-40 cursor-not-allowed" />
              <span className="text-xs text-[var(--text-secondary)] ml-2">
                Flexify Emerald (Default)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
