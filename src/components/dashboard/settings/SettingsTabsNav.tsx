"use client";

import React from "react";
import { User, Dumbbell, Calendar, Shield, Bell, Moon, Award } from "lucide-react";
import { TabKey, DbUser } from "./types";

interface SettingsTabsNavProps {
  user: DbUser;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function SettingsTabsNav({ user, activeTab, onTabChange }: SettingsTabsNavProps) {
  const role = (user.role || "user").toLowerCase();

  const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: "profile", label: "Profile", icon: User },
    ...(role === "coach"
      ? [{ key: "coach" as TabKey, label: "Coach Schedule", icon: Calendar }]
      : role === "admin"
      ? [{ key: "admin" as TabKey, label: "Admin Info", icon: Award }]
      : [{ key: "fitness" as TabKey, label: "Fitness Info", icon: Dumbbell }]),
    { key: "notifications", label: "Notifications", icon: Bell },
    { key: "security", label: "Security", icon: Shield },
    { key: "appearance", label: "Appearance", icon: Moon },
  ];

  return (
    <div className="card-glass p-5 rounded-2xl flex flex-col gap-4 border border-[var(--border-color)]">
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          Logged in as
        </p>
        <p className="text-sm font-black capitalize text-[var(--primary)] mt-0.5">
          {role || "User"}
        </p>
      </div>

      <nav className="flex flex-col gap-1.5">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${
                isActive
                  ? "bg-[var(--primary)]/15 text-[var(--primary)] border border-[var(--primary)]/30 shadow-sm"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={18} className={isActive ? "text-[var(--primary)]" : "text-[var(--text-muted)]"} />
                <span>{label}</span>
              </div>
              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[var(--primary)] shadow-[0_0_8px_var(--primary)]" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
