"use client";

import { motion } from "framer-motion";
import { ChevronLeft, Play, Clock, Repeat, Zap } from "lucide-react";
import { DayPlan, estimateCalories } from "@/lib/challengeUtils";

export interface ChallengeExercise {
  _id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  instructions: string;
  images: string[];
  videos?: string;
  muscles: string[];
  warning?: string;
  tag: string;
  level: string;
}

interface Props {
  dayPlan: DayPlan;
  exercises: ChallengeExercise[];
  onStart: () => void;
  onBack: () => void;
}

export function DayExerciseList({ dayPlan, exercises, onStart, onBack }: Props) {
  const totalCalories = exercises.reduce(
    (sum, ex) => sum + estimateCalories(ex.sets, ex.reps, ex.rest),
    0
  );
  const estimatedMins = Math.ceil(
    exercises.reduce((sum, ex) => sum + ex.sets * (30 + ex.rest), 0) / 60
  );

  return (
    <div className="pb-32">
      {/* Back */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold mb-6 hover:text-[var(--primary)] transition-colors"
        style={{ color: "var(--text-secondary)" }}
      >
        <ChevronLeft size={16} /> Back to Plan
      </button>

      {/* Day header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{dayPlan.tagEmoji}</span>
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-widest"
              style={{ color: "var(--primary)" }}
            >
              Week {dayPlan.week} · Day {dayPlan.day}
              {dayPlan.isLightDay && " · Light Day"}
            </p>
            <h2
              className="font-black tracking-tight"
              style={{ fontSize: "clamp(22px, 5vw, 32px)", color: "var(--text-primary)" }}
            >
              {dayPlan.tagLabel}
            </h2>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex gap-3 mt-4">
          {[
            { icon: Repeat, label: "Exercises", val: exercises.length },
            { icon: Clock,  label: "Est. Time",  val: `${estimatedMins} min` },
            { icon: Zap,    label: "Calories",   val: `~${totalCalories} kcal` },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-2xl p-3 text-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <s.icon
                size={14}
                className="mx-auto mb-1"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-black text-sm leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {s.val}
              </p>
              <p
                className="text-[10px] mt-0.5 font-bold uppercase tracking-wider"
                style={{ color: "var(--text-secondary)" }}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Exercise list */}
      <div className="space-y-3">
        {exercises.map((ex, i) => (
          <motion.div
            key={ex._id}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex gap-4 p-4 rounded-2xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Index */}
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
              style={{ background: "var(--primary)15", color: "var(--primary)" }}
            >
              {i + 1}
            </div>

            {/* Thumbnail */}
            {ex.images?.[0] && (
              <img
                src={ex.images[0]}
                alt={ex.name}
                className="w-16 h-16 rounded-xl object-cover shrink-0"
                onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
            )}

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="font-black text-sm leading-tight mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                {ex.name}
              </p>
              <div className="flex flex-wrap gap-2">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded-lg"
                  style={{ background: "var(--primary)15", color: "var(--primary)" }}
                >
                  {ex.sets} sets × {ex.reps} reps
                </span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {ex.rest}s rest
                </span>
              </div>
              {ex.muscles?.length > 0 && (
                <p
                  className="text-[10px] mt-1.5 capitalize"
                  style={{ color: "var(--text-secondary)" }}
                >
                  🎯 {ex.muscles.join(", ")}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Sticky Start button */}
      <div
        className="fixed bottom-0 left-0 md:left-64 right-0 z-40 px-4 pb-6 pt-4"
        style={{
          background: "var(--bg-primary)",
          borderTop: "2px solid var(--primary)",
          boxShadow: "0 -8px 32px rgba(244,121,32,0.12)",
        }}
      >
        <div className="max-w-2xl mx-auto">
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 32px rgba(244,121,32,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base text-white"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
            }}
          >
            <Play size={18} fill="white" />
            Start Day {dayPlan.day} Workout
          </motion.button>
        </div>
      </div>
    </div>
  );
}
