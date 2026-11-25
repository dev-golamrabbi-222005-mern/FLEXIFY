"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function RestOverlay({
  onSkip,
  nextSetNum,
  totalSets,
}: {
  onSkip: () => void;
  nextSetNum: number;
  totalSets: number;
}) {
  const [secs, setSecs] = useState(60);
  const r = 48;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (secs <= 0) {
      onSkip();
      return;
    }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, onSkip]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="rounded-3xl p-8 w-full max-w-xs text-center"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Rest Time
        </p>
        <p
          className="text-sm mb-5 font-semibold"
          style={{ color: "var(--primary)" }}
        >
          Set {nextSetNum - 1} complete · Up next: Set {nextSetNum} of{" "}
          {totalSets}
        </p>

        {/* Ring */}
        <div className="relative w-28 h-28 mx-auto mb-5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
            <circle
              cx="56"
              cy="56"
              r={r}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="7"
            />
            <motion.circle
              cx="56"
              cy="56"
              r={r}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ * (secs / 60) }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-black text-3xl"
              style={{
                color: secs === 0 ? "var(--primary)" : "var(--text-primary)",
              }}
            >
              {secs === 0 ? "GO!" : secs}
            </span>
            {secs > 0 && (
              <span
                className="text-[10px] font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                sec
              </span>
            )}
          </div>
        </div>

        <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
          {secs === 0 ? "Time's up — ready to go!" : "Rest up. You earned it."}
        </p>

        <button
          onClick={onSkip}
          className="w-full py-3 rounded-2xl font-black text-sm text-white hover:brightness-110 transition-all"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 20px var(--primary)40",
          }}
        >
          Skip Rest → Start Set {nextSetNum}
        </button>
      </motion.div>
    </motion.div>
  );
}
