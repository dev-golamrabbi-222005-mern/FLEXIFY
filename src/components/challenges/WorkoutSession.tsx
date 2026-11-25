"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, Pause, Play } from "lucide-react";
import { ChallengeExercise } from "./DayExerciseList";
import { InfoModal } from "./InfoModal";
import { DayPlan, fmtTime, estimateCalories } from "@/lib/challengeUtils";
import { QuitConfirmModal } from "./QuitConfirmModal";
import { SessionRestView } from "./SessionRestView";
import { SessionExerciseView } from "./SessionExerciseView";

interface Props {
  dayPlan: DayPlan;
  exercises: ChallengeExercise[];
  onComplete: (result: { durationSecs: number; caloriesBurned: number }) => void;
  onQuit: () => void;
}

type Phase = "exercise" | "rest" | "done";

export function WorkoutSession({ dayPlan, exercises, onComplete, onQuit }: Props) {
  const [exIdx, setExIdx] = useState(0);
  const [setsDone, setSetsDone] = useState(0);
  const [phase, setPhase] = useState<Phase>("exercise");
  const [elapsed, setElapsed] = useState(0);
  const [restLeft, setRestLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const totalCalories = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = exercises[exIdx];
  const isLastSet = setsDone + 1 >= current?.sets;
  const isLastExercise = exIdx >= exercises.length - 1;
  const progress = exIdx / exercises.length + setsDone / (current?.sets || 1) / exercises.length;

  useEffect(() => {
    if (paused || phase === "rest") return;
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, [paused, phase]);

  const advanceAfterRest = () => {
    setPhase("exercise");
    setRestLeft(0);
  };

  useEffect(() => {
    if (phase !== "rest") return;
    if (restLeft <= 0) {
      const t = setTimeout(() => advanceAfterRest(), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRestLeft((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, restLeft]);

  const completeSet = () => {
    const cal = estimateCalories(1, current.reps, current.rest);
    totalCalories.current += cal;

    if (isLastSet) {
      if (isLastExercise) {
        onComplete({
          durationSecs: elapsed,
          caloriesBurned: Math.round(totalCalories.current),
        });
        return;
      }
      setExIdx((i) => i + 1);
      setSetsDone(0);
      setPhase("rest");
      setRestLeft(current.rest);
    } else {
      setSetsDone((s) => s + 1);
      setPhase("rest");
      setRestLeft(current.rest);
    }
  };

  if (exercises.length === 0 || !current) return null;

  return (
    <div className="pb-32">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setQuitConfirm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[var(--primary)] transition-colors cursor-pointer"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={16} /> Quit
        </button>
        <div
          className="px-3 py-1.5 rounded-xl font-black text-sm tabular-nums"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          ⏱ {fmtTime(elapsed)}
        </div>
      </div>

      <div
        className="h-1.5 rounded-full mb-6 overflow-hidden"
        style={{ background: "var(--border-color)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--primary)" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <SessionExerciseView
        exercise={current}
        exIdx={exIdx}
        totalExercises={exercises.length}
        setsDone={setsDone}
        imgError={imgError}
        onImgError={() => setImgError(true)}
        onOpenInfo={() => setInfoOpen(true)}
      />

      <div
        className="fixed bottom-0 left-0 md:left-64 right-0 z-40 px-4 pb-6 pt-4"
        style={{
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={() => setPaused((p) => !p)}
            className="flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-bold text-sm transition-all cursor-pointer"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            {paused ? <Play size={16} /> : <Pause size={16} />}
          </button>
          <motion.button
            onClick={completeSet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white cursor-pointer"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
            }}
          >
            <CheckCircle2 size={16} />
            {isLastSet && isLastExercise
              ? "Finish Workout"
              : isLastSet
                ? `Done — Next Exercise →`
                : `Complete Set ${setsDone + 1}`}
          </motion.button>
        </div>
      </div>

      <SessionRestView
        open={phase === "rest"}
        isLastSet={isLastSet}
        setsDone={setsDone}
        totalSets={current.sets}
        restLeft={restLeft}
        totalRest={current.rest}
        onSkipRest={advanceAfterRest}
      />

      <QuitConfirmModal
        open={quitConfirm}
        onCancel={() => setQuitConfirm(false)}
        onConfirmQuit={onQuit}
      />

      <InfoModal exercise={infoOpen ? current : null} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
