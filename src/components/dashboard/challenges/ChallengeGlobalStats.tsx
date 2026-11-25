"use client";

import { motion } from "framer-motion";
import { Trophy, Flame, Clock } from "lucide-react";

interface ChallengeGlobalStatsProps {
  totalDays: number;
  totalCal: number;
  totalSecs: number;
  fmtTime: (secs: number) => string;
}

export default function ChallengeGlobalStats({
  totalDays,
  totalCal,
  totalSecs,
  fmtTime,
}: ChallengeGlobalStatsProps) {
  if (totalDays <= 0) return null;

  const stats = [
    { icon: Trophy, label: "Challenge Done", val: totalDays, unit: "/56" },
    { icon: Flame, label: "Kcal Burned", val: totalCal, unit: "" },
    { icon: Clock, label: "Time Spent", val: null, time: fmtTime(totalSecs) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="grid grid-cols-3 gap-3"
    >
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 + i * 0.07 }}
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <s.icon size={14} className="mx-auto mb-1.5" style={{ color: "var(--primary)" }} />
          <p className="font-black text-lg leading-none" style={{ color: "var(--text-primary)" }}>
            {s.time ?? (
              <>
                {s.val?.toLocaleString()}
                <span className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  {s.unit}
                </span>
              </>
            )}
          </p>
          <p className="text-[9px] font-black uppercase tracking-wider mt-1" style={{ color: "var(--text-muted)" }}>
            {s.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}
