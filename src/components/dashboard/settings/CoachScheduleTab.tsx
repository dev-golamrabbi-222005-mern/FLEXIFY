"use client";

import React, { useState } from "react";
import { Calendar, Save, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { SettingsTabProps } from "./types";

const ALL_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function CoachScheduleTab({ user, onSaveSuccess }: SettingsTabProps) {
  const [specialties, setSpecialties] = useState(user.specialties || "");
  const [experienceYears, setExperienceYears] = useState(user.experienceYears || 1);
  const [maxClients, setMaxClients] = useState(user.maxClients || 10);
  const [monthlyPrice, setMonthlyPrice] = useState(user.pricing?.monthly || 5000);
  const [availableDays, setAvailableDays] = useState<string[]>(
    user.availableDays || ["Monday", "Wednesday", "Friday"]
  );
  const [isSaving, setIsSaving] = useState(false);

  const toggleDay = (day: string) => {
    setAvailableDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await axios.patch("/api/user/me", {
        specialties,
        experienceYears,
        maxClients,
        pricing: { ...user.pricing, monthly: Number(monthlyPrice) },
        availableDays,
      });
      toast.success("Coach schedule and rates updated!");
      if (onSaveSuccess) onSaveSuccess();
    } catch {
      toast.error("Failed to update coach profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Calendar size={18} />
          </div>
          <span>Coaching Schedule & Pricing</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Specialties (comma separated)
            </label>
            <input
              value={specialties}
              onChange={(e) => setSpecialties(e.target.value)}
              placeholder="e.g. Hypertrophy, HIIT, Kettlebell"
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Experience (Years)
            </label>
            <input
              type="number"
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Max Active Trainees
            </label>
            <input
              type="number"
              value={maxClients}
              onChange={(e) => setMaxClients(Number(e.target.value))}
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Monthly Rate (BDT)
            </label>
            <input
              type="number"
              value={monthlyPrice}
              onChange={(e) => setMonthlyPrice(Number(e.target.value))}
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Available Coaching Days
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const isSelected = availableDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[var(--primary)] text-black"
                        : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-500/20"
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span>Save Changes</span>
        </button>
      </div>
    </form>
  );
}
