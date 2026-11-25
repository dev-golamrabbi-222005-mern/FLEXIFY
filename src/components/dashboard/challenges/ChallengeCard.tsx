"use client";

import { motion } from "framer-motion";
import { ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ChallengeRecord } from "./StreakSection";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const CHALLENGE_META = {
  "upper-body": {
    label: "Upper Body",
    sub: "7×4 Challenge",
    emoji: "💪",
    tag: "ARMS · CHEST · ABS · SHOULDERS",
  },
  "lower-body": {
    label: "Lower Body",
    sub: "7×4 Challenge",
    emoji: "🦵",
    tag: "THIGHS · GLUTES · CALVES",
  },
};

interface ChallengeCardProps {
  type: "upper-body" | "lower-body";
  index: number;
  record?: ChallengeRecord;
  fmtTime: (secs: number) => string;
}

export default function ChallengeCard({ type, index, record, fmtTime }: ChallengeCardProps) {
  const router = useRouter();
  const meta = CHALLENGE_META[type];
  const done = record?.completedDays?.length ?? 0;
  const pct = Math.round((done / 28) * 100);
  const cal = record?.completedDays?.reduce((s, d) => s + (d.caloriesBurned ?? 0), 0) ?? 0;
  const secs = record?.completedDays?.reduce((s, d) => s + (d.durationSecs ?? 0), 0) ?? 0;
  const isActive = !!record;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1, duration: 0.45, ease }}
      onClick={() => router.push(`/dashboard/challenges/${type}`)}
      className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      <div className="h-1.5 w-full" style={{ background: isActive ? "var(--primary)" : "var(--border-color)" }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-15 h-15 rounded-2xl flex items-center justify-center text-xl"
              style={{
                background: isActive ? "rgba(16,185,129,0.1)" : "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              {meta.emoji}
            </div>
            <div>
              <p className="font-black text-base leading-tight" style={{ color: "var(--text-primary)" }}>{meta.label}</p>
              <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: "var(--primary)" }}>{meta.sub}</p>
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
            style={
              isActive
                ? { background: "rgba(16,185,129,0.1)", color: "var(--primary)", border: "1px solid rgba(16,185,129,0.25)" }
                : { background: "var(--bg-primary)", color: "var(--text-muted)", border: "1px solid var(--border-color)" }
            }
          >
            {isActive ? "Active" : "Start"}
          </div>
        </div>

        <p className="text-[9px] font-black uppercase tracking-[0.15em] mb-3" style={{ color: "var(--text-muted)" }}>
          {meta.tag}
        </p>

        <div className="mb-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="font-black text-2xl leading-none" style={{ color: isActive ? "var(--primary)" : "var(--border-color)" }}>
              {done}
              <span className="text-sm font-semibold ml-1" style={{ color: "var(--text-muted)" }}>/ 28 days</span>
            </span>
            <span className="text-xs font-black" style={{ color: isActive ? "var(--primary)" : "var(--text-muted)" }}>
              {pct}%
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-primary)" }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease }}
            />
          </div>
          {record?.level && (
            <p className="text-[10px] font-bold uppercase mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
              {record.level}
            </p>
          )}
        </div>

        {isActive ? (
          <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
            <div className="flex gap-4">
              {[
                { label: "kcal", val: cal.toLocaleString() },
                { label: "time", val: fmtTime(secs) },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-black text-sm leading-none" style={{ color: "var(--text-primary)" }}>{s.val}</p>
                  <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-white transition-all group-hover:scale-105"
              style={{ background: "var(--primary)", boxShadow: "0 4px 12px rgba(16,185,129,0.3)" }}
            >
              Continue <ChevronRight size={13} />
            </div>
          </div>
        ) : (
          <button
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all hover:bg-[var(--primary)] hover:text-white"
            style={{ background: "var(--bg-primary)", border: "1.5px solid var(--primary)", color: "var(--primary)" }}
          >
            <Zap size={14} /> Start Challenge
          </button>
        )}
      </div>
    </motion.div>
  );
}
