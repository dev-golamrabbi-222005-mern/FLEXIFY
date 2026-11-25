"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fmtTime } from "@/lib/challengeUtils";

function AnimNum({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

interface DayCompleteStatsProps {
  caloriesBurned: number;
  durationSecs: number;
  exercisesDone: number;
}

export function DayCompleteStats({
  caloriesBurned,
  durationSecs,
  exercisesDone,
}: DayCompleteStatsProps) {
  const statCards = [
    {
      emoji: "🔥",
      label: "Calories",
      val: caloriesBurned,
      unit: "kcal",
      time: null,
    },
    {
      emoji: "⏱",
      label: "Duration",
      val: null,
      unit: "",
      time: fmtTime(durationSecs),
    },
    {
      emoji: "✅",
      label: "Exercises",
      val: exercisesDone,
      unit: "",
      time: null,
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {statCards.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <span className="text-xl">{s.emoji}</span>
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest mb-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
            <p
              className="font-black text-xl leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {s.time ?? (
                <>
                  <AnimNum to={s.val ?? 0} />
                  {s.unit && (
                    <span
                      className="text-xs font-semibold ml-0.5"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.unit}
                    </span>
                  )}
                </>
              )}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
