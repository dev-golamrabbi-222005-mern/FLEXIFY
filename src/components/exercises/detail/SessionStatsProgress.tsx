"use client";

import React from "react";
import { motion } from "framer-motion";

export function SessionStatsProgress({
  setsCompleted,
  targetSets,
  targetReps,
  targetWeight,
  progress,
}: {
  setsCompleted: number;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  progress: number;
}) {
  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sets Done", val: setsCompleted, icon: "✅" },
          { label: "Target Reps", val: targetReps, icon: "⚡" },
          {
            label: "Weight",
            val: `${targetWeight}kg`,
            icon: "🏋️",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <span className="text-xl block mb-1">{s.icon}</span>
            <p
              className="font-black text-xl leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {s.val}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Set Progress
          </p>
          <p className="text-sm font-black" style={{ color: "var(--primary)" }}>
            {Math.round(progress * 100)}%
          </p>
        </div>
        <div
          className="h-3 w-full rounded-full"
          style={{ background: "var(--border-color)" }}
        >
          <motion.div
            className="h-3 rounded-full"
            style={{ background: "var(--primary)" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div
          className="flex justify-between text-[11px] mt-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>{targetSets - setsCompleted} sets remaining</span>
          <span>{targetSets} total goal</span>
        </div>
      </div>
    </>
  );
}
