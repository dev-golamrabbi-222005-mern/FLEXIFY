"use client";

import React from "react";
import { DayPlan } from "@/lib/challengeUtils";

interface MonthCalendarProps {
  completedDays: number[];
  dayPlan: DayPlan;
}

export function MonthCalendar({ completedDays, dayPlan }: MonthCalendarProps) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const challengeStart = new Date(today);
  challengeStart.setDate(today.getDate() - (dayPlan.day - 1));

  const completedDates = new Set(
    completedDays.map((d) => {
      const date = new Date(challengeStart);
      date.setDate(challengeStart.getDate() + (d - 1));
      return date.getDate();
    })
  );

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <p
        className="text-[11px] font-black uppercase tracking-widest mb-4 text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        📅 {monthName}
      </p>
      <div className="grid grid-cols-7 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <p
            key={i}
            className="text-center text-[10px] font-black uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            {d}
          </p>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          const isDone = completedDates.has(day);
          return (
            <div
              key={day}
              className="flex items-center justify-center rounded-lg"
              style={{ height: 28 }}
            >
              <span
                className="text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                  background: isDone
                    ? "var(--primary)"
                    : isToday
                      ? "rgba(244,121,32,0.15)"
                      : "transparent",
                  color: isDone
                    ? "#fff"
                    : isToday
                      ? "var(--primary)"
                      : "var(--text-secondary)",
                }}
              >
                {isDone ? "✓" : day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
