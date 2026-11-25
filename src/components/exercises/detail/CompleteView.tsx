"use client";

import React from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { Exercise, fmt } from "./types";
import { AnimNum } from "./AnimNum";
import { CompletionBurstHero } from "./CompletionBurstHero";
import { IntensityBreakdown } from "./IntensityBreakdown";

export function CompleteView({
  ex,
  sets,
  reps,
  weight,
  duration,
  onReset,
  onNext,
}: {
  ex: Exercise;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  onReset: () => void;
  onNext: () => void;
}) {
  const totalVol = sets * reps * weight;
  const calories = Math.round((duration / 60) * 6.5);
  const avgHR = 130 + Math.round(weight * 0.08);
  const peakBpm = avgHR + 18;

  const zones = { warmup: 55, fatBurn: 72, cardio: 88, peak: 65 };

  return (
    <div className="mx-auto my-10 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6 flex flex-col gap-4">
      <CompletionBurstHero ex={ex} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: "🏋️",
            label: "Volume",
            val: totalVol,
            unit: "kg",
            bg: "#dbeeff",
            delay: 0.1,
          },
          {
            icon: "❤️",
            label: "Avg HR",
            val: avgHR,
            unit: "bpm",
            bg: "#ffe4e4",
            delay: 0.18,
          },
          {
            icon: "🔥",
            label: "Calories",
            val: calories,
            unit: "kcal",
            bg: "#fff3e0",
            delay: 0.26,
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: s.delay,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: s.bg }}
            >
              {s.icon}
            </div>
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
                <AnimNum to={s.val} />
                <span
                  className="text-xs font-semibold ml-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.unit}
                </span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Duration", val: fmt(duration) },
          { label: "Sets × Reps", val: `${sets}×${reps}` },
          { label: "Weight", val: `${weight}kg` },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="font-black text-base"
              style={{ color: "var(--primary)" }}
            >
              {s.val}
            </p>
            <p
              className="text-[10px] uppercase tracking-wider mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </motion.div>

      <IntensityBreakdown peakBpm={peakBpm} zones={zones} />

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <RotateCcw size={15} /> Do it Again
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white"
          style={{
            background: "var(--primary)",
            boxShadow: "0 6px 24px var(--primary)35",
          }}
        >
          Next Exercise →
        </motion.button>
      </motion.div>
    </div>
  );
}
