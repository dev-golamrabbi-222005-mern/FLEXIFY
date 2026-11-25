"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { playRestSound } from "./restTimerAudio";

interface RestTimerProps {
  onClose: () => void;
  nextLabel?: string;
}

const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

export default function RestTimer({ onClose, nextLabel }: RestTimerProps) {
  const [targetTime, setTargetTime] = useState(60);
  const [currentTime, setCurrentTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const remaining = Math.max(0, targetTime - currentTime);
  const restPct = remaining / targetTime;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1;
        const rem = targetTime - next;
        if (rem === 4 || rem === 3) playRestSound("tick");
        if (rem === 2 || rem === 1) playRestSound("warning");
        if (rem === 0) playRestSound("finish");
        return next;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetTime]);

  useEffect(() => {
    if (currentTime >= targetTime) onClose();
  }, [currentTime, targetTime, onClose]);

  const handleAdjust = (delta: number) => {
    setTargetTime((p) => Math.max(10, p + delta));
    setCurrentTime(0);
  };

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
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
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
            {nextLabel ?? "Recover before next set"}
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
                animate={{ strokeDashoffset: CIRC * (1 - restPct) }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-black text-3xl leading-none"
                style={{
                  color: remaining === 0 ? "var(--primary)" : "var(--text-primary)",
                }}
              >
                {remaining === 0 ? "GO!" : remaining}
              </span>
              {remaining > 0 && (
                <span
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  sec
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2 mb-5">
            <button
              onClick={() => handleAdjust(-10)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all hover:text-[var(--primary)] hover:border-[var(--primary)] cursor-pointer"
              style={{
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              <Minus size={12} /> 10s
            </button>
            <button
              onClick={() => handleAdjust(10)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black transition-all hover:text-[var(--primary)] hover:border-[var(--primary)] cursor-pointer"
              style={{
                border: "1.5px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              <Plus size={12} /> 10s
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl font-black text-sm text-white hover:brightness-110 transition-all cursor-pointer"
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
