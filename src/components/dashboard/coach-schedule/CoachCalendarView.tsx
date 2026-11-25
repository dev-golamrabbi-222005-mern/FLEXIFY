"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

interface Session {
  day: number;
  month: number;
  year: number;
  time: string;
  type: string;
  clientInfo?: { name: string };
}

interface CoachCalendarViewProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  sessions: Session[];
  formatTime12h: (time: string) => string;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CoachCalendarView({
  currentMonth,
  onPrevMonth,
  onNextMonth,
  sessions,
  formatTime12h,
}: CoachCalendarViewProps) {
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="card-glass">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onPrevMonth} className="p-2 rounded-lg hover:bg-gray-500/10" title="Previous month">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>{monthName}</h2>
        <button onClick={onNextMonth} className="p-2 rounded-lg hover:bg-gray-500/10" title="Next month">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((d) => (
          <div key={d} className="py-2 text-xs font-medium text-center" style={{ color: "var(--text-muted)" }}>
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, i) => {
          const daySessions = day
            ? sessions.filter(
                (s) =>
                  s.day === day &&
                  s.month === currentMonth.getMonth() + 1 &&
                  s.year === currentMonth.getFullYear()
              )
            : [];

          const isToday = day === new Date().getDate();

          return (
            <div
              key={i}
              className="min-h-[85px] p-2 rounded-xl"
              style={{ border: "1px solid var(--border-color)", background: "var(--bg-secondary)" }}
            >
              {day && (
                <>
                  <span
                    className="text-xs font-semibold"
                    style={{
                      color: isToday ? "white" : "var(--text-primary)",
                      background: isToday ? "var(--primary)" : "transparent",
                      padding: isToday ? "2px 6px" : "0",
                      borderRadius: isToday ? "999px" : "0",
                    }}
                  >
                    {day}
                  </span>
                  {daySessions.map((s, j) => (
                    <div
                      key={j}
                      className="mt-1 px-2 py-1 rounded text-[10px] truncate"
                      style={{ background: "var(--primary-light)", color: "var(--primary)" }}
                    >
                      {formatTime12h(s.time)} – {s?.clientInfo?.name?.split(" ")[0]}
                    </div>
                  ))}
                </>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
