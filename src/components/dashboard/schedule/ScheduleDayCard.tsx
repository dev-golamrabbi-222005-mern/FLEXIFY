"use client";

import React from "react";
import { Zap, Moon, Clock, Edit3 } from "lucide-react";
import type { DaySchedule } from "@/types";

interface ScheduleDayCardProps {
  day: string;
  scheduleValue: DaySchedule;
  isEditMode: boolean;
  routines?: { id: string; name: string }[];
  onCustomModalOpen: (day: string) => void;
  onRoutineSelect: (day: string, routineName: string) => void;
}

export default function ScheduleDayCard({
  day,
  scheduleValue,
  isEditMode,
  routines,
  onCustomModalOpen,
  onRoutineSelect,
}: ScheduleDayCardProps) {
  const isRestDay = scheduleValue.routine === "Rest Day";

  return (
    <div
      className={`bg-[var(--bg-secondary)] border transition-all duration-300 p-6 rounded-2xl relative ${
        !isRestDay ? "border-[var(--primary)] shadow-md" : "border-[var(--border-color)] opacity-90"
      } ${isEditMode ? "ring-2 ring-[var(--primary)]/20 scale-[1.01]" : ""}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold uppercase tracking-tight">{day}</h2>
        <div
          className={`p-2 rounded-2xl ${
            !isRestDay
              ? "bg-[var(--primary-light)] text-[var(--primary)]"
              : "bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)]"
          }`}
        >
          {!isRestDay ? <Zap size={18} /> : <Moon size={18} />}
        </div>
      </div>

      <div className="min-h-[80px] flex flex-col justify-center">
        {!isEditMode ? (
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3
              className={`text-xl font-black leading-tight ${
                isRestDay ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"
              }`}
            >
              {scheduleValue.routine}
            </h3>
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mt-2 font-bold">
              {isRestDay ? "Recovery Day" : "Training Day"}
            </p>
          </div>
        ) : (
          <div className="space-y-3 animate-in zoom-in-95 duration-200">
            <select
              value={
                routines?.some((r) => r.name === scheduleValue.routine)
                  ? scheduleValue.routine
                  : isRestDay
                    ? "Rest Day"
                    : "Custom"
              }
              onChange={(e) => {
                if (e.target.value === "Custom") onCustomModalOpen(day);
                else onRoutineSelect(day, e.target.value);
              }}
              className="input-style cursor-pointer text-xs rounded-2xl w-full"
            >
              <option value="Rest Day">Rest Day</option>
              {routines?.map((r) => (
                <option key={r.id} value={r.name}>
                  {r.name}
                </option>
              ))}
              <option value="Custom">Manual Entry...</option>
            </select>
            {!isRestDay && (
              <button
                onClick={() => onCustomModalOpen(day)}
                className="w-full flex items-center justify-between p-2 text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-light)]/30 rounded-xl"
              >
                Customize Text <Edit3 size={12} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color)]/50 pt-4">
        <span
          className={`text-[9px] font-black uppercase tracking-tighter ${
            !isRestDay ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
          }`}
        >
          {isRestDay ? "Free Time" : "Session Active"}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-bold">
          <Clock size={12} /> {scheduleValue.time}
        </div>
      </div>
    </div>
  );
}
