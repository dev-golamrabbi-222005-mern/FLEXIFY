// app/dashboard/workouts/[id]/page.tsx
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Play,
  Pause,
  SkipForward,
  Edit3,
  CheckCircle2,
  Loader2,
  RotateCcw,
  Zap,
  Target,
  Clock,
  Flame,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Exercise {
  _id?: string;
  id: string;
  name: string;
  force: string | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

type PageState = "detail" | "session" | "complete";
type Tab = "Instructions" | "Muscles" | "Equipment" | "History";

// ─── Static mock history (replace with real API call if needed) ───────────────
const MOCK_HISTORY = [
  {
    date: "Mar 6, 2026",
    sets: [
      { reps: 10, weight: 65 },
      { reps: 10, weight: 65 },
      { reps: 8, weight: 65 },
    ],
    notes: "Felt strong.",
  },
  {
    date: "Feb 27, 2026",
    sets: [
      { reps: 10, weight: 60 },
      { reps: 10, weight: 60 },
      { reps: 9, weight: 60 },
    ],
  },
  {
    date: "Feb 20, 2026",
    sets: [
      { reps: 8, weight: 55 },
      { reps: 8, weight: 55 },
      { reps: 8, weight: 55 },
    ],
    notes: "Warm-up felt off.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LEVEL_STYLE = {
  beginner: { bg: "#dcfce7", text: "#16a34a" },
  intermediate: { bg: "#fff3e0", text: "#f47920" },
  expert: { bg: "#fee2e2", text: "#dc2626" },
};

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ─── Animated counter ─────────────────────────────────────────────────────────
function AnimNum({ to, duration = 900 }: { to: number; duration?: number }) {
  const [val, setVal] = useState(0);
  const t0 = useRef<number | null>(null);
  useEffect(() => {
    setVal(0);
    t0.current = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!t0.current) t0.current = ts;
      const p = Math.min((ts - t0.current) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <>{val.toLocaleString()}</>;
}

// ─── Video Placeholder Slide ─────────────────────────────────────────────────
function VideoSlide({ name }: { name: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 0;
        }
        return p + 0.4;
      });
    }, 100);
    return () => clearInterval(t);
  }, [playing]);

  const totalSecs = 135;
  const elapsed = Math.round((progress / 100) * totalSecs);
  const fmtT = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    setProgress(
      Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
    );
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-br from-[#0f1117] to-[#1a1d26] flex flex-col items-center justify-center group cursor-pointer"
      onClick={() => setPlaying((p) => !p)}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
        }}
      />

      {/* Pulsing rings when playing */}
      <div className="relative mb-5">
        {playing &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                borderColor: "var(--primary)",
                borderWidth: 1,
                borderStyle: "solid",
              }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2 + i * 0.5, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: "rgba(244,121,32,0.15)",
            border: "2px solid rgba(244,121,32,0.3)",
          }}
        >
          <span className="text-4xl">🏋️</span>
        </div>
      </div>

      <p className="text-white/80 text-sm font-black tracking-wider mb-1 text-center px-6 truncate max-w-xs">
        {name}
      </p>
      <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-5">
        Exercise Demonstration
      </p>

      {/* Play / pause button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setPlaying((p) => !p);
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
        style={{
          background: "var(--primary)",
          boxShadow:
            "0 0 0 8px rgba(244,121,32,0.15), 0 8px 32px rgba(244,121,32,0.5)",
        }}
      >
        <span className="text-white text-2xl leading-none">
          {playing ? "⏸" : "▶"}
        </span>
      </motion.button>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
        <div
          ref={barRef}
          className="w-full h-1.5 rounded-full cursor-pointer mb-2 relative group/bar"
          style={{ background: "rgba(255,255,255,0.12)" }}
          onClick={(e) => {
            e.stopPropagation();
            handleBarClick(e);
          }}
        >
          <div
            className="h-full rounded-full relative"
            style={{ width: `${progress}%`, background: "var(--primary)" }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full -mr-1.5 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/45 text-[10px] font-mono">
            {fmtT(elapsed)}
          </span>
          <div
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Video Preview
          </div>
          <span className="text-white/30 text-[10px] font-mono">
            {fmtT(totalSecs)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Image + Video Viewer ─────────────────────────────────────────────────────
function ExerciseImageViewer({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const total = (images.length || 0) + 1; // +1 for the video slide
  const [idx, setIdx] = useState(0);
  const isVideo = idx === total - 1;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#111]">
      <AnimatePresence mode="wait">
        {!isVideo ? (
          <motion.div
            key={`img-${idx}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {images.length > 0 ? (
              <img
                src={`/exercises/${images[idx]}`}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0";
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e2028] to-[#2a2d35]">
                <div className="w-20 h-20 rounded-full border-2 border-[var(--primary)]/30 flex items-center justify-center mb-3">
                  <span className="text-4xl">🏋️</span>
                </div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  Exercise Preview
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="video"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoSlide name={name} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prev */}
      {idx > 0 && (
        <button
          onClick={() => setIdx((i) => i - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm z-10"
        >
          ‹
        </button>
      )}
      {/* Next */}
      {idx < total - 1 && (
        <button
          onClick={() => setIdx((i) => i + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm z-10"
        >
          ›
        </button>
      )}

      {/* Dots — last one is the video indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === idx ? 20 : 6,
              height: 6,
              background:
                i === idx
                  ? "var(--primary)"
                  : i === total - 1
                    ? "rgba(255,165,0,0.5)"
                    : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function InstructionsTab({
  instructions,
  primaryMuscles,
  secondaryMuscles,
  equipment,
}: {
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string | null;
}) {
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (i: number) =>
    setChecked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
      {/* Steps */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-bold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            How to perform
          </h3>
          <span
            className="text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {checked.length}/{instructions.length} reviewed
          </span>
        </div>
        <div className="space-y-2.5">
          {instructions.map((step, i) => (
            <div
              key={i}
              onClick={() => toggle(i)}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border
                ${
                  checked.includes(i)
                    ? "border-[var(--primary)]/20 bg-[var(--primary)]/5"
                    : "border-transparent hover:bg-[var(--bg-primary)]"
                }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all
                ${checked.includes(i) ? "bg-[var(--primary)] text-white" : "border border-[var(--border-color)] text-[var(--text-secondary)]"}`}
                style={{
                  background: checked.includes(i)
                    ? "var(--primary)"
                    : "var(--bg-primary)",
                }}
              >
                {checked.includes(i) ? "✓" : i + 1}
              </div>
              <p
                className={`text-sm leading-relaxed ${checked.includes(i) ? "line-through opacity-50" : ""}`}
                style={{ color: "var(--text-primary)" }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Side info */}
      <div className="flex flex-col gap-3">
        {/* Muscles mini */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-wider mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            🎯 Muscles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {primaryMuscles.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold capitalize"
                style={{
                  background: "var(--primary)15",
                  color: "var(--primary)",
                }}
              >
                {m}
              </span>
            ))}
            {secondaryMuscles.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold capitalize"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Equipment mini */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-wider mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            🔧 Equipment
          </p>
          {equipment ? (
            <p
              className="text-sm font-semibold capitalize"
              style={{ color: "var(--text-primary)" }}
            >
              {equipment}
            </p>
          ) : (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Bodyweight
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MusclesTab({
  primaryMuscles,
  secondaryMuscles,
}: {
  primaryMuscles: string[];
  secondaryMuscles: string[];
}) {
  const all = [
    ...primaryMuscles.map((m) => ({ name: m, role: "Primary" })),
    ...secondaryMuscles.map((m) => ({ name: m, role: "Secondary" })),
  ];

  const style = {
    Primary: {
      bg: "var(--primary)12",
      color: "var(--primary)",
      border: "var(--primary)25",
      icon: "🔴",
    },
    Secondary: {
      bg: "#f0a50012",
      color: "#f0a500",
      border: "#f0a50030",
      icon: "🟡",
    },
  } as Record<
    string,
    { bg: string; color: string; border: string; icon: string }
  >;

  return (
    <div className="space-y-4">
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h3
          className="font-bold text-sm mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Muscles Activated
        </h3>
        {all.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No muscle data available.
          </p>
        ) : (
          <div className="space-y-2">
            {all.map((m, i) => {
              const s = style[m.role] ?? style.Secondary;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.icon}</span>
                    <span
                      className="text-sm font-semibold capitalize"
                      style={{ color: s.color }}
                    >
                      {m.name}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {m.role}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activation bars */}
      {all.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <h3
            className="font-bold text-sm mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Activation %
          </h3>
          <div className="space-y-3">
            {all.slice(0, 5).map((m, i) => {
              const pct = m.role === "Primary" ? 70 - i * 8 : 40 - i * 5;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold w-28 shrink-0 capitalize"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {m.name}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full"
                    style={{ background: "var(--border-color)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        delay: 0.1 + i * 0.07,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        background:
                          m.role === "Primary" ? "var(--primary)" : "#f0a500",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-black w-8 text-right"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const EQUIPMENT_META: Record<string, { icon: string; desc: string }> = {
  barbell: { icon: "🏗️", desc: "Olympic or standard barbell" },
  dumbbell: { icon: "🏋️", desc: "Pair of dumbbells" },
  kettlebells: { icon: "🔔", desc: "One or two kettlebells" },
  machine: { icon: "⚙️", desc: "Gym machine / cable station" },
  "body only": { icon: "🤸", desc: "No equipment required" },
  bands: { icon: "🎗️", desc: "Resistance bands" },
  "e-z curl bar": { icon: "〰️", desc: "Angled curl bar" },
  cable: { icon: "🔗", desc: "Cable pulley machine" },
  "foam roll": { icon: "🔵", desc: "Foam roller" },
  "exercise ball": { icon: "⚽", desc: "Stability / Swiss ball" },
};

const RELATED_EQUIPMENT: Record<string, string[]> = {
  barbell: [
    "Power rack or squat stand",
    "Weight plates (bumper / iron)",
    "Barbell collars",
    "Lifting belt (optional)",
    "Chalk (optional)",
  ],
  dumbbell: [
    "Adjustable bench (optional)",
    "Dumbbell rack",
    "Wrist straps (optional)",
  ],
  kettlebells: ["Chalk or grip gloves (optional)"],
  machine: ["Seat / pad adjustment pin", "Weight selector pin"],
  "body only": ["Yoga mat (optional)", "Pull-up bar (optional)"],
};

function EquipmentTab({ equipment }: { equipment: string | null }) {
  const [checked, setChecked] = useState<string[]>([]);
  const key = equipment?.toLowerCase().trim() ?? "body only";
  const meta = EQUIPMENT_META[key] ?? {
    icon: "🏋️",
    desc: "Standard gym equipment",
  };
  const related = RELATED_EQUIPMENT[key] ?? [];
  const isBodyweight = !equipment || key === "body only";

  const toggle = (item: string) =>
    setChecked((p) =>
      p.includes(item) ? p.filter((x) => x !== item) : [...p, item],
    );

  return (
    <div className="space-y-4">
      {/* Primary equipment card */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Primary Equipment
        </p>

        {isBodyweight ? (
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "#dcfce7", border: "1px solid #bbf7d0" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/60">
              🤸
            </div>
            <div>
              <p className="font-black text-base" style={{ color: "#15803d" }}>
                Bodyweight Only
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#16a34a" }}>
                No equipment required
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: "rgba(244,121,32,0.06)",
              border: "1px solid rgba(244,121,32,0.2)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(244,121,32,0.12)" }}
            >
              {meta.icon}
            </div>
            <div>
              <p
                className="font-black text-base capitalize"
                style={{ color: "var(--text-primary)" }}
              >
                {equipment}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {meta.desc}
              </p>
            </div>
            <div
              className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{
                background: "rgba(244,121,32,0.1)",
                color: "var(--primary)",
              }}
            >
              Required
            </div>
          </div>
        )}
      </div>

      {/* Checklist */}
      {related.length > 0 && (
        <div
          className="rounded-2xl p-5"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <p
              className="text-[11px] font-black uppercase tracking-widest"
              style={{ color: "var(--text-secondary)" }}
            >
              What You Need
            </p>
            <p
              className="text-[11px] font-bold"
              style={{ color: "var(--primary)" }}
            >
              {checked.length}/{related.length} ready
            </p>
          </div>
          <div className="space-y-2.5">
            {related.map((item, i) => {
              const isOpt = item.toLowerCase().includes("optional");
              const done = checked.includes(item);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => toggle(item)}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
                  style={{
                    background: done
                      ? "rgba(244,121,32,0.06)"
                      : "var(--bg-primary)",
                    border: `1px solid ${done ? "rgba(244,121,32,0.2)" : "var(--border-color)"}`,
                  }}
                >
                  {/* Checkbox */}
                  <div
                    className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                    style={{
                      background: done ? "var(--primary)" : "transparent",
                      border: `2px solid ${done ? "var(--primary)" : "var(--border-color)"}`,
                    }}
                  >
                    {done && (
                      <span className="text-white text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </div>
                  {/* Bullet line */}
                  <div className="flex items-center gap-2 flex-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{
                        background: done
                          ? "var(--primary)"
                          : isOpt
                            ? "var(--border-color)"
                            : "var(--text-secondary)",
                      }}
                    />
                    <span
                      className={`text-sm font-semibold ${done ? "line-through opacity-50" : ""}`}
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item}
                    </span>
                  </div>
                  {isOpt && !done && (
                    <span
                      className="text-[9px] font-black uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded"
                      style={{
                        background: "var(--border-color)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      OPT
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Readiness banner */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl"
        style={{
          background:
            checked.length === related.length && related.length > 0
              ? "#dcfce7"
              : "var(--bg-secondary)",
          border: `1px solid ${checked.length === related.length && related.length > 0 ? "#bbf7d0" : "var(--border-color)"}`,
        }}
      >
        <CheckCircle2
          size={18}
          style={{
            color:
              checked.length === related.length && related.length > 0
                ? "#16a34a"
                : "var(--border-color)",
            shrink: 0,
          }}
        />
        <p
          className="text-sm font-semibold"
          style={{
            color:
              checked.length === related.length && related.length > 0
                ? "#16a34a"
                : "var(--text-secondary)",
          }}
        >
          {checked.length === related.length && related.length > 0
            ? "All set! You're fully equipped and ready to train."
            : "Check off each item as you gather your equipment."}
        </p>
      </div>
    </div>
  );
}

function HistoryTab() {
  const [open, setOpen] = useState<number>(0);
  const vol = (e: (typeof MOCK_HISTORY)[0]) =>
    e.sets.reduce((s, x) => s + x.reps * x.weight, 0);
  const best = Math.max(
    ...MOCK_HISTORY.flatMap((h) => h.sets.map((s) => s.weight)),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sessions", val: MOCK_HISTORY.length, unit: "" },
          { label: "Best Weight", val: best, unit: " kg" },
          {
            label: "Avg Volume",
            val: Math.round(
              MOCK_HISTORY.reduce((s, h) => s + vol(h), 0) /
                MOCK_HISTORY.length,
            ),
            unit: " kg",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="font-black text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              {s.val}
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {s.unit}
              </span>
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Volume chart */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <h3
          className="font-bold text-sm mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Volume Progress
        </h3>
        <div className="flex items-end gap-3" style={{ height: 80 }}>
          {[...MOCK_HISTORY].reverse().map((h, i) => {
            const pct = (vol(h) / Math.max(...MOCK_HISTORY.map(vol))) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: 68 }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${pct}%` }}
                    transition={{
                      delay: i * 0.1,
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="absolute bottom-0 w-full rounded-t-lg"
                    style={{
                      background: "var(--primary)",
                      opacity: 0.5 + i * 0.18,
                    }}
                  />
                </div>
                <p
                  className="text-[9px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {h.date.split(",")[0]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Session logs */}
      <div className="space-y-2">
        {MOCK_HISTORY.map((h, i) => (
          <div
            key={i}
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)]/40 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {h.date}
                </span>
                {i === 0 && (
                  <span
                    className="text-[10px] font-black px-2 py-0.5 rounded-lg"
                    style={{
                      background: "var(--primary)15",
                      color: "var(--primary)",
                    }}
                  >
                    LATEST
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {h.sets.length} sets · {vol(h).toLocaleString()} kg
                </span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  className="text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  ▾
                </motion.span>
              </div>
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div
                    className="px-4 pb-4 pt-2 border-t"
                    style={{ borderColor: "var(--border-color)" }}
                  >
                    <div
                      className="grid grid-cols-4 text-[10px] font-black uppercase tracking-wider mb-2 px-2"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <span>Set</span>
                      <span>Reps</span>
                      <span>Weight</span>
                      <span>Vol</span>
                    </div>
                    {h.sets.map((s, j) => (
                      <div
                        key={j}
                        className="grid grid-cols-4 px-2 py-2 rounded-lg mb-1 text-sm"
                        style={{ background: "var(--bg-primary)" }}
                      >
                        <span
                          className="font-bold"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {j + 1}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {s.reps}
                        </span>
                        <span
                          className="font-semibold"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {s.weight}kg
                        </span>
                        <span
                          className="font-bold"
                          style={{ color: "var(--primary)" }}
                        >
                          {s.reps * s.weight}
                        </span>
                      </div>
                    ))}
                    {h.notes && (
                      <p
                        className="mt-2 text-xs italic px-2 py-2 rounded-lg"
                        style={{
                          background: "var(--bg-primary)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        📝 {h.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Edit Goal Sheet ──────────────────────────────────────────────────────────
function EditGoalSheet({
  sets,
  reps,
  weight,
  onSave,
  onClose,
}: {
  sets: number;
  reps: number;
  weight: number;
  onSave: (s: number, r: number, w: number) => void;
  onClose: () => void;
}) {
  const [ls, setLs] = useState(sets);
  const [lr, setLr] = useState(reps);
  const [lw, setLw] = useState(weight);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="w-full max-w-sm rounded-3xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--border-color)" }}
        >
          <h2
            className="font-black text-base"
            style={{ color: "var(--text-primary)" }}
          >
            Set Your Goal
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-primary)] transition-colors text-xl"
            style={{ color: "var(--text-secondary)" }}
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            { label: "Sets", icon: "🔁", val: ls, set: setLs, min: 1, max: 10 },
            { label: "Reps", icon: "⚡", val: lr, set: setLr, min: 1, max: 50 },
            {
              label: "Weight (kg)",
              icon: "🏋️",
              val: lw,
              set: setLw,
              min: 0,
              max: 500,
            },
          ].map((f) => (
            <div key={f.label}>
              <label
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>{f.icon}</span> {f.label}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    f.set(
                      Math.max(
                        f.min,
                        f.val - (f.label.includes("Weight") ? 5 : 1),
                      ),
                    )
                  }
                  className="w-10 h-10 rounded-xl border font-black text-lg flex items-center justify-center hover:bg-[var(--bg-primary)] transition-colors"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  −
                </button>
                <div
                  className="flex-1 text-center font-black text-2xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {f.val}
                </div>
                <button
                  onClick={() =>
                    f.set(
                      Math.min(
                        f.max,
                        f.val + (f.label.includes("Weight") ? 5 : 1),
                      ),
                    )
                  }
                  className="w-10 h-10 rounded-xl border font-black text-lg flex items-center justify-center hover:bg-[var(--bg-primary)] transition-colors"
                  style={{
                    borderColor: "var(--border-color)",
                    color: "var(--primary)",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="px-5 pb-5 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-semibold transition-colors"
            style={{
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(ls, lr, lw);
              onClose();
            }}
            className="flex-1 py-3 rounded-2xl text-sm font-black text-white transition-all hover:brightness-110"
            style={{ background: "var(--primary)" }}
          >
            Save Goal
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Rest Timer ───────────────────────────────────────────────────────────────
function RestOverlay({
  onSkip,
  nextSetNum,
  totalSets,
}: {
  onSkip: () => void;
  nextSetNum: number;
  totalSets: number;
}) {
  const [secs, setSecs] = useState(60);
  const r = 48,
    circ = 2 * Math.PI * r;

  useEffect(() => {
    if (secs <= 0) {
      onSkip();
      return;
    }
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="rounded-3xl p-8 w-full max-w-xs text-center"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Rest Time
        </p>
        <p
          className="text-sm mb-5 font-semibold"
          style={{ color: "var(--primary)" }}
        >
          Set {nextSetNum - 1} complete · Up next: Set {nextSetNum} of{" "}
          {totalSets}
        </p>

        {/* Ring */}
        <div className="relative w-28 h-28 mx-auto mb-5">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 112 112">
            <circle
              cx="56"
              cy="56"
              r={r}
              fill="none"
              stroke="var(--border-color)"
              strokeWidth="7"
            />
            <motion.circle
              cx="56"
              cy="56"
              r={r}
              fill="none"
              stroke="var(--primary)"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circ}
              animate={{ strokeDashoffset: circ * (secs / 60) }}
              transition={{ duration: 0.8 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="font-black text-3xl"
              style={{
                color: secs === 0 ? "var(--primary)" : "var(--text-primary)",
              }}
            >
              {secs === 0 ? "GO!" : secs}
            </span>
            {secs > 0 && (
              <span
                className="text-[10px] font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                sec
              </span>
            )}
          </div>
        </div>

        <p className="text-xs mb-5" style={{ color: "var(--text-secondary)" }}>
          {secs === 0 ? "Time's up — ready to go!" : "Rest up. You earned it."}
        </p>

        <button
          onClick={onSkip}
          className="w-full py-3 rounded-2xl font-black text-sm text-white hover:brightness-110 transition-all"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 20px var(--primary)40",
          }}
        >
          Skip Rest → Start Set {nextSetNum}
        </button>
      </motion.div>
    </motion.div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── DETAIL STATE ─────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function DetailView({
  ex,
  targetSets,
  targetReps,
  targetWeight,
  onEditGoal,
  onStart,
}: {
  ex: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  onEditGoal: () => void;
  onStart: () => void;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("Instructions");
  const tabs: Tab[] = ["Instructions", "Muscles", "Equipment", "History"];
  const lc = LEVEL_STYLE[ex.level] ?? { bg: "#f1f5f9", text: "#64748b" };

  return (
    <div className="max-w-7xl mx-auto px-6 my-10">
      {/* Breadcrumb */}
      <nav
        className="flex items-center gap-1.5 text-xs mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        <button
          onClick={() => router.push("/dashboard/exercise")}
          className="flex items-center gap-1 hover:text-[var(--primary)] transition-colors"
        >
          <ChevronLeft size={14} /> Exercises
        </button>
        <span className="opacity-40">›</span>
        <span
          className="font-semibold truncate max-w-[180px]"
          style={{ color: "var(--text-primary)" }}
        >
          {ex.name}
        </span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h1
            className="font-black tracking-tight leading-tight mb-2"
            style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              color: "var(--text-primary)",
            }}
          >
            {ex.name}
          </h1>
          <div className="flex gap-2 flex-wrap">
            {ex.category && (
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                style={{
                  background: "var(--primary)15",
                  color: "var(--primary)",
                }}
              >
                {ex.category}
              </span>
            )}
            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
              style={{ background: lc.bg, color: lc.text }}
            >
              {ex.level}
            </span>
            {ex.mechanic && (
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {ex.mechanic}
              </span>
            )}
          </div>
        </div>

        {/* Goal pill */}
        <button
          onClick={onEditGoal}
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:brightness-95"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Target size={14} style={{ color: "var(--primary)" }} />
          <span
            className="text-sm font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {targetSets}×{targetReps}
          </span>
          <Edit3 size={12} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>

      {/* Image + Stats — 12-col grid */}
      <div className="grid grid-cols-12 gap-5 mb-5 items-stretch">
        {/* Image — 9 cols */}
        <div className="col-span-9">
          <ExerciseImageViewer images={ex.images} name={ex.name} />
        </div>

        {/* Quick stats — 3 cols */}
        <div className="col-span-3 flex flex-col gap-3 h-full">
          {[
            { icon: Target, label: "Sets", val: targetSets, unit: "" },
            { icon: Zap, label: "Reps", val: targetReps, unit: " / set" },
            { icon: Flame, label: "Weight", val: targetWeight, unit: " kg" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl p-3 text-center flex flex-col items-center justify-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <s.icon
                size={20}
                className="mx-auto mb-1"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-black text-xl leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {s.val}
                <span
                  className="text-xl font-medium"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.unit}
                </span>
              </p>
              <p
                className="text-[15px] mt-0.5 font-bold uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div
        className="flex border-b mb-5 overflow-x-auto"
        style={{ borderColor: "var(--border-color)" }}
      >
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all
              ${
                activeTab === tab
                  ? "border-[var(--primary)] font-black"
                  : "border-transparent hover:text-[var(--text-primary)]"
              }`}
            style={{
              color:
                activeTab === tab ? "var(--primary)" : "var(--text-secondary)",
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === "Instructions" && (
            <InstructionsTab
              instructions={ex.instructions}
              primaryMuscles={ex.primaryMuscles}
              secondaryMuscles={ex.secondaryMuscles}
              equipment={ex.equipment}
            />
          )}
          {activeTab === "Muscles" && (
            <MusclesTab
              primaryMuscles={ex.primaryMuscles}
              secondaryMuscles={ex.secondaryMuscles}
            />
          )}
          {activeTab === "Equipment" && (
            <EquipmentTab equipment={ex.equipment} />
          )}
          {activeTab === "History" && <HistoryTab />}
        </motion.div>
      </AnimatePresence>

      {/* Sticky bottom — highlighted */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: "var(--bg-primary)",
          borderTop: "2px solid var(--primary)",
          backdropFilter: "blur(16px)",
          boxShadow: "0 -8px 32px rgba(244,121,32,0.12)",
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--primary)" }}
              />
              <p
                className="text-[11px] font-black uppercase tracking-wider"
                style={{ color: "var(--primary)" }}
              >
                Ready to train
              </p>
            </div>
            <p
              className="text-base font-black leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {targetSets} sets · {targetReps} reps · {targetWeight} kg
            </p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={onEditGoal}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-bold transition-all hover:brightness-95"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-primary)",
              }}
            >
              <Edit3 size={13} /> Edit
            </button>
            <motion.button
              onClick={onStart}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 6px 28px rgba(244,121,32,0.55)",
              }}
              whileTap={{ scale: 0.96 }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl cursor-pointer text-sm font-black text-white"
              style={{
                background: "var(--primary)",
                boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
              }}
            >
              <Play size={15} fill="white" /> Start Workout
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── SESSION STATE ────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function SessionView({
  ex,
  targetSets,
  targetReps,
  targetWeight,
  onComplete,
  onQuit,
}: {
  ex: Exercise;
  targetSets: number;
  targetReps: number;
  targetWeight: number;
  onComplete: (duration: number, setsActual: number) => void;
  onQuit: () => void;
}) {
  const [setsCompleted, setSetsCompleted] = useState(0);
  const [totalSecs, setTotalSecs] = useState(0);
  const [running, setRunning] = useState(true);
  const [resting, setResting] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);

  useEffect(() => {
    if (!running || resting) return;
    const t = setInterval(() => setTotalSecs((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [running, resting]);

  const finishSet = () => {
    const next = setsCompleted + 1;
    setSetsCompleted(next);
    if (next >= targetSets) {
      onComplete(totalSecs, next);
    } else {
      setResting(true);
    }
  };

  const progress = setsCompleted / targetSets;
  const currentSet = setsCompleted + 1;

  return (
    <div className="max-w-lg mx-auto pb-28 space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setQuitConfirm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[var(--primary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={16} /> Quit
        </button>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Clock size={13} style={{ color: "var(--primary)" }} />
          <span
            className="font-black text-sm tabular-nums"
            style={{ color: "var(--text-primary)" }}
          >
            {fmt(totalSecs)}
          </span>
        </div>
      </div>

      {/* Exercise name + set indicator */}
      <div>
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-0.5"
          style={{ color: "var(--primary)" }}
        >
          Currently Active
        </p>
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(20px, 4vw, 28px)",
            color: "var(--text-primary)",
          }}
        >
          {ex.name}
        </h1>

        {/* Set dots */}
        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: targetSets }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i + 1 === currentSet ? 1.3 : 1,
                backgroundColor:
                  i < setsCompleted
                    ? "var(--primary)"
                    : i + 1 === currentSet
                      ? "var(--primary)"
                      : "var(--border-color)",
                opacity: i < setsCompleted ? 0.5 : 1,
              }}
              className="w-2.5 h-2.5 rounded-full transition-all"
            />
          ))}
          <span
            className="text-xs font-bold ml-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Set {Math.min(currentSet, targetSets)} of {targetSets}
          </span>
        </div>
      </div>

      {/* Big timer */}
      <div
        className="rounded-3xl p-6 text-center relative overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span
            className="font-black"
            style={{ fontSize: 120, color: "var(--primary)", lineHeight: 1 }}
          >
            {String(setsCompleted + 1)}
          </span>
        </div>
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Elapsed Time
        </p>
        <div className="relative z-10 flex items-baseline justify-center gap-3">
          <div className="text-center">
            <p
              className="font-black tabular-nums"
              style={{
                fontSize: 52,
                lineHeight: 1,
                color: "var(--text-primary)",
              }}
            >
              {String(Math.floor(totalSecs / 60)).padStart(2, "0")}
            </p>
            <p
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              min
            </p>
          </div>
          <span
            className="font-black text-3xl pb-4"
            style={{ color: "var(--border-color)" }}
          >
            :
          </span>
          <div className="text-center">
            <p
              className="font-black tabular-nums"
              style={{ fontSize: 52, lineHeight: 1, color: "var(--primary)" }}
            >
              {String(totalSecs % 60).padStart(2, "0")}
            </p>
            <p
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              sec
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sets Done", val: setsCompleted, icon: "✅" },
          { label: "Target Reps", val: targetReps, icon: "⚡" },
          {
            label: "Weight",
            val: `${targetWeight}kg`,
            icon: "🏋️",
            isStr: true,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <span className="text-xl block mb-1">{s.icon}</span>
            <p
              className="font-black text-xl leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {s.isStr ? s.val : s.val}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Set Progress
          </p>
          <p className="text-sm font-black" style={{ color: "var(--primary)" }}>
            {Math.round(progress * 100)}%
          </p>
        </div>
        <div
          className="h-3 w-full rounded-full"
          style={{ background: "var(--border-color)" }}
        >
          <motion.div
            className="h-3 rounded-full"
            style={{ background: "var(--primary)" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
        <div
          className="flex justify-between text-[11px] mt-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>{targetSets - setsCompleted} sets remaining</span>
          <span>{targetSets} total goal</span>
        </div>
      </div>

      {/* AI Tips */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#0f172a", border: "1px solid #1e293b" }}
      >
        <p className="font-bold text-sm text-white mb-3 flex items-center gap-2">
          <Zap size={14} style={{ color: "#f47920" }} /> AI Form Coach
        </p>
        <ul className="space-y-2">
          <li className="text-sm flex items-start gap-2 text-white/75">
            <span className="shrink-0 mt-0.5 text-emerald-400">✔</span>
            Keep your chest up and core engaged throughout the movement.
          </li>
          <li className="text-sm flex items-start gap-2 text-white/75">
            <span className="shrink-0 mt-0.5 text-amber-400">⚠</span>
            Drive through your full foot — don't rise on your toes.
          </li>
        </ul>
      </div>

      {/* Sticky bottom */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-3"
        style={{
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            {running ? (
              <>
                <Pause size={16} /> Pause
              </>
            ) : (
              <>
                <Play size={16} /> Resume
              </>
            )}
          </button>
          <motion.button
            onClick={finishSet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px var(--primary)40",
            }}
          >
            {setsCompleted + 1 >= targetSets ? (
              <>
                <CheckCircle2 size={16} /> Finish
              </>
            ) : (
              <>Complete Set {currentSet} →</>
            )}
          </motion.button>
        </div>
      </div>

      {/* Rest overlay */}
      <AnimatePresence>
        {resting && (
          <RestOverlay
            nextSetNum={setsCompleted + 1}
            totalSets={targetSets}
            onSkip={() => setResting(false)}
          />
        )}
      </AnimatePresence>

      {/* Quit confirm */}
      <AnimatePresence>
        {quitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-6 w-full max-w-xs text-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p className="text-3xl mb-3">⚠️</p>
              <p
                className="font-black text-base mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Quit workout?
              </p>
              <p
                className="text-sm mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                Your current progress will be lost.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  Keep Going
                </button>
                <button
                  onClick={onQuit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-red-500 hover:brightness-110"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── COMPLETE STATE ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function CompleteView({
  ex,
  sets,
  reps,
  weight,
  duration,
  onReset,
  onNext,
}: {
  ex: Exercise;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  onReset: () => void;
  onNext: () => void;
}) {
  const totalVol = sets * reps * weight;
  const calories = Math.round((duration / 60) * 6.5);
  const avgHR = 130 + Math.round(weight * 0.08);
  const peakBpm = avgHR + 18;

  const zones = { warmup: 55, fatBurn: 72, cardio: 88, peak: 65 };
  const zoneMax = Math.max(...Object.values(zones));

  return (
    <div className="max-w-lg mx-auto flex flex-col gap-4 pb-8">
      {/* Well Done */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-3xl p-8 text-center relative overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Background burst glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 3, opacity: 1 }}
          transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(244,121,32,0.08) 0%, transparent 65%)",
          }}
        />

        {/* Animated check badge */}
        <div
          className="relative mx-auto mb-6"
          style={{ width: 100, height: 100 }}
        >
          {/* Outer burst rings */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: `2px solid rgba(244,121,32,${0.35 - i * 0.1})` }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.1 + i * 0.28, opacity: [0, 0.6, 0] }}
              transition={{
                delay: 0.3 + i * 0.15,
                duration: 0.9,
                ease: "easeOut",
              }}
            />
          ))}

          {/* Tick marks radiating out */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 origin-left"
              style={{
                width: 10,
                height: 2,
                borderRadius: 2,
                background: "var(--primary)",
                marginTop: -1,
                rotate: `${i * 45}deg`,
                translateX: 42,
              }}
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: [0, 1, 0] }}
              transition={{ delay: 0.35 + i * 0.04, duration: 0.5 }}
            />
          ))}

          {/* Main circle */}
          <motion.div
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.15,
              type: "spring",
              stiffness: 280,
              damping: 20,
            }}
            className="absolute inset-0 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(244,121,32,0.18), rgba(244,121,32,0.08))",
              border: "2px solid rgba(244,121,32,0.4)",
            }}
          >
            {/* SVG checkmark */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <motion.path
                d="M10 23L18 31L34 14"
                stroke="var(--primary)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  delay: 0.4,
                  duration: 0.55,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </svg>
          </motion.div>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="font-black tracking-tight mb-2"
          style={{
            fontSize: "clamp(28px, 5vw, 38px)",
            color: "var(--text-primary)",
          }}
        >
          Well Done! 🎉
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          You crushed all sets for{" "}
          <span className="font-bold" style={{ color: "var(--primary)" }}>
            {ex.name}.
          </span>
        </motion.p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          {
            icon: "🏋️",
            label: "Volume",
            val: totalVol,
            unit: "kg",
            bg: "#dbeeff",
            delay: 0.1,
          },
          {
            icon: "❤️",
            label: "Avg HR",
            val: avgHR,
            unit: "bpm",
            bg: "#ffe4e4",
            delay: 0.18,
          },
          {
            icon: "🔥",
            label: "Calories",
            val: calories,
            unit: "kcal",
            bg: "#fff3e0",
            delay: 0.26,
          },
        ].map((s) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: s.delay,
              duration: 0.45,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: s.bg }}
            >
              {s.icon}
            </div>
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
              <p
                className="font-black text-xl leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                <AnimNum to={s.val} />
                <span
                  className="text-xs font-semibold ml-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {s.unit}
                </span>
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary row */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="grid grid-cols-3 gap-3"
      >
        {[
          { label: "Duration", val: fmt(duration) },
          { label: "Sets × Reps", val: `${sets}×${reps}` },
          { label: "Weight", val: `${weight}kg` },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="font-black text-base"
              style={{ color: "var(--primary)" }}
            >
              {s.val}
            </p>
            <p
              className="text-[10px] uppercase tracking-wider mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Intensity breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="rounded-3xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3
              className="font-black text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              Intensity Breakdown
            </h3>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              Peak: {peakBpm} bpm
            </p>
          </div>
          <div
            className="px-2.5 py-1 rounded-full text-[11px] font-black"
            style={{ background: "#dcfce7", color: "#16a34a" }}
          >
            ↗ +5% vs last week
          </div>
        </div>
        <div className="flex gap-3 mt-5 px-2" style={{ height: 100 }}>
          {[
            {
              label: "WARMUP",
              pct: (zones.warmup / zoneMax) * 100,
              color: "#ffd0b0",
            },
            {
              label: "FAT BURN",
              pct: (zones.fatBurn / zoneMax) * 100,
              color: "#ffb07a",
            },
            {
              label: "CARDIO",
              pct: (zones.cardio / zoneMax) * 100,
              color: "#f47920",
            },
            {
              label: "PEAK",
              pct: (zones.peak / zoneMax) * 100,
              color: "#c45d10",
            },
          ].map((z, i) => (
            <div
              key={z.label}
              className="flex flex-col items-center gap-2 flex-1"
            >
              <div
                className="w-full relative rounded-t-xl overflow-hidden"
                style={{ height: 80, background: `${z.color}20` }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${z.pct}%` }}
                  transition={{
                    delay: 0.5 + i * 0.08,
                    duration: 0.8,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-0 w-full rounded-t-xl"
                  style={{ background: z.color }}
                />
              </div>
              <span
                className="text-[9px] font-black uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                {z.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <RotateCcw size={15} /> Do it Again
        </button>
        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white"
          style={{
            background: "var(--primary)",
            boxShadow: "0 6px 24px var(--primary)35",
          }}
        >
          Next Exercise →
        </motion.button>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── ROOT PAGE ────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [ex, setEx] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<PageState>("detail");
  const [targetSets, setTargetSets] = useState(4);
  const [targetReps, setTargetReps] = useState(10);
  const [targetWeight, setTargetWeight] = useState(60);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);

  useEffect(() => {
    fetch(`/api/exercises/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEx(d.exercise);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleComplete = useCallback((duration: number, sets: number) => {
    setCompletedDuration(duration);
    setCompletedSets(sets);
    setState("complete");
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "var(--primary)" }}
        />
      </div>
    );

  if (!ex)
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">❌</p>
        <p className="font-bold" style={{ color: "var(--text-primary)" }}>
          Exercise not found
        </p>
        <button
          onClick={() => router.push("/dashboard/exercise")}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--primary)" }}
        >
          Back to Exercises
        </button>
      </div>
    );

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <AnimatePresence mode="wait">
        {state === "detail" && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DetailView
              ex={ex}
              targetSets={targetSets}
              targetReps={targetReps}
              targetWeight={targetWeight}
              onEditGoal={() => setEditGoalOpen(true)}
              onStart={() => setState("session")}
            />
          </motion.div>
        )}

        {state === "session" && (
          <motion.div
            key="session"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <SessionView
              ex={ex}
              targetSets={targetSets}
              targetReps={targetReps}
              targetWeight={targetWeight}
              onComplete={handleComplete}
              onQuit={() => setState("detail")}
            />
          </motion.div>
        )}

        {state === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CompleteView
              ex={ex}
              sets={completedSets}
              reps={targetReps}
              weight={targetWeight}
              duration={completedDuration}
              onReset={() => setState("detail")}
              onNext={() => router.push("/dashboard/exercise")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Goal Sheet */}
      <AnimatePresence>
        {editGoalOpen && (
          <EditGoalSheet
            sets={targetSets}
            reps={targetReps}
            weight={targetWeight}
            onSave={(s, r, w) => {
              setTargetSets(s);
              setTargetReps(r);
              setTargetWeight(w);
            }}
            onClose={() => setEditGoalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
