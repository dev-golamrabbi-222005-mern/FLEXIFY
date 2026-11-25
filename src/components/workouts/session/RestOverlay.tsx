"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

export function RestOverlay({
  restLeft,
  totalRest,
  nextLabel,
  onSkip,
}: {
  restLeft: number;
  totalRest: number;
  nextLabel: string;
  onSkip: () => void;
}) {
  const restPct = totalRest > 0 ? restLeft / totalRest : 0;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="w-full max-w-xs rounded-3xl p-8 text-center"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Rest Time
          </p>
          <p
            className="text-sm font-semibold mb-6"
            style={{ color: "var(--primary)" }}
          >
            {nextLabel}
          </p>
          <div className="relative w-28 h-28 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={RADIUS}
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="6"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={RADIUS}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                animate={{ strokeDashoffset: CIRC * restPct }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-black text-3xl leading-none"
                style={{
                  color:
                    restLeft === 0 ? "var(--primary)" : "var(--text-primary)",
                }}
              >
                {restLeft === 0 ? "GO!" : restLeft}
              </span>
              {restLeft > 0 && (
                <span
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  sec
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onSkip}
            className="w-full py-3 rounded-2xl font-black text-sm text-white hover:brightness-110 transition-all"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
            }}
          >
            Skip Rest →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
