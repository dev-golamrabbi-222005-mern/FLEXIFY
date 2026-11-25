"use client";

import { motion } from "framer-motion";

export interface DayProgress {
  day: number;
  week: number;
  tag: string;
  completedAt: string;
  durationSecs: number;
  caloriesBurned: number;
  exercisesDone: number;
}

export interface ChallengeRecord {
  type: "upper-body" | "lower-body";
  level: string;
  startedAt: string;
  completedDays: DayProgress[];
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function computeStreak(records: ChallengeRecord[]): number {
  if (!records.length) return 0;
  const allDates = records
    .flatMap((r) => r.completedDays.map((d) => new Date(d.completedAt)))
    .map((d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`);

  const uniqueDates = [...new Set(allDates)].sort().reverse();
  if (!uniqueDates.length) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;

  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round((prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24));
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

export default function StreakSection({ records }: { records: ChallengeRecord[] }) {
  const streak = computeStreak(records);
  const activityDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const isToday = i === 6;
    const hasActivity = records.some((r) =>
      r.completedDays.some((p) => {
        const pd = new Date(p.completedAt);
        return `${pd.getFullYear()}-${String(pd.getMonth() + 1).padStart(2, "0")}-${String(pd.getDate()).padStart(2, "0")}` === str;
      })
    );
    return { d, isToday, hasActivity, label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 1) };
  });

  const longestStreak = streak;
  const totalDays = records.reduce((s, r) => s + r.completedDays.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5, ease }}
      className="rounded-3xl p-5 relative overflow-hidden"
      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
    >
      {streak > 0 && (
        <div
          className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)" }}
        />
      )}
      <div className="relative z-10">
        <title>My Challenges | Dashboard - Flexify</title>
        <div className="flex items-start justify-between mb-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1" style={{ color: "var(--text-muted)" }}>
              Activity Streak
            </p>
            <div className="flex items-end gap-2">
              <span className="font-black leading-none" style={{ fontSize: 48, color: streak > 0 ? "var(--primary)" : "var(--border-color)" }}>
                {streak}
              </span>
              <div className="pb-2">
                <p className="font-black text-sm leading-none" style={{ color: "var(--text-primary)" }}>
                  day{streak !== 1 ? "s" : ""}
                </p>
                <p className="text-[10px] font-bold" style={{ color: "var(--text-muted)" }}>current streak</p>
              </div>
              {streak >= 3 && (
                <motion.span animate={{ rotate: [0, -10, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2.5, repeatDelay: 2 }} className="text-2xl pb-1">
                  🔥
                </motion.span>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2 items-end">
            {[
              { label: "Best", val: `${longestStreak}d` },
              { label: "Total", val: `${totalDays}d` },
            ].map((s) => (
              <div key={s.label} className="text-right">
                <p className="font-black text-base leading-none" style={{ color: "var(--text-primary)" }}>{s.val}</p>
                <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] font-black uppercase tracking-widest mb-2.5" style={{ color: "var(--text-muted)" }}>Last 7 Days</p>
          <div className="flex gap-2">
            {activityDays.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                  className="w-full rounded-xl flex items-center justify-center"
                  style={{
                    height: 36,
                    background: day.hasActivity ? "var(--primary)" : day.isToday ? "rgba(16,185,129,0.1)" : "var(--bg-primary)",
                    border: day.isToday ? "1.5px solid var(--primary)" : "1.5px solid var(--border-color)",
                  }}
                >
                  {day.hasActivity ? (
                    <span className="text-white font-black">✓</span>
                  ) : day.isToday ? (
                    <span className="text-xs" style={{ color: "var(--primary)" }}>·</span>
                  ) : (
                    <span className="text-[10px]" style={{ color: "var(--border-color)" }}>—</span>
                  )}
                </motion.div>
                <span className="text-[11px] font-black uppercase" style={{ color: day.isToday ? "var(--primary)" : "var(--text-muted)" }}>
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 px-3 py-2 rounded-xl text-center" style={{ background: "var(--bg-primary)", border: "1px solid var(--border-color)" }}>
          <p className="text-[12px] font-semibold" style={{ color: "var(--text-secondary)" }}>
            {streak === 0
              ? "Start today to build your streak! 💪"
              : streak < 3
                ? "Great start! Keep the momentum going 🚀"
                : streak < 7
                  ? `${streak} days strong! You're on fire 🔥`
                  : `Incredible! ${streak}-day streak. You're unstoppable 🏆`}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
