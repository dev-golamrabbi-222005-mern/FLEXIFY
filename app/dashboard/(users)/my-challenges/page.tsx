// app/dashboard/my-challenges/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Loader2,
  Swords,
  ChevronRight,
  Flame,
  Clock,
  Trophy,
  Zap,
  CalendarCheck,
} from "lucide-react";

interface DayProgress {
  day: number;
  week: number;
  tag: string;
  completedAt: string;
  durationSecs: number;
  caloriesBurned: number;
  exercisesDone: number;
}

interface ChallengeRecord {
  type: "upper-body" | "lower-body";
  level: string;
  startedAt: string;
  completedDays: DayProgress[];
}

function fmtTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s}s`;
}

// ── Compute current streak from completedDays ─────────────────────────────────
function computeStreak(records: ChallengeRecord[]): number {
  if (!records.length) return 0;

  // Gather all unique completion dates across all challenges
  const allDates = records
    .flatMap((r) => r.completedDays.map((d) => new Date(d.completedAt)))
    .map((d) => {
      // normalize to YYYY-MM-DD string
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    });

  const uniqueDates = [...new Set(allDates)].sort().reverse(); // latest first
  if (!uniqueDates.length) return 0;

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const yesterdayDate = new Date(today);
  yesterdayDate.setDate(today.getDate() - 1);
  const yesterdayStr = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, "0")}-${String(yesterdayDate.getDate()).padStart(2, "0")}`;

  // Streak must include today or yesterday to be "active"
  if (uniqueDates[0] !== todayStr && uniqueDates[0] !== yesterdayStr) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const prev = new Date(uniqueDates[i - 1]);
    const curr = new Date(uniqueDates[i]);
    const diff = Math.round(
      (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diff === 1) streak++;
    else break;
  }
  return streak;
}

