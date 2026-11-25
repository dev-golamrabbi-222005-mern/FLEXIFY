"use client";

import React from "react";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

interface DashboardDateNavigatorProps {
  currentDate: Date;
  onPrevDay: () => void;
  onNextDay: () => void;
  isMobile?: boolean;
}

export function DashboardDateNavigator({
  currentDate,
  onPrevDay,
  onNextDay,
  isMobile = false,
}: DashboardDateNavigatorProps) {
  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  if (isMobile) {
    return (
      <div className="sm:hidden w-full flex items-center justify-between px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-[var(--text-secondary)]" />
          <p className="text-[11px] font-semibold text-[var(--text-secondary)]">
            {formatDate(currentDate)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onPrevDay}
            className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
          </button>
          <span className="text-[11px] font-bold text-[var(--primary)]">
            Day {currentDate.getDate()}
          </span>
          <button
            onClick={onNextDay}
            className="p-1 rounded hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden sm:flex items-center gap-3 px-3 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-color)]">
      <CalendarDays
        className="text-[var(--text-secondary)] shrink-0"
        size={18}
      />
      <div className="leading-tight">
        <p className="text-[10px] text-[var(--primary)] font-bold uppercase tracking-wide">
          Day {currentDate.getDate()}, Week {Math.ceil(currentDate.getDate() / 7)}
        </p>
        <p className="text-xs text-[var(--text-secondary)]">
          {formatDate(currentDate)}
        </p>
      </div>
      <div className="flex items-center gap-1 ml-1">
        <button
          onClick={onPrevDay}
          className="p-1 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} className="text-[var(--text-secondary)]" />
        </button>
        <button
          onClick={onNextDay}
          className="p-1 rounded-lg hover:bg-[var(--bg-primary)] transition-colors cursor-pointer"
        >
          <ChevronRight size={16} className="text-[var(--text-secondary)]" />
        </button>
      </div>
    </div>
  );
}
