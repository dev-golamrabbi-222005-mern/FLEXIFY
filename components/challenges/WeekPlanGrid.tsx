"use client";

import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { DayPlan, Level, ChallengeType } from "@/lib/challengeUtils";

interface Props {
  type: ChallengeType;
  level: Level;
  plan: DayPlan[];
  completedDays: number[];        // array of completed day numbers
  onSelectDay: (day: DayPlan) => void;
  onBack: () => void;
}

const WEEK_LABELS = ["Week 1", "Week 2", "Week 3", "Week 4"];
const DAY_LABELS  = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TAG_COLORS: Record<string, string> = {
  arm:      "#f47920",
  chest:    "#3b82f6",
  abs:      "#ef4444",
  shoulder: "#8b5cf6",
  thigh:    "#f47920",
  butt:     "#ec4899",
  calfs:    "#14b8a6",
};

export function WeekPlanGrid({ type, level, plan, completedDays, onSelectDay, onBack }: Props) {
  const weeks = [1, 2, 3, 4];

  // Which day is the "current" day (first incomplete)
  const currentDay = plan.find((d) => !completedDays.includes(d.day))?.day ?? null;

  return (
    <div className="">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[var(--primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className="mb-8">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{ color: "var(--primary)" }}
        >
          {type === "upper-body" ? "Upper Body" : "Lower Body"} · {level}
        </p>
        <h2
          className="font-black tracking-tight"
          style={{ fontSize: "clamp(24px, 5vw, 36px)", color: "var(--text-primary)" }}
        >
          Your 4-Week Plan
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {completedDays.length}/28 days completed
        </p>

        {/* Progress bar */}
        <div
          className="mt-3 h-2 rounded-full overflow-hidden"
          style={{ background: "var(--border-color)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(completedDays.length / 28) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>

      {/* Day labels row */}
      <div className="grid grid-cols-8 gap-2 mb-2 pl-[88px]">
        {DAY_LABELS.map((d) => (
          <p
            key={d}
            className="text-center text-[10px] font-black uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            {d}
          </p>
        ))}
      </div>

      {/* Weeks */}
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
              {/* Week label */}
              <div className="col-span-1">
                <p
                  className="text-[11px] font-black uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {WEEK_LABELS[week - 1]}
                </p>
              </div>

              {/* Day cells */}
              {weekDays.map((dayPlan) => {
                const isDone    = completedDays.includes(dayPlan.day);
                const isCurrent = dayPlan.day === currentDay;
                const isLocked  = !isDone && dayPlan.day > (currentDay ?? 1);
                const color     = TAG_COLORS[dayPlan.tag] ?? "var(--primary)";

                return (
                  <button
                    key={dayPlan.day}
                    onClick={() => !isLocked && onSelectDay(dayPlan)}
                    disabled={isLocked}
                    className="relative flex flex-col items-center justify-center rounded-2xl transition-all duration-200 group"
                    style={{
                      height: 64,
                      background: isDone
                        ? `${color}20`
                        : isCurrent
                          ? `${color}15`
                          : "var(--bg-secondary)",
                      border: isDone
                        ? `1.5px solid ${color}50`
                        : isCurrent
                          ? `2px solid ${color}`
                          : "1.5px solid var(--border-color)",
                      opacity: isLocked ? 0.35 : 1,
                      cursor: isLocked ? "not-allowed" : "pointer",
                    }}
                  >
                    {/* Day number */}
                    <span
                      className="text-[10px] font-black leading-none"
                      style={{
                        color: isDone || isCurrent ? color : "var(--text-secondary)",
                      }}
                    >
                      {isDone ? "✓" : dayPlan.day}
                    </span>

                    {/* Tag emoji */}
                    <span className="text-[11px] mt-1 leading-none">
                      {dayPlan.tagEmoji}
                    </span>

                    {/* Current day pulse ring */}
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

      {/* Legend */}
      <div className="mt-8 flex flex-wrap gap-3">
        {Object.entries(TAG_COLORS).map(([tag, color]) => {
          const hasDays = plan.some((d) => d.tag === tag);
          if (!hasDays) return null;
          return (
            <div key={tag} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: color }}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-wider capitalize"
                style={{ color: "var(--text-secondary)" }}
              >
                {tag}
              </span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[var(--border-color)]" />
          <span
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            Locked
          </span>
        </div>
      </div>
    </div>
  );
}
