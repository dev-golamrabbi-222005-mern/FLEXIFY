"use client";

import React, { useState } from "react";
import { Dumbbell, Save, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { SettingsTabProps } from "./types";

export function FitnessInfoTab({ user, onSaveSuccess }: SettingsTabProps) {
  const fp = user.fitnessProfile || {};
  const [form, setForm] = useState({
    height: fp.height || "",
    weight: fp.weight || "",
    age: fp.age || "",
    gender: fp.gender || "male",
    fitnessGoal: fp.fitnessGoal || "muscle_gain",
    activityLevel: fp.activityLevel || "moderately_active",
    dietaryPreference: fp.dietaryPreference || "balanced",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await axios.patch("/api/user/me", { fitnessProfile: form });
      toast.success("Fitness profile updated!");
      if (onSaveSuccess) onSaveSuccess();
    } catch {
      toast.error("Failed to update fitness profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="card-glass p-6 rounded-2xl border border-[var(--border-color)]">
        <div className="flex items-center gap-2 mb-6 text-[var(--text-primary)] font-bold text-sm">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <Dumbbell size={18} />
          </div>
          <span>Fitness Metrics & Preferences</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Height (cm)
            </label>
            <input
              name="height"
              type="number"
              value={form.height}
              onChange={handleChange}
              placeholder="e.g. 175"
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Weight (kg)
            </label>
            <input
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 70"
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Age
            </label>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 25"
              className="input-style"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Gender
            </label>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="input-style"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Primary Goal
            </label>
            <select
              name="fitnessGoal"
              value={form.fitnessGoal}
              onChange={handleChange}
              className="input-style"
            >
              <option value="muscle_gain">Muscle Gain</option>
              <option value="weight_loss">Weight Loss</option>
              <option value="endurance">Endurance</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Activity Level
            </label>
            <select
              name="activityLevel"
              value={form.activityLevel}
              onChange={handleChange}
              className="input-style"
            >
              <option value="sedentary">Sedentary (Little or no exercise)</option>
              <option value="lightly_active">Lightly Active (1-3 days/week)</option>
              <option value="moderately_active">Moderately Active (3-5 days/week)</option>
              <option value="very_active">Very Active (6-7 days/week)</option>
            </select>
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
