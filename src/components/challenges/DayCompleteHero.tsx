"use client";

import React from "react";
import { motion } from "framer-motion";
import { DayPlan } from "@/lib/challengeUtils";

interface DayCompleteHeroProps {
  dayPlan: DayPlan;
  completedDaysCount: number;
  saved: boolean;
}

export function DayCompleteHero({
  dayPlan,
  completedDaysCount,
  saved,
}: DayCompleteHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl p-8 text-center relative overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(244,121,32,0.08), transparent 65%)",
        }}
      />

      <div className="relative mx-auto mb-5" style={{ width: 90, height: 90 }}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid rgba(244,121,32,${0.35 - i * 0.1})` }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1 + i * 0.28, opacity: [0, 0.6, 0] }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.9 }}
          />
        ))}
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 280,
            damping: 20,
          }}
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background: "rgba(244,121,32,0.12)",
            border: "2px solid rgba(244,121,32,0.4)",
          }}
        >
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <motion.path
              d="M8 21L16 29L32 13"
              stroke="var(--primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.55 }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="font-black tracking-tight mb-1"
        style={{
          fontSize: "clamp(26px, 5vw, 36px)",
          color: "var(--text-primary)",
        }}
      >
        Day {dayPlan.day} Complete! 🎉
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {dayPlan.tagLabel} done · {completedDaysCount}/28 days total
      </motion.p>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-full text-[11px] font-black"
          style={{ background: "#dcfce7", color: "#16a34a" }}
        >
          ✓ Progress saved to your dashboard
        </motion.div>
      )}
    </motion.div>
  );
}
