"use client";

import React, { useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { SettingsTabProps } from "./types";

export function ProfileTab({ user, onSaveSuccess }: SettingsTabProps) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    bio: user.bio || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await axios.patch("/api/user/me", form);
      toast.success("Profile updated successfully!");
      if (onSaveSuccess) onSaveSuccess();
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <User size={18} />
          </div>
          <span>Basic Info</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Abdullah Al Mamun"
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Email
            </label>
            <input
              name="email"
              value={form.email}
              disabled
              className="input-style opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+8801..."
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Location
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. Dhaka, Bangladesh"
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Bio
            </label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={3}
              placeholder="Tell us a bit about your fitness journey..."
              className="input-style resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
        >
          {isSaving ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Save size={18} />
          )}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
