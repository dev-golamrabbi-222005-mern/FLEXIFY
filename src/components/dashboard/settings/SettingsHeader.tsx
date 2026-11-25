"use client";

import React from "react";
import { Settings as SettingsIcon } from "lucide-react";

export function SettingsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.25em] text-[var(--primary)] mb-1">
          — Preferences
        </p>
        <h1 className="text-3xl md:text-4xl font-extrabold uppercase tracking-tight text-[var(--text-primary)]">
          Settings
        </h1>
      </div>
      <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] text-[var(--text-secondary)] shadow-sm">
        <SettingsIcon size={20} className="text-[var(--primary)] animate-spin-slow" />
      </div>
    </div>
  );
}
