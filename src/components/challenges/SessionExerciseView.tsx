"use client";

import React from "react";
import { Info } from "lucide-react";
import { motion } from "framer-motion";
import { ChallengeExercise } from "./DayExerciseList";

interface SessionExerciseViewProps {
  exercise: ChallengeExercise;
  exIdx: number;
  totalExercises: number;
  setsDone: number;
  imgError: boolean;
  onImgError: () => void;
  onOpenInfo: () => void;
}

export function SessionExerciseView({
  exercise,
  exIdx,
  totalExercises,
  setsDone,
  imgError,
  onImgError,
  onOpenInfo,
}: SessionExerciseViewProps) {
  const imgSrc = !imgError
    ? Array.isArray(exercise.images)
      ? exercise.images[0]
      : typeof exercise.images === "string"
        ? exercise.images
        : null
    : null;

  return (
    <>
      <p
        className="text-[10px] font-black uppercase tracking-widest mb-1"
        style={{ color: "var(--primary)" }}
      >
        Exercise {exIdx + 1} of {totalExercises}
      </p>
      <h2
        className="font-black tracking-tight mb-4"
        style={{
          fontSize: "clamp(20px, 4vw, 28px)",
          color: "var(--text-primary)",
        }}
      >
        {exercise.name}
      </h2>

      <div
        key={exIdx}
        className="relative rounded-2xl overflow-hidden mb-4"
        style={{ aspectRatio: "16/9" }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
            alt={exercise.name}
            className="w-full h-full object-cover"
            onError={onImgError}
          />
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--bg-secondary)" }}
          >
            <span className="text-5xl">🏋️</span>
            <p className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
              {exercise.name}
            </p>
          </div>
        )}

        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        />

        <button
          onClick={onOpenInfo}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white transition-all hover:scale-110 cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Info size={16} />
        </button>

        {exercise.warning != null && String(exercise.warning).trim() !== "" && (
          <div
            className="absolute bottom-3 left-3 right-3 flex items-start gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(239,68,68,0.88)",
              backdropFilter: "blur(4px)",
            }}
          >
            <span className="text-white text-xs font-black shrink-0 mt-0.5">⚠️</span>
            <p className="text-white text-xs leading-snug font-semibold">
              {String(exercise.warning)}
            </p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: exercise.sets }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-full transition-all"
            animate={{
              width: i === setsDone ? 20 : 8,
              backgroundColor:
                i < setsDone
                  ? "var(--primary)"
                  : i === setsDone
                    ? "var(--primary)"
                    : "var(--border-color)",
              opacity: i < setsDone ? 0.5 : 1,
            }}
            style={{ height: 8 }}
          />
        ))}
        <span
          className="text-sm font-bold ml-1"
          style={{ color: "var(--text-secondary)" }}
        >
          Set {setsDone + 1} / {exercise.sets}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p className="font-black text-3xl" style={{ color: "var(--primary)" }}>
            {exercise.reps}
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Reps
          </p>
        </div>
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p className="font-black text-3xl" style={{ color: "var(--text-primary)" }}>
            {exercise.rest}s
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Rest After
          </p>
        </div>
      </div>
    </>
  );
}
