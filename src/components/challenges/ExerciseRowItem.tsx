"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChallengeExercise } from "./DayExerciseList";

interface ExerciseRowItemProps {
  ex: ChallengeExercise;
  index: number;
}

export function ExerciseRowItem({ ex, index }: ExerciseRowItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.06 }}
      className="flex gap-4 p-4 rounded-2xl"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div
        className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0"
        style={{ background: "var(--primary)15", color: "var(--primary)" }}
      >
        {index + 1}
      </div>

      {ex.images?.[0] && (
        <img
          src={ex.images[0]}
          alt={ex.name}
          className="w-16 h-16 rounded-xl object-cover shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      )}

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
  );
}
