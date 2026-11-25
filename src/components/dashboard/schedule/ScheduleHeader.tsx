"use client";

import React from "react";
import Link from "next/link";
import { CalendarDays, PlusCircle, Settings2, Save, Loader2 } from "lucide-react";

interface ScheduleHeaderProps {
  workoutDays?: string;
  isEditMode: boolean;
  isPending: boolean;
  onEditModeToggle: () => void;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ScheduleHeader({
  workoutDays,
  isEditMode,
  isPending,
  onEditModeToggle,
  onCancel,
  onConfirm,
}: ScheduleHeaderProps) {
  return (
    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 bg-[var(--bg-secondary)] p-6 md:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="p-3 bg-[var(--primary-light)] dark:bg-emerald-500/10 rounded-2xl text-[var(--primary)]">
          <CalendarDays size={32} />
        </div>
        <div>
          <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
            Weekly Schedule
          </h1>
          <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
            Active Goal:{" "}
            <span className="text-[var(--primary)] font-bold">
              {workoutDays || "5"} Days / Week
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 w-full md:w-auto">
        {!isEditMode ? (
          <>
            <Link href="/dashboard/create-workout" className="flex-1 md:flex-none">
              <button className="btn-secondary w-full flex items-center justify-center gap-2 border-dashed rounded-2xl py-3 px-6 text-sm font-bold">
                <PlusCircle size={18} /> New Routine
              </button>
            </Link>
            <button
              onClick={onEditModeToggle}
              className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-bold shadow-lg btn-primary md:flex-none rounded-2xl shadow-emerald-500/10"
            >
              <Settings2 size={18} /> Edit Plan
            </button>
          </>
        ) : (
          <>
            <button
              onClick={onCancel}
              className="btn-secondary flex-1 md:flex-none rounded-2xl py-3 px-6 text-sm font-bold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex items-center justify-center flex-1 gap-2 px-8 py-3 text-sm font-bold shadow-lg btn-primary md:flex-none rounded-2xl shadow-emerald-500/10"
            >
              {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Confirm Changes
            </button>
          </>
        )}
      </div>
    </div>
  );
}
