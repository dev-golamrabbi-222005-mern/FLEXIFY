"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, Repeat, Zap } from "lucide-react";
import { DayPlan } from "@/lib/challengeUtils";

interface DayHeaderStatsProps {
  dayPlan: DayPlan;
  exerciseCount: number;
  estimatedMins: number;
  totalCalories: number;
}

export function DayHeaderStats({
  dayPlan,
  exerciseCount,
  estimatedMins,
  totalCalories,
}: DayHeaderStatsProps) {
  const stats = [
    { icon: Repeat, label: "Exercises", val: exerciseCount },
    { icon: Clock, label: "Est. Time", val: `${estimatedMins} min` },
    { icon: Zap, label: "Calories", val: `~${totalCalories} kcal` },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">{dayPlan.tagEmoji}</span>
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-widest"
            style={{ color: "var(--primary)" }}
          >
            Week {dayPlan.week} · Day {dayPlan.day}
            {dayPlan.isLightDay && " · Light Day"}
          </p>
          <h2
            className="font-black tracking-tight"
            style={{
              fontSize: "clamp(22px, 5vw, 32px)",
              color: "var(--text-primary)",
            }}
          >
            {dayPlan.tagLabel}
          </h2>
        </div>
      </div>

      <div className="flex gap-3 mt-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="flex-1 rounded-2xl p-3 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <s.icon
              size={14}
              className="mx-auto mb-1"
              style={{ color: "var(--primary)" }}
            />
            <p
              className="font-black text-sm leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {s.val}
            </p>
            <p
              className="text-[10px] mt-0.5 font-bold uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
