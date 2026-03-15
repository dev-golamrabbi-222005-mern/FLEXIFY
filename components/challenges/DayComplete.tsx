"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Calendar, LogIn, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPlan, fmtTime, ChallengeType, Level } from "@/lib/challengeUtils";

interface Props {
  dayPlan: DayPlan;
  type: ChallengeType;
  level: Level;
  durationSecs: number;
  caloriesBurned: number;
  exercisesDone: number;
  completedDays: number[];
  onDoAgain: () => void;
  onNextDay: () => void;
}

function AnimNum({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

// Simple inline calendar for current month
function MonthCalendar({ completedDays, dayPlan }: { completedDays: number[]; dayPlan: DayPlan }) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const monthName = today.toLocaleString("default", { month: "long", year: "numeric" });

  // Map absolute challenge days to calendar dates (assume challenge started today - (dayPlan.day - 1) days ago)
  const challengeStart = new Date(today);
  challengeStart.setDate(today.getDate() - (dayPlan.day - 1));

  const completedDates = new Set(
    completedDays.map((d) => {
      const date = new Date(challengeStart);
      date.setDate(challengeStart.getDate() + (d - 1));
      return date.getDate();
    })
  );

  return (
    <div
      className="rounded-2xl p-4"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <p
        className="text-[11px] font-black uppercase tracking-widest mb-4 text-center"
        style={{ color: "var(--text-secondary)" }}
      >
        📅 {monthName}
      </p>

      {/* Day labels */}
      <div className="grid grid-cols-7 mb-1">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <p
            key={i}
            className="text-center text-[10px] font-black uppercase"
            style={{ color: "var(--text-secondary)" }}
          >
            {d}
          </p>
        ))}
      </div>

      {/* Calendar cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {/* Empty cells before first day */}
        {Array.from({ length: firstDow }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          const isDone = completedDates.has(day);

          return (
            <div
              key={day}
              className="flex items-center justify-center rounded-lg"
              style={{ height: 28 }}
            >
              <span
                className="text-[11px] font-black w-6 h-6 flex items-center justify-center rounded-full"
                style={{
                  background: isDone
                    ? "var(--primary)"
                    : isToday
                      ? "rgba(244,121,32,0.15)"
                      : "transparent",
                  color: isDone
                    ? "#fff"
                    : isToday
                      ? "var(--primary)"
                      : "var(--text-secondary)",
                }}
              >
                {isDone ? "✓" : day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Login warning modal
function LoginWarningModal({
  open,
  onLogin,
  onCancel,
}: {
  open: boolean;
  onLogin: () => void;
  onCancel: () => void;
}) {
  const [confirmLose, setConfirmLose] = useState(false);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="w-full max-w-sm rounded-3xl p-6"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {!confirmLose ? (
              <>
                <div className="text-4xl mb-4 text-center">⚠️</div>
                <h3
                  className="font-black text-base text-center mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Save Your Progress
                </h3>
                <p
                  className="text-sm text-center mb-6 leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Please login to keep your progress recorded, otherwise it will be lost.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={onLogin}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm text-white"
                    style={{
                      background: "var(--primary)",
                      boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
                    }}
                  >
                    <LogIn size={16} /> Login to Save
                  </button>
                  <button
                    onClick={() => setConfirmLose(true)}
                    className="w-full py-3 rounded-2xl font-semibold text-sm transition-colors"
                    style={{
                      border: "1px solid var(--border-color)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Continue without saving
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4 text-center">🗑️</div>
                <h3
                  className="font-black text-base text-center mb-3"
                  style={{ color: "var(--text-primary)" }}
                >
                  Are you sure?
                </h3>
                <p
                  className="text-sm text-center mb-6"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Your workout record for today will be permanently lost.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setConfirmLose(false)}
                    className="flex-1 py-3 rounded-2xl font-bold text-sm"
                    style={{
                      background: "var(--bg-primary)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-primary)",
                    }}
                  >
                    Go Back
                  </button>
                  <button
                    onClick={onCancel}
                    className="flex-1 py-3 rounded-2xl font-black text-sm text-white bg-red-500"
                  >
                    Yes, Lose It
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function DayComplete({
  dayPlan, type, level,
  durationSecs, caloriesBurned, exercisesDone,
  completedDays, onDoAgain, onNextDay,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Show login warning if not logged in
  useEffect(() => {
    if (!session) {
      const t = setTimeout(() => setLoginModalOpen(true), 1200);
      return () => clearTimeout(t);
    } else {
      saveProgress();
    }
  }, [session]);

  const saveProgress = async () => {
    if (!session || saved) return;
    try {
      await fetch("/api/challenges/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type, level,
          day: dayPlan.day,
          week: dayPlan.week,
          tag: dayPlan.tag,
          durationSecs,
          caloriesBurned,
          exercisesDone,
        }),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  const handleLogin = () => {
    router.push(`/login?redirect=/dashboard/challenges/${type}`);
  };

  const allCompleted = [...completedDays, dayPlan.day];

  return (
    <div className="w-full max-w-lg mx-auto pb-8 space-y-4">
      {/* Animated checkmark hero */}
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
            background: "radial-gradient(circle at 50% 40%, rgba(244,121,32,0.08), transparent 65%)",
          }}
        />

        {/* Check badge */}
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
            transition={{ delay: 0.15, type: "spring", stiffness: 280, damping: 20 }}
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
          style={{ fontSize: "clamp(26px, 5vw, 36px)", color: "var(--text-primary)" }}
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
          {dayPlan.tagLabel} done ·{" "}
          {allCompleted.length}/28 days total
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

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { emoji: "🔥", label: "Calories", val: caloriesBurned, unit: "kcal" },
          { emoji: "⏱",  label: "Duration", val: null, time: fmtTime(durationSecs) },
          { emoji: "✅", label: "Exercises", val: exercisesDone, unit: "" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <span className="text-xl">{s.emoji}</span>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
              <p className="font-black text-xl leading-none" style={{ color: "var(--text-primary)" }}>
                {s.time ?? <><AnimNum to={s.val!} />{s.unit && <span className="text-xs font-semibold ml-0.5" style={{ color: "var(--text-secondary)" }}>{s.unit}</span>}</>}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Calendar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MonthCalendar completedDays={allCompleted} dayPlan={dayPlan} />
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={onDoAgain}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <RotateCcw size={15} /> Do Again
        </button>
        <motion.button
          onClick={onNextDay}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white"
          style={{
            background: "var(--primary)",
            boxShadow: "0 6px 24px rgba(244,121,32,0.35)",
          }}
        >
          Day {Math.min(dayPlan.day + 1, 28)} <ChevronRight size={15} />
        </motion.button>
      </motion.div>

      {/* Login Warning Modal */}
      <LoginWarningModal
        open={loginModalOpen}
        onLogin={handleLogin}
        onCancel={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
