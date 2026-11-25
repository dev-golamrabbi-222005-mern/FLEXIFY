"use client";

import React, { useState } from "react";
import { Shield, KeyRound, Loader2, Save } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { SettingsTabProps } from "./types";

export function SecurityTab({}: SettingsTabProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsUpdating(true);
      await axios.patch("/api/user/me/password", {
        currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Failed to change password. Please check your current password.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Shield size={18} />
          </div>
          <span>Security & Authentication</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="input-style"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="input-style"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="input-style"
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isUpdating}
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
        >
          {isUpdating ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>Update Password</span>
        </button>
      </div>
    </form>
  );
}
