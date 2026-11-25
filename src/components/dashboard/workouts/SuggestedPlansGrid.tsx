"use client";

import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { WorkoutCard } from "@/components/cards/SuggestedWorkoutCard";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const LEVEL_META: Record<string, { emoji: string; color: string; label: string }> = {
  beginner: { emoji: "🌱", color: "#10B981", label: "Beginner" },
  intermediate: { emoji: "⚡", color: "#f47920", label: "Intermediate" },
  advanced: { emoji: "🔥", color: "#ef4444", label: "Advanced" },
  expert: { emoji: "🏆", color: "#8b5cf6", label: "Expert" },
};

function getLevelMeta(level: string) {
  return LEVEL_META[level.toLowerCase()] ?? { emoji: "💪", color: "var(--primary)", label: level };
}

interface SuggestedPlansGridProps {
  suggestedEntries: [string, any[]][];
}

export default function SuggestedPlansGrid({ suggestedEntries }: SuggestedPlansGridProps) {
  if (suggestedEntries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.45, ease }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
        <div className="flex items-center gap-2">
          <Dumbbell size={22} style={{ color: "var(--primary)" }} />
          <p className="text-3xl font-bold uppercase tracking-[0.1em]">Suggested Plans</p>
        </div>
        <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {suggestedEntries.map(([level, exercises], i) => {
          const meta = getLevelMeta(level);
          return (
            <motion.div
              key={level}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 + i * 0.08, duration: 0.4, ease }}
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
            >
              <div className="h-1.5 w-full" style={{ background: meta.color }} />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base leading-tight capitalize" style={{ color: "var(--text-primary)" }}>
                      {meta.label}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: meta.color }}>
                      {exercises.length} exercises
                    </p>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0"
                    style={{ background: `${meta.color}12`, color: meta.color, border: `1px solid ${meta.color}25` }}
                  >
                    Free
                  </span>
                </div>
                <WorkoutCard title={level} exercises={exercises} type="suggested" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
