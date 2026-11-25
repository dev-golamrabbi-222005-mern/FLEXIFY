"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { SetData } from "./types";

export function SetInputRow({
  set,
  setIdx,
  trackingType,
  onToggle,
  onChange,
}: {
  set: SetData;
  setIdx: number;
  trackingType?: string;
  onToggle: (setIdx: number) => void;
  onChange: (setIdx: number, field: string, val: string) => void;
}) {
  const done = !!set.isCompleted;
  const isTime = trackingType === "TIME";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: setIdx * 0.04 }}
      className="grid items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md"
      style={{
        gridTemplateColumns: "32px 1fr 1fr 40px",
        background: done ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
        boxShadow: done
          ? "0 4px 20px rgba(16,185,129,0.15)"
          : "0 4px 20px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.06)",
        opacity: done ? 0.8 : 1,
      }}
    >
      <span
        className="text-sm font-semibold text-center"
        style={{
          color: done ? "var(--primary)" : "var(--text-secondary)",
        }}
      >
        {setIdx + 1}
      </span>

      <input
        type="number"
        placeholder={isTime ? "sec" : "kg"}
        value={isTime ? (set.seconds ?? "") : (set.weight ?? "")}
        onChange={(e) =>
          onChange(setIdx, isTime ? "seconds" : "weight", e.target.value)
        }
        disabled={done}
        className="w-full text-center text-sm font-semibold rounded-xl px-3 py-2 outline-none transition-all focus:scale-[1.02]"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-primary)",
        }}
      />

      {!isTime ? (
        <input
          type="number"
          placeholder="reps"
          value={set.reps ?? ""}
          onChange={(e) => onChange(setIdx, "reps", e.target.value)}
          disabled={done}
          className="w-full text-center text-sm font-semibold rounded-xl px-3 py-2 outline-none transition-all focus:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-primary)",
          }}
        />
      ) : (
        <div />
      )}

      <button
        onClick={() => onToggle(setIdx)}
        className="w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl transition-all duration-200 active:scale-95"
        style={{
          background: done
            ? "linear-gradient(135deg, #10b981, #34d399)"
            : "var(--primary-light)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: done ? "0 4px 12px rgba(16,185,129,0.4)" : "none",
        }}
      >
        <CheckCircle2 size={18} color={done ? "#FFFFFF" : "#000000"} />
      </button>
    </motion.div>
  );
}
