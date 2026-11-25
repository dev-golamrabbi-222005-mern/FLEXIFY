"use client";

import React from "react";
import { motion } from "framer-motion";
import { DayPlan, Level, ChallengeType } from "@/lib/challengeUtils";
import { WeekPlanHeader } from "./WeekPlanHeader";
import { WeekLegend } from "./WeekLegend";

interface Props {
  type: ChallengeType;
  level: Level;
  plan: DayPlan[];
  completedDays: number[];
  onSelectDay: (day: DayPlan) => void;
  onBack: () => void;
}

const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4"];
const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TAG_COLORS: Record<string, string> = {
  arm: "#f47920",
  chest: "#3b82f6",
  abs: "#ef4444",
  shoulder: "#8b5cf6",
  thigh: "#f47920",
  butt: "#ec4899",
  calfs: "#14b8a6",
};

export function WeekPlanGrid({
  type,
  level,
  plan,
  completedDays,
  onSelectDay,
  onBack,
}: Props) {
  const weeks = [1, 2, 3, 4];
  const currentDay = plan.find((d) => !completedDays.includes(d.day))?.day ?? null;

  return (
    <div>
      <WeekPlanHeader
        type={type}
        level={level}
        completedCount={completedDays.length}
        onBack={onBack}
      />

      <div className="grid grid-cols-8 gap-2 mb-2 pl-[88px]">
        {DAY_LABELS.map((d) => (
          <p
            key={d}
            className="text-center text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]"
          >
            {d}
          </p>
        ))}
      </div>

      <div className="space-y-3">
        {weeks.map((week) => {
          const weekDays = plan.filter((d) => d.week === week);
          return (
            <motion.div
              key={week}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (week - 1) * 0.08 }}
              className="grid grid-cols-8 gap-2 items-center"
            >
              <div className="col-span-1">
                <p className="text-[11px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
                  {WEEK_LABELS[week - 1]}
                </p>
              </div>

              {weekDays.map((dayPlan) => {
                const isDone = completedDays.includes(dayPlan.day);
                const isCurrent = dayPlan.day === currentDay;
                const isLocked = !isDone && dayPlan.day > (currentDay ?? 1);
                const color = TAG_COLORS[dayPlan.tag] ?? "var(--primary)";

                return (
                  <button
                    key={dayPlan.day}
                    onClick={() => !isLocked && onSelectDay(dayPlan)}
                    disabled={isLocked}
                    className="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 group"
                    style={{
                      height: 64,
                      background: isDone ? `${color}20` : isCurrent ? `${color}15` : "var(--bg-secondary)",
                      border: isDone ? `1.5px solid ${color}50` : isCurrent ? `2px solid ${color}` : "1.5px solid var(--border-color)",
                      opacity: isLocked ? 0.35 : 1,
                      cursor: isLocked ? "not-allowed" : "pointer",
                    }}
                  >
                    <span
                      className="text-[10px] font-black leading-none"
                      style={{ color: isDone || isCurrent ? color : "var(--text-secondary)" }}
                    >
                      {isDone ? "✓" : dayPlan.day}
                    </span>
                    <span className="text-[11px] mt-1 leading-none">{dayPlan.tagEmoji}</span>
                    {isCurrent && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none"
                        style={{ border: `2px solid ${color}` }}
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          );
        })}
      </div>

      <WeekLegend plan={plan} tagColors={TAG_COLORS} />
    </div>
  );
}
