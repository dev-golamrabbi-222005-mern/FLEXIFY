"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ExerciseResult {
  id: string;
  name: string;
  totalVolume: number;
  avgHeartRate: number;
  calories: number;
  peakHeartRate: number;
  vsLastWeek: number; // percentage change
  zones: {
    warmup: number;
    fatBurn: number;
    cardio: number;
    peak: number;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────
const EXERCISES: ExerciseResult[] = [
  {
    id: "1",
    name: "Barbell Squats",
    totalVolume: 1250,
    avgHeartRate: 145,
    calories: 120,
    peakHeartRate: 165,
    vsLastWeek: 5,
    zones: { warmup: 55, fatBurn: 72, cardio: 88, peak: 68 },
  },
  {
    id: "2",
    name: "Romanian Deadlift",
    totalVolume: 980,
    avgHeartRate: 138,
    calories: 98,
    peakHeartRate: 158,
    vsLastWeek: -2,
    zones: { warmup: 45, fatBurn: 65, cardio: 95, peak: 55 },
  },
  {
    id: "3",
    name: "Leg Press",
    totalVolume: 1600,
    avgHeartRate: 130,
    calories: 85,
    peakHeartRate: 148,
    vsLastWeek: 12,
    zones: { warmup: 60, fatBurn: 80, cardio: 70, peak: 40 },
  },
  {
    id: "4",
    name: "Leg Curl",
    totalVolume: 420,
    avgHeartRate: 122,
    calories: 60,
    peakHeartRate: 135,
    vsLastWeek: 8,
    zones: { warmup: 50, fatBurn: 60, cardio: 55, peak: 30 },
  },
  {
    id: "5",
    name: "Calf Raises",
    totalVolume: 600,
    avgHeartRate: 115,
    calories: 45,
    peakHeartRate: 128,
    vsLastWeek: 3,
    zones: { warmup: 40, fatBurn: 50, cardio: 45, peak: 20 },
  },
];

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  duration = 1200,
}: {
  value: number;
  duration?: number;
}) {
  const [display, setDisplay] = useState(0);
  const start = useRef<number | null>(null);

  useEffect(() => {
    setDisplay(0);
    start.current = null;
    let raf: number;

    const animate = (ts: number) => {
      if (!start.current) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{display.toLocaleString()}</>;
}

// ─── Intensity Bar ────────────────────────────────────────────────────────────
function IntensityBar({
  label,
  value,
  max,
  color,
  delay,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
  delay: number;
}) {
  const pct = (value / max) * 100;

  return (
    <div className="flex flex-col items-center gap-2 flex-1">
      <div className="w-full flex items-end" style={{ height: "100px" }}>
        <div
          className="w-full rounded-t-xl overflow-hidden relative"
          style={{ height: "100px", backgroundColor: `${color}20` }}
        >
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${pct}%` }}
            transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 w-full rounded-t-xl"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
      <span
        className="text-[10px] font-black uppercase tracking-wider"
        style={{ color: "var(--text-secondary)" }}
      >
        {label}
      </span>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  unit,
  iconBg,
  delay,
}: {
  icon: string;
  label: string;
  value: number;
  unit: string;
  iconBg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex-1 rounded-2xl p-4 md:p-5 flex flex-col gap-3"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
        style={{ backgroundColor: iconBg }}
      >
        {icon}
      </div>
      <div>
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </p>
        <p
          className="font-black leading-none"
          style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            color: "var(--text-primary)",
          }}
        >
          <AnimatedNumber value={value} />
          <span
            className="text-sm font-semibold ml-1.5"
            style={{ color: "var(--text-secondary)" }}
          >
            {unit}
          </span>
        </p>
      </div>
    </motion.div>
  );
}

// ─── Progress Dots ────────────────────────────────────────────────────────────
function ProgressDots({
  total,
  current,
  onChange,
}: {
  total: number;
  current: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          className="transition-all duration-300 rounded-full"
          style={{
            width: i === current ? 20 : 8,
            height: 8,
            backgroundColor:
              i < current
                ? "var(--primary)"
                : i === current
                  ? "var(--primary)"
                  : "var(--border-color)",
            opacity: i < current ? 0.4 : 1,
          }}
        />
      ))}
    </div>
  );
}

// ─── Rest Timer Modal ─────────────────────────────────────────────────────────
function RestTimerModal({ onDone }: { onDone: () => void }) {
  const [seconds, setSeconds] = useState(60);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running || seconds === 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [running, seconds]);

  const pct = ((60 - seconds) / 60) * 100;
  const r = 52;
  const circ = 2 * Math.PI * r;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onDone()}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="rounded-3xl p-8 w-full max-w-xs text-center"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-5"
          style={{ color: "var(--text-secondary)" }}
        >
          Rest Timer
        </p>

        {/* Circle */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="8"
            />
            <motion.circle
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ - (circ * pct) / 100 }}
              transition={{ duration: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="font-black text-3xl"
              style={{
                color: seconds === 0 ? "var(--primary)" : "var(--text-primary)",
              }}
            >
              {seconds === 0 ? "GO!" : seconds}
            </span>
          </div>
        </div>

        <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
          {seconds === 0
            ? "Rest complete. Ready to go!"
            : "Take a breath. You earned it."}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            {running ? "Pause" : "Resume"}
          </button>
          <button
            onClick={onDone}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: "var(--primary)" }}
          >
            Skip Rest
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function WorkoutCompletePage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [allDone, setAllDone] = useState(false);

  const exercise = EXERCISES[currentIndex];
  const isLast = currentIndex === EXERCISES.length - 1;

  const zoneMax = Math.max(
    exercise.zones.warmup,
    exercise.zones.fatBurn,
    exercise.zones.cardio,
    exercise.zones.peak,
  );

  const handleNext = () => {
    if (isLast) {
      setAllDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  };

  const handleRest = () => setShowRest(true);

  if (allDone) {
    return (
      <div className="min-h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div
            className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-4xl mb-6"
            style={{ background: "var(--primary)20" }}
          >
            🏆
          </div>
          <h1
            className="font-black text-4xl tracking-tight mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Workout Complete!
          </h1>
          <p
            className="text-base mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            You crushed all{" "}
            <span style={{ color: "var(--primary)", fontWeight: 700 }}>
              {EXERCISES.length} exercises
            </span>{" "}
            today.
          </p>

          {/* Summary stats */}
          <div
            className="rounded-2xl p-5 mt-6 mb-8 grid grid-cols-3 gap-4"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {[
              {
                label: "Total Volume",
                val: EXERCISES.reduce(
                  (s, e) => s + e.totalVolume,
                  0,
                ).toLocaleString(),
                unit: "kg",
              },
              {
                label: "Calories",
                val: EXERCISES.reduce((s, e) => s + e.calories, 0),
                unit: "kcal",
              },
              {
                label: "Avg HR",
                val: Math.round(
                  EXERCISES.reduce((s, e) => s + e.avgHeartRate, 0) /
                    EXERCISES.length,
                ),
                unit: "bpm",
              },
            ].map((s) => (
              <div key={s.label}>
                <p
                  className="font-black text-xl"
                  style={{ color: "var(--primary)" }}
                >
                  {s.val}
                  <span
                    className="text-xs font-semibold ml-0.5"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {s.unit}
                  </span>
                </p>
                <p
                  className="text-[10px] uppercase tracking-wider"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="w-full py-4 rounded-2xl font-black text-base text-white"
            style={{
              background: "var(--primary)",
              boxShadow: "0 8px 24px var(--primary)40",
            }}
          >
            Back to Dashboard →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-5xl px-6 my-10 mx-auto flex flex-col gap-4 pb-6"
        >
          {/* ── Well Done Card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl p-7 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Check icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                delay: 0.15,
                type: "spring",
                stiffness: 260,
                damping: 20,
              }}
              className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: "var(--primary)18" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <motion.path
                  d="M7 16.5L13 22.5L25 10"
                  stroke="var(--primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                />
              </svg>
            </motion.div>

            <h1
              className="font-black tracking-tight mb-2"
              style={{
                fontSize: "clamp(26px, 5vw, 36px)",
                color: "var(--text-primary)",
              }}
            >
              Well Done!
            </h1>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              You've completed all sets for{" "}
              <span style={{ color: "var(--primary)", fontWeight: 700 }}>
                {exercise.name}.
              </span>
            </p>
          </motion.div>

          {/* ── Stat Cards ── */}
          <div className="flex gap-3">
            <StatCard
              icon="🏋️"
              label="Total Volume"
              value={exercise.totalVolume}
              unit="kg"
              iconBg="#dbeeff"
              delay={0.1}
            />
            <StatCard
              icon="❤️"
              label="Avg Heart Rate"
              value={exercise.avgHeartRate}
              unit="bpm"
              iconBg="#ffe4e4"
              delay={0.18}
            />
            <StatCard
              icon="🔥"
              label="Calories"
              value={exercise.calories}
              unit="kcal"
              iconBg="#fff3e0"
              delay={0.26}
            />
          </div>

          {/* ── Intensity Breakdown ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-3xl p-5"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div className="flex items-start justify-between mb-1">
              <div>
                <h3
                  className="font-black text-base"
                  style={{ color: "var(--text-primary)" }}
                >
                  Intensity Breakdown
                </h3>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Peak reached: {exercise.peakHeartRate} bpm
                </p>
              </div>

              {/* vs last week badge */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black"
                style={{
                  background: exercise.vsLastWeek >= 0 ? "#dcfce7" : "#fee2e2",
                  color: exercise.vsLastWeek >= 0 ? "#16a34a" : "#dc2626",
                }}
              >
                <span>{exercise.vsLastWeek >= 0 ? "↗" : "↘"}</span>
                {exercise.vsLastWeek >= 0 ? "+" : ""}
                {exercise.vsLastWeek}% vs LAST WEEK
              </motion.div>
            </div>

            {/* Bars */}
            <div
              className="flex gap-3 items-end mt-5 px-2"
              style={{ height: "120px" }}
            >
              {[
                {
                  label: "WARMUP",
                  value: exercise.zones.warmup,
                  color: "#ffd0b0",
                },
                {
                  label: "FAT BURN",
                  value: exercise.zones.fatBurn,
                  color: "#ffb07a",
                },
                {
                  label: "CARDIO",
                  value: exercise.zones.cardio,
                  color: "#f47920",
                },
                { label: "PEAK", value: exercise.zones.peak, color: "#c45d10" },
              ].map((zone, i) => (
                <IntensityBar
                  key={zone.label}
                  label={zone.label}
                  value={zone.value}
                  max={zoneMax}
                  color={zone.color}
                  delay={0.4 + i * 0.08}
                />
              ))}
            </div>
          </motion.div>

          {/* ── Action Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="flex gap-3"
          >
            <button
              onClick={handleRest}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <span>⏱</span> Take a Rest
            </button>

            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex-[1.6] flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white transition-all"
              style={{
                background: "var(--primary)",
                boxShadow: "0 6px 24px var(--primary)35",
              }}
            >
              {isLast ? <>🏆 Finish Workout</> : <>→ Next Exercise</>}
            </motion.button>
          </motion.div>

          {/* ── Progress Dots ── */}
          <div className="flex items-center justify-center gap-4 pt-1">
            <ProgressDots
              total={EXERCISES.length}
              current={currentIndex}
              onChange={setCurrentIndex}
            />
            <p
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              {currentIndex + 1} of {EXERCISES.length} Exercises
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Rest Timer Modal ── */}
      <AnimatePresence>
        {showRest && <RestTimerModal onDone={() => setShowRest(false)} />}
      </AnimatePresence>
    </>
  );
}
