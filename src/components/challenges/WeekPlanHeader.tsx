"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { Level, ChallengeType } from "@/lib/challengeUtils";

interface WeekPlanHeaderProps {
  type: ChallengeType;
  level: Level;
  completedCount: number;
  onBack: () => void;
}

export function WeekPlanHeader({
  type,
  level,
  completedCount,
  onBack,
}: WeekPlanHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[var(--primary)] transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className="mb-8">
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{ color: "var(--primary)" }}
        >
          {type === "upper-body" ? "Upper Body" : "Lower Body"} · {level}
        </p>
        <h2
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(24px, 5vw, 36px)",
            color: "var(--text-primary)",
          }}
        >
          Your 4-Week Plan
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          {completedCount}/28 days completed
        </p>

        <div
          className="mt-3 h-2 rounded-full overflow-hidden"
          style={{ background: "var(--border-color)" }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "var(--primary)" }}
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / 28) * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </div>
    </>
  );
}
