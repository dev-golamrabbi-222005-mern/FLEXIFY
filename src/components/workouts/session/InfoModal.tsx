"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SessionExercise, ease } from "./types";

export function InfoModal({
  exercise,
  onClose,
}: {
  exercise: SessionExercise | null;
  onClose: () => void;
}) {
  if (!exercise) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="w-full max-w-md rounded-3xl p-6 space-y-4"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base" style={{ color: "var(--text-primary)" }}>
              {exercise.name}
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--primary)]"
            >
              ✕
            </button>
          </div>
          {exercise.instructions && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(Array.isArray(exercise.instructions)
                ? exercise.instructions
                : [exercise.instructions]
              ).map((ins: string, i: number) => (
                <div key={i} className="flex gap-2.5">
                  <span
                    className="font-black text-xs shrink-0 mt-0.5"
                    style={{ color: "var(--primary)" }}
                  >
                    {i + 1}.
                  </span>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    {ins}
                  </p>
                </div>
              ))}
            </div>
          )}
          {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {exercise.primaryMuscles.map((m: string) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-black capitalize"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "var(--primary)",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
