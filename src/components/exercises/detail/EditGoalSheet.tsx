"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export function EditGoalSheet({
  sets,
  reps,
  weight,
  onSave,
  onClose,
}: {
  sets: number;
  reps: number;
  weight: number;
  onSave: (s: number, r: number, w: number) => void;
  onClose: () => void;
}) {
  const [ls, setLs] = useState(sets);
  const [lr, setLr] = useState(reps);
  const [lw, setLw] = useState(weight);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="w-full max-w-sm rounded-3xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h2
            className="font-black text-base"
            style={{ color: "var(--text-primary)" }}
          >
            Set Your Goal
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-primary)] transition-colors text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Sets", icon: "🔁", val: ls, set: setLs, min: 1, max: 10 },
            { label: "Reps", icon: "⚡", val: lr, set: setLr, min: 1, max: 50 },
            {
              label: "Weight (kg)",
              icon: "🏋️",
              val: lw,
              set: setLw,
              min: 0,
              max: 500,
            },
          ].map((f) => (
            <div key={f.label}>
              <label
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>{f.icon}</span> {f.label}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    f.set(
                      Math.max(
                        f.min,
                        f.val - (f.label.includes("Weight") ? 5 : 1),
                      ),
                    )
                  }
                  className="w-10 h-10 rounded-xl border font-black text-lg flex items-center justify-center hover:bg-[var(--bg-primary)] transition-colors"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  −
                </button>
                <div
                  className="flex-1 text-center font-black text-2xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.val}
                </div>
                <button
                  onClick={() =>
                    f.set(
                      Math.min(
                        f.max,
                        f.val + (f.label.includes("Weight") ? 5 : 1),
                      ),
                    )
                  }
                  className="w-10 h-10 rounded-xl border font-black text-lg flex items-center justify-center hover:bg-[var(--bg-primary)] transition-colors"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--primary)",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-colors"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(ls, lr, lw);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all hover:brightness-110"
            style={{ background: "var(--primary)" }}
          >
            Save Goal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
