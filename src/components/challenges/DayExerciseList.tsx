"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Play } from "lucide-react";
import { DayPlan, estimateCalories } from "@/lib/challengeUtils";
import { DayHeaderStats } from "./DayHeaderStats";
import { ExerciseRowItem } from "./ExerciseRowItem";

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
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm font-semibold mb-6 hover:text-[var(--primary)] transition-colors cursor-pointer"
        style={{ color: "var(--text-secondary)" }}
      >
        <ChevronLeft size={16} /> Back to Plan
      </button>

      <DayHeaderStats
        dayPlan={dayPlan}
        exerciseCount={exercises.length}
        estimatedMins={estimatedMins}
        totalCalories={totalCalories}
      />

      <div className="space-y-3">
        {exercises.map((ex, i) => (
          <ExerciseRowItem key={ex._id} ex={ex} index={i} />
        ))}
      </div>

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
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-black text-base text-white cursor-pointer"
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
