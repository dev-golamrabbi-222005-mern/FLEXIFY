"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";

interface WorkoutLog {
  createdAt: string;
  planName?: string;
}

interface MonthlyCalendarProps {
  workoutLogs: WorkoutLog[];
}

export default function MonthlyStreakCalendar({ workoutLogs = [] }: MonthlyCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const activeDates = new Set(workoutLogs.map(log => new Date(log.createdAt).toDateString()));

    return { year, month, firstDay, daysInMonth, activeDates };
  }, [viewDate, workoutLogs]);

  const monthName = viewDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  const changeMonth = (offset: number) => {
    setViewDate(new Date(calendarData.year, calendarData.month + offset, 1));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]  flex flex-col"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
            <CalendarDays size={16} />
          </div>
          <h3 className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)]">{monthName}</h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-[var(--bg-primary)] rounded-md border border-[var(--border-color)] transition-colors">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => changeMonth(1)} className="p-1 hover:bg-[var(--bg-primary)] rounded-md border border-[var(--border-color)] transition-colors">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-2 text-center text-[9px] font-black text-[var(--text-secondary)] opacity-50 uppercase tracking-tighter">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: calendarData.firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = new Date(calendarData.year, calendarData.month, day).toDateString();
          const hasWorkout = calendarData.activeDates.has(dateStr);
          const isToday = new Date().toDateString() === dateStr;

          return (
            <div key={day} className={`aspect-square flex items-center justify-center rounded-lg text-[10px] font-bold transition-all
              ${hasWorkout ? "bg-[var(--primary)] text-white shadow-sm" : isToday ? "border border-[var(--primary)] text-[var(--primary)]" : "bg-[var(--bg-primary)]/40 text-[var(--text-secondary)]"}`}>
              {day}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}