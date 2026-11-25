"use client";

import React from "react";
import { motion } from "framer-motion";
import { Edit3, Play } from "lucide-react";

export function DetailBottomBar({
  targetSets,
  targetReps,
  targetWeight,
  onEditGoal,
  onStart,
}: {
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  onEditGoal: () => void;
  onStart: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40"
      style={{
        background: "var(--bg-primary)",
        borderTop: "2px solid var(--primary)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 -8px 32px rgba(244,121,32,0.12)",
      }}
    >
      <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: "var(--primary)" }}
            />
            <p
              className="text-[11px] font-black uppercase tracking-wider"
              style={{ color: "var(--primary)" }}
            >
              Ready to train
            </p>
          </div>
          <p
            className="text-base font-black leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {targetSets} sets · {targetReps} reps · {targetWeight} kg
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onEditGoal}
            className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-95"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <Edit3 size={13} /> Edit
          </button>
          <motion.button
            onClick={onStart}
            whileHover={{
              scale: 1.04,
              boxShadow: "0 6px 28px rgba(244,121,32,0.55)",
            }}
            whileTap={{ scale: 0.96 }}
            className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer text-sm font-black text-white"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
            }}
          >
            <Play size={15} fill="white" /> Start Workout
          </motion.button>
        </div>
      </div>
    </div>
  );
}
