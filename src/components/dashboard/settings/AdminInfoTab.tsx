"use client";

import React from "react";
import { Award, ShieldAlert, CheckCircle2 } from "lucide-react";
import { SettingsTabProps } from "./types";

export function AdminInfoTab({ user }: SettingsTabProps) {
  return (
    <div className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Award size={18} />
          </div>
          <span>Platform Administration & Access</span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Superuser Privileges
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Full read and write access to database, user management, and payments.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <CheckCircle2 size={14} /> Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Audit Log Streaming
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Critical transactions and mutations are recorded in the security audit journal.
              </p>
            </div>
            <span className="text-xs font-bold text-[var(--primary)] bg-[var(--primary)]/10 px-3 py-1 rounded-full border border-[var(--primary)]/30">
              Enabled
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
            <div>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                Real-Time Notification Scope
              </p>
              <p className="text-xs text-[var(--text-secondary)]">
                Subscribed to channel `role-admin` for system events, reviews, and new payments.
              </p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30">
              <ShieldAlert size={14} /> Listening
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