const CHALLENGE_META = {
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

const TAG_EMOJI: Record<string, string> = {
  arm: "💪",
  chest: "🏋️",
  abs: "🔥",
  shoulder: "🦾",
  thigh: "🦵",
  butt: "🍑",
  calfs: "🦶",
};

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ── Streak Section ────────────────────────────────────────────────────────────
function StreakSection({ records }: { records: ChallengeRecord[] }) {
  const streak = computeStreak(records);

  // Last 7 days activity map
  const activityDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const str = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const isToday = i === 6;
    const hasActivity = records.some((r) =>
      r.completedDays.some((p) => {
        const pd = new Date(p.completedAt);
        const pStr = `${pd.getFullYear()}-${String(pd.getMonth() + 1).padStart(2, "0")}-${String(pd.getDate()).padStart(2, "0")}`;
        return pStr === str;
      }),
    );
    return {
      d,
      isToday,
      hasActivity,
      label: d.toLocaleDateString("en", { weekday: "short" }).slice(0, 1),
    };
  });

  const longestStreak = streak; // simplified — could compute separately
  const totalDays = records.reduce((s, r) => s + r.completedDays.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.5, ease }}
      className="rounded-3xl p-5 relative overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Subtle glow */}
      {streak > 0 && (
        <div
          className="absolute -top-8 -left-8 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)",
          }}
        />
      )}

      <div className="relative z-10">
        {/* Top row */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-[0.2em] mb-1"
              style={{ color: "var(--text-muted)" }}
            >
              Activity Streak
            </p>
            <div className="flex items-end gap-2">
              <span
                className="font-black leading-none"
                style={{
                  fontSize: 48,
                  color: streak > 0 ? "var(--primary)" : "var(--border-color)",
                }}
              >
                {streak}
              </span>
              <div className="pb-2">
                <p
                  className="font-black text-sm leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  day{streak !== 1 ? "s" : ""}
                </p>
                <p
                  className="text-[10px] font-bold"
                  style={{ color: "var(--text-muted)" }}
                >
                  current streak
                </p>
              </div>
              {streak >= 3 && (
                <motion.span
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    repeatDelay: 2,
                  }}
                  className="text-2xl pb-1"
                >
                  🔥
                </motion.span>
              )}
            </div>
          </div>

          {/* Mini stats */}
          <div className="flex flex-col gap-2 items-end">
            {[
              { label: "Best", val: `${longestStreak}d` },
              { label: "Total", val: `${totalDays}d` },
            ].map((s) => (
              <div key={s.label} className="text-right">
                <p
                  className="font-black text-base leading-none"
                  style={{ color: "var(--text-primary)" }}
                >
                  {s.val}
                </p>
                <p
                  className="text-[9px] font-black uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Last 7 days */}
        <div>
          <p
            className="text-[11px] font-black uppercase tracking-widest mb-2.5"
            style={{ color: "var(--text-muted)" }}
          >
            Last 7 Days
          </p>
          <div className="flex gap-2">
            {activityDays.map((day, i) => (
              <div
                key={i}
                className="flex-1 flex flex-col items-center gap-1.5"
              >
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.05, duration: 0.3 }}
                  className="w-full rounded-xl flex items-center justify-center"
                  style={{
                    height: 36,
                    background: day.hasActivity
                      ? "var(--primary)"
                      : day.isToday
                        ? "rgba(16,185,129,0.1)"
                        : "var(--bg-primary)",
                    border: day.isToday
                      ? "1.5px solid var(--primary)"
                      : "1.5px solid var(--border-color)",
                  }}
                >
                  {day.hasActivity ? (
                    <span className="text-white font-black">✓</span>
                  ) : day.isToday ? (
                    <span
                      className="text-xs"
                      style={{ color: "var(--primary)" }}
                    >
                      ·
                    </span>
                  ) : (
                    <span
                      className="text-[10px]"
                      style={{ color: "var(--border-color)" }}
                    >
                      —
                    </span>
                  )}
                </motion.div>
                <span
                  className="text-[11px] font-black uppercase"
                  style={{
                    color: day.isToday ? "var(--primary)" : "var(--text-muted)",
                  }}
                >
                  {day.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivational message */}
        <div
          className="mt-4 px-3 py-2 rounded-xl text-center"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[12px] font-semibold"
            style={{ color: "var(--text-secondary)" }}
          >
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

export default function MyChallengesPage() {
  const router = useRouter();
  const [records, setRecords] = useState<ChallengeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const [upper, lower] = await Promise.all([
          fetch("/api/challenges/progress?type=upper-body").then((r) =>
            r.json(),
          ),
          fetch("/api/challenges/progress?type=lower-body").then((r) =>
            r.json(),
          ),
        ]);
        const results: ChallengeRecord[] = [];
        if (upper.progress) results.push(upper.progress);
        if (lower.progress) results.push(lower.progress);
        setRecords(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "var(--primary)" }}
        />
        <p
          className="text-[11px] font-black uppercase tracking-widest animate-pulse"
          style={{ color: "var(--text-muted)" }}
        >
          Loading your challenges...
        </p>
      </div>
    );
  }

  const totalDays = records.reduce(
    (s, r) => s + (r.completedDays?.length ?? 0),
    0,
  );
  const totalCal = records.reduce(
    (s, r) =>
      s + r.completedDays.reduce((a, d) => a + (d.caloriesBurned ?? 0), 0),
    0,
  );
  const totalSecs = records.reduce(
    (s, r) =>
      s + r.completedDays.reduce((a, d) => a + (d.durationSecs ?? 0), 0),
    0,
  );

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 space-y-6"
      style={{ fontFamily: "'Sora', sans-serif" }}
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
              style={{ color: "var(--primary)" }}
            >
              — Your Arena
            </p>
            <h1
              className="font-black tracking-tighter"
              style={{
                fontSize: "clamp(28px, 5vw, 42px)",
                color: "var(--text-primary)",
              }}
            >
              My Challenges
            </h1>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            <Swords size={20} style={{ color: "var(--primary)" }} />
          </div>
        </div>
      </motion.div>

      {/* ── Streak Section ── */}
      <StreakSection records={records} />

      {/* ── Global stats (only when active) ── */}
      {totalDays > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: Trophy, label: "Challenge Done", val: totalDays, unit: "/56" },
            { icon: Flame, label: "Kcal Burned", val: totalCal, unit: "" },
            {
              icon: Clock,
              label: "Time Spent",
              val: null,
              time: fmtTime(totalSecs),
            },
          ].map((s, i) => (
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
              <s.icon
                size={14}
                className="mx-auto mb-1.5"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-black text-lg leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {s.time ?? (
                  <>
                    {s.val?.toLocaleString()}
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.unit}
                    </span>
                  </>
                )}
              </p>
              <p
                className="text-[9px] font-black uppercase tracking-wider mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Challenge Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {(["upper-body", "lower-body"] as const).map((type, i) => {
          const meta = CHALLENGE_META[type];
          const record = records.find((r) => r.type === type);
          const done = record?.completedDays?.length ?? 0;
          const pct = Math.round((done / 28) * 100);
          const cal =
            record?.completedDays?.reduce(
              (s, d) => s + (d.caloriesBurned ?? 0),
              0,
            ) ?? 0;
          const secs =
            record?.completedDays?.reduce(
              (s, d) => s + (d.durationSecs ?? 0),
              0,
            ) ?? 0;
          const isActive = !!record;

          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.45, ease }}
              onClick={() => router.push(`/dashboard/challenges/${type}`)}
              className="group rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {/* Colored top bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background: isActive
                    ? "var(--primary)"
                    : "var(--border-color)",
                }}
              />

              <div className="p-5">
                {/* Top row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl"
                      style={{
                        background: isActive
                          ? "rgba(16,185,129,0.1)"
                          : "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {meta.emoji}
                    </div>
                    <div>
                      <p
                        className="font-black text-base leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {meta.label}
                      </p>
                      <p
                        className="text-[10px] font-black uppercase tracking-wider"
                        style={{ color: "var(--primary)" }}
                      >
                        {meta.sub}
                      </p>
                    </div>
                  </div>
                  <div
                    className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
                    style={
                      isActive
                        ? {
                            background: "rgba(16,185,129,0.1)",
                            color: "var(--primary)",
                            border: "1px solid rgba(16,185,129,0.25)",
                          }
                        : {
                            background: "var(--bg-primary)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border-color)",
                          }
                    }
                  >
                    {isActive ? "Active" : "Start"}
                  </div>
                </div>

                {/* Tag line */}
                <p
                  className="text-[9px] font-black uppercase tracking-[0.15em] mb-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  {meta.tag}
                </p>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span
                      className="font-black text-2xl leading-none"
                      style={{
                        color: isActive
                          ? "var(--primary)"
                          : "var(--border-color)",
                      }}
                    >
                      {done}
                      <span
                        className="text-sm font-semibold ml-1"
                        style={{ color: "var(--text-muted)" }}
                      >
                        / 28 days
                      </span>
                    </span>
                    <span
                      className="text-xs font-black"
                      style={{
                        color: isActive
                          ? "var(--primary)"
                          : "var(--text-muted)",
                      }}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: "var(--bg-primary)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--primary)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ delay: 0.5 + i * 0.1, duration: 0.8, ease }}
                    />
                  </div>
                  {record?.level && (
                    <p
                      className="text-[10px] font-bold uppercase mt-1 capitalize"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {record.level}
                    </p>
                  )}
                </div>

                {/* Bottom */}
                {isActive ? (
                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: "1px solid var(--border-color)" }}
                  >
                    <div className="flex gap-4">
                      {[
                        { label: "kcal", val: cal.toLocaleString() },
                        { label: "time", val: fmtTime(secs) },
                      ].map((s) => (
                        <div key={s.label}>
                          <p
                            className="font-black text-sm leading-none"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {s.val}
                          </p>
                          <p
                            className="text-[9px] font-bold uppercase tracking-wider mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {s.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-white transition-all group-hover:scale-105"
                      style={{
                        background: "var(--primary)",
                        boxShadow: "0 4px 12px rgba(16,185,129,0.3)",
                      }}
                    >
                      Continue <ChevronRight size={13} />
                    </div>
                  </div>
                ) : (
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-sm transition-all hover:bg-[var(--primary)] hover:text-white"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1.5px solid var(--primary)",
                      color: "var(--primary)",
                    }}
                  >
                    <Zap size={14} /> Start Challenge
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Recent Activity ── */}
      {records.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-color)" }}
            />
            <p
              className="text-[10px] font-black uppercase tracking-[0.25em]"
              style={{ color: "var(--text-muted)" }}
            >
              Recent Activity
            </p>
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-color)" }}
            />
          </div>

          <div className="space-y-2">
            {records
              .flatMap((r) =>
                r.completedDays.map((d) => ({ ...d, type: r.type })),
              )
              .sort(
                (a, b) =>
                  new Date(b.completedAt).getTime() -
                  new Date(a.completedAt).getTime(),
              )
              .slice(0, 8)
              .map((d, i) => {
                const meta =
                  CHALLENGE_META[d.type as keyof typeof CHALLENGE_META];
                const emoji = TAG_EMOJI[d.tag] ?? "🏋️";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.05 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-color)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex flex-col items-center justify-center shrink-0"
                      style={{
                        background: "rgba(16,185,129,0.08)",
                        border: "1px solid rgba(16,185,129,0.18)",
                      }}
                    >
                      <span
                        className="font-black text-[10px] leading-none"
                        style={{ color: "var(--primary)" }}
                      >
                        D{d.day}
                      </span>
                      <span className="text-[9px] leading-none mt-0.5">
                        {emoji}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-black text-sm leading-tight"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {meta.label} ·{" "}
                        <span className="capitalize">{d.tag}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          ⏱ {fmtTime(d.durationSecs)}
                        </span>
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          🔥 {d.caloriesBurned} kcal
                        </span>
                        <span
                          className="text-[10px] font-semibold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          ✅ {d.exercisesDone} ex
                        </span>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p
                        className="text-[10px] font-black"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {new Date(d.completedAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                      <div
                        className="w-1.5 h-1.5 rounded-full ml-auto mt-1"
                        style={{ background: "var(--primary)" }}
                      />
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </motion.div>
      )}

      {/* ── Empty state ── */}
      {records.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-16 rounded-3xl"
          style={{
            border: "2px dashed var(--border-color)",
            background: "var(--bg-secondary)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.2)",
            }}
          >
            <Swords size={24} style={{ color: "var(--primary)" }} />
          </div>
          <p
            className="font-black text-lg mb-1"
            style={{ color: "var(--text-primary)" }}
          >
            No challenges yet
          </p>
          <p
            className="text-sm mb-6 max-w-xs mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Pick a challenge and start your 28-day transformation journey.
          </p>
          <button
            onClick={() => router.push("/#challenges")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white"
            style={{
              background: "var(--primary)",
              boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
            }}
          >
            Browse Challenges <ChevronRight size={14} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
