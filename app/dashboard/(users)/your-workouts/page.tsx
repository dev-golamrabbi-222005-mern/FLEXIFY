// app/dashboard/(users)/your-workouts/page.tsx
"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Loader2,
  Dumbbell,
  History,
  ChevronRight,
  Zap,
  PlusCircle,
  CalendarDays,
  LayoutGrid,
} from "lucide-react";
import { WorkoutCard } from "@/components/cards/SuggestedWorkoutCard";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Exercise {
  id: string;
  name: string;
}

interface Routine {
  _id: string;
  planName: string;
  exercises: Exercise[];
  createdAt: string;
}

interface SuggestedPlans {
  [level: string]: Exercise[];
}

// ── Animation helpers (same as my-challenges) ─────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease },
});

// ── Level meta ────────────────────────────────────────────────────────────────
const LEVEL_META: Record<
  string,
  { emoji: string; color: string; label: string }
> = {
  beginner: { emoji: "🌱", color: "#10B981", label: "Beginner" },
  intermediate: { emoji: "⚡", color: "#f47920", label: "Intermediate" },
  advanced: { emoji: "🔥", color: "#ef4444", label: "Advanced" },
  expert: { emoji: "🏆", color: "#8b5cf6", label: "Expert" },
};

function getLevelMeta(level: string) {
  return (
    LEVEL_META[level.toLowerCase()] ?? {
      emoji: "💪",
      color: "var(--primary)",
      label: level,
    }
  );
}

export default function YourWorkoutsPage() {
  // ── Data fetching ────────────────────────────────────────────────────────
  const { data: suggestedPlans, isLoading: isSuggestedLoading } =
    useQuery<SuggestedPlans>({
      queryKey: ["suggested-routines"],
      queryFn: async () => {
        const res = await axios.get("/api/routines/suggested");
        return res.data;
      },
    });

  const { data: myRoutines, isLoading: isMyRoutinesLoading } = useQuery<
    Routine[]
  >({
    queryKey: ["my-custom-routines"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/show");
      return res.data.data;
    },
  });

  const isLoading = isSuggestedLoading || isMyRoutinesLoading;

  // ── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
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
          Loading your workouts...
        </p>
      </div>
    );
  }

  const suggestedEntries = suggestedPlans ? Object.entries(suggestedPlans) : [];
  const customCount = myRoutines?.length ?? 0;

  return (
    <div className="space-y-8">
      <title>Your Workouts | Dashboard - Flexify</title>

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0)}>
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-[0.25em] mb-1"
              style={{ color: "var(--primary)" }}
            >
              — Your Training
            </p>
            <h1
              className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]"
            >
              Your Workouts
            </h1>
          </div>
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              border: "1px solid rgba(16,185,129,0.25)",
            }}
          >
            <Dumbbell size={20} style={{ color: "var(--primary)" }} />
          </div>
        </div>
        <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
          Ready to achieve your goals today?
        </p>
      </motion.div>

      {/* ── Quick stats ──────────────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-3 gap-3">
        {[
          {
            icon: LayoutGrid,
            label: "Suggested",
            val: suggestedEntries.length,
          },
          {
            icon: History,
            label: "My Routines",
            val: customCount,
          },
          {
            icon: Zap,
            label: "Total Plans",
            val: suggestedEntries.length + customCount,
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            {...fadeUp(0.12 + i * 0.06)}
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
              {s.val}
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

      {/* ── Suggested Plans ──────────────────────────────────────────────── */}
      {suggestedEntries.length > 0 && (
        <motion.div {...fadeUp(0.2)}>
          {/* Section heading */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-color)" }}
            />
            <div className="flex items-center gap-2">
              <Dumbbell size={22} style={{ color: "var(--primary)" }} />
              <p className="text-3xl font-bold uppercase tracking-[0.1em]">
                Suggested Plans
              </p>
            </div>
            <div
              className="h-px flex-1"
              style={{ background: "var(--border-color)" }}
            />
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
                  style={{
                    background: "var(--bg-secondary)",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  {/* Colored top strip */}
                  <div
                    className="h-1.5 w-full"
                    style={{ background: meta.color }}
                  />
                  <div className="p-4">
                    {/* Card header */}
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0"
                        style={{
                          background: `${meta.color}15`,
                          border: `1px solid ${meta.color}30`,
                        }}
                      >
                        {meta.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-black text-base leading-tight capitalize"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {meta.label}
                        </p>
                        <p
                          className="text-[10px] font-black uppercase tracking-wider"
                          style={{ color: meta.color }}
                        >
                          {exercises.length} exercises
                        </p>
                      </div>
                      <span
                        className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0"
                        style={{
                          background: `${meta.color}12`,
                          color: meta.color,
                          border: `1px solid ${meta.color}25`,
                        }}
                      >
                        Free
                      </span>
                    </div>

                    {/* WorkoutCard — keeps all original functionality */}
                    <WorkoutCard
                      title={level}
                      exercises={exercises}
                      type="suggested"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── My Custom Routines ───────────────────────────────────────────── */}
      <motion.div {...fadeUp(0.3)}>
        {/* Section heading */}
        <div className="flex items-center gap-3 mb-6 pt-8">
          <div
            className="h-px flex-1"
            style={{ background: "var(--border-color)" }}
          />
          <div className="flex items-center gap-2">
            <History size={22} style={{ color: "var(--primary)" }} />
            <p className="text-3xl font-bold uppercase tracking-[0.1em]">
              My Custom Routines
            </p>
          </div>
          <div
            className="h-px flex-1"
            style={{ background: "var(--border-color)" }}
          />
        </div>

        {customCount > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myRoutines!.map((routine, i) => (
              <motion.div
                key={routine._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32 + i * 0.07, duration: 0.4, ease }}
                className="rounded-3xl overflow-hidden"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {/* Green top strip */}
                <div
                  className="h-1.5 w-full"
                  style={{ background: "var(--primary)" }}
                />
                <div className="p-4">
                  {/* Card header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      <Dumbbell size={18} style={{ color: "var(--primary)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-black text-base leading-tight truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {routine.planName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <CalendarDays
                          size={10}
                          style={{ color: "var(--text-muted)" }}
                        />
                        <p
                          className="text-[10px] font-semibold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {new Date(routine.createdAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0"
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        color: "var(--primary)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      {routine.exercises.length} ex
                    </span>
                  </div>

                  {/* WorkoutCard — keeps all original functionality */}
                  <WorkoutCard
                    id={routine._id}
                    title={routine.planName}
                    exercises={routine.exercises}
                    createdAt={routine.createdAt}
                    type="custom"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
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
              <PlusCircle size={24} style={{ color: "var(--primary)" }} />
            </div>
            <p
              className="font-black text-base mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              No custom routines yet
            </p>
            <p
              className="text-sm max-w-xs mx-auto"
              style={{ color: "var(--text-secondary)" }}
            >
              Create your first custom routine to get started.
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
