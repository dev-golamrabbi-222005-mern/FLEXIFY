"use client";

import { motion } from "framer-motion";
import { LayoutGrid, History, Zap } from "lucide-react";

interface WorkoutQuickStatsProps {
  suggestedCount: number;
  customCount: number;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function WorkoutQuickStats({ suggestedCount, customCount }: WorkoutQuickStatsProps) {
  const stats = [
    { icon: LayoutGrid, label: "Suggested", val: suggestedCount },
    { icon: History, label: "My Routines", val: customCount },
    { icon: Zap, label: "Total Plans", val: suggestedCount + customCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.45, ease }}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 + i * 0.06, duration: 0.45, ease }}
          className="rounded-2xl p-4 text-center"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
        >
          <s.icon size={14} className="mx-auto mb-1.5" style={{ color: "var(--primary)" }} />
          <p className="font-black text-lg leading-none" style={{ color: "var(--text-primary)" }}>{s.val}</p>
          <p className="text-[9px] font-black uppercase tracking-wider mt-1" style={{ color: "var(--text-muted)" }}>{s.label}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
