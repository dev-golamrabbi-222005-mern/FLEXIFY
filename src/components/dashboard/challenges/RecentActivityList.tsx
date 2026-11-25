"use client";

import { motion } from "framer-motion";
import type { ChallengeRecord } from "./StreakSection";
import { CHALLENGE_META } from "./ChallengeCard";

export const TAG_EMOJI: Record<string, string> = {
  arm: "💪",
  chest: "🏋️",
  abs: "🔥",
  shoulder: "🦾",
  thigh: "🦵",
  butt: "🍑",
  calfs: "🦶",
};

interface RecentActivityListProps {
  records: ChallengeRecord[];
  fmtTime: (secs: number) => string;
}

export default function RecentActivityList({ records, fmtTime }: RecentActivityListProps) {
  if (records.length === 0) return null;

  const activities = records
    .flatMap((r) => r.completedDays.map((d) => ({ ...d, type: r.type })))
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 8);

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
        <p className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: "var(--text-muted)" }}>
          Recent Activity
        </p>
        <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
      </div>

      <div className="space-y-2">
        {activities.map((d, i) => {
          const meta = CHALLENGE_META[d.type as keyof typeof CHALLENGE_META];
          const emoji = TAG_EMOJI[d.tag] ?? "🏋️";
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.05 }}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
            >
              <div
                className="w-9 h-9 rounded-xl flex flex-col items-center justify-center shrink-0"
                style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)" }}
              >
                <span className="font-black text-[10px] leading-none" style={{ color: "var(--primary)" }}>D{d.day}</span>
                <span className="text-[9px] leading-none mt-0.5">{emoji}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-sm leading-tight" style={{ color: "var(--text-primary)" }}>
                  {meta?.label} · <span className="capitalize">{d.tag}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                    ⏱ {fmtTime(d.durationSecs)}
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                    🔥 {d.caloriesBurned} kcal
                  </span>
                  <span className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                    ✅ {d.exercisesDone} ex
                  </span>
                </div>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-[10px] font-black" style={{ color: "var(--text-muted)" }}>
                  {new Date(d.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </p>
                <div className="w-1.5 h-1.5 rounded-full ml-auto mt-1" style={{ background: "var(--primary)" }} />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
