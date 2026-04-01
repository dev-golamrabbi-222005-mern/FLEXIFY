"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronLeft, CheckCircle2, Pause, Play } from "lucide-react";
import { ChallengeExercise } from "./DayExerciseList";
import { InfoModal } from "./InfoModal";
import { DayPlan, fmtTime, estimateCalories } from "@/lib/challengeUtils";

interface Props {
  dayPlan: DayPlan;
  exercises: ChallengeExercise[];
  onComplete: (result: {
    durationSecs: number;
    caloriesBurned: number;
  }) => void;
  onQuit: () => void;
}

type Phase = "exercise" | "rest" | "done";

export function WorkoutSession({
  dayPlan,
  exercises,
  onComplete,
  onQuit,
}: Props) {
  const [exIdx, setExIdx] = useState(0); // current exercise index
  const [setsDone, setSetsDone] = useState(0); // sets completed for current exercise
  const [phase, setPhase] = useState<Phase>("exercise");
  const [elapsed, setElapsed] = useState(0); // total workout time
  const [restLeft, setRestLeft] = useState(0);
  const [paused, setPaused] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  const totalCalories = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const current = exercises[exIdx];
  // DEBUG — remove after confirming data shape
  if (current) {
    console.log("[WorkoutSession] current exercise:", {
      name: current.name,
      images: current.images,
      warning: current.warning,
      videos: current.videos,
    });
  }
  const isLastSet = setsDone + 1 >= current?.sets;
  const isLastExercise = exIdx >= exercises.length - 1;
  const progress =
    exIdx / exercises.length + setsDone / current?.sets / exercises.length;

  // ── Main elapsed timer ───────────────────────────────────────────────────
  useEffect(() => {
    if (paused || phase === "rest") return;
    timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timerRef.current!);
  }, [paused, phase]);

  // ── advanceAfterRest must be declared BEFORE the useEffect that calls it ──
  const advanceAfterRest = () => {
    setPhase("exercise");
    setRestLeft(0);
  };

  // ── Rest countdown ─────────────────────────────────────────────────────
  // Use setTimeout(fn, 0) so setState is never called synchronously inside effect
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
      // Move to next exercise
      if (isLastExercise) {
        // All done!
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

  // ── Guard: no exercises loaded ──────────────────────────────────────────
  if (exercises.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-32 gap-4 text-center">
        <p className="text-5xl">🏋️</p>
        <p
          className="font-black text-base"
          style={{ color: "var(--text-primary)" }}
        >
          No exercises found for this day
        </p>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Try a different level or check back later.
        </p>
        <button
          onClick={onQuit}
          className="mt-2 px-6 py-3 rounded-2xl font-black text-sm text-white"
          style={{ background: "var(--primary)" }}
        >
          Back to Plan
        </button>
      </div>
    );
  }

  if (!current) return null;

  const restPct = restLeft / (current.rest || 1);
  const circ = 2 * Math.PI * 40;

  return (
    <div className="pb-32">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setQuitConfirm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold hover:text-[var(--primary)] transition-colors"
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

      {/* Overall progress bar */}
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

      {/* Exercise counter */}
      <p
        className="text-[10px] font-black uppercase tracking-widest mb-1"
        style={{ color: "var(--primary)" }}
      >
        Exercise {exIdx + 1} of {exercises.length}
      </p>
      <h2
        className="font-black tracking-tight mb-4"
        style={{
          fontSize: "clamp(20px, 4vw, 28px)",
          color: "var(--text-primary)",
        }}
      >
        {current.name}
      </h2>

      {/* Image + Info button — key=exIdx remounts on exercise change, resetting imgError */}
      <div
        key={exIdx}
        className="relative rounded-2xl overflow-hidden mb-4"
        style={{ aspectRatio: "16/9" }}
      >
        {(() => {
          // Normalize images — handle string, array, or missing
          const imgSrc = !imgError
            ? Array.isArray(current.images)
              ? current.images[0]
              : typeof current.images === "string"
                ? current.images
                : null
            : null;

          return imgSrc ? (
            <img
              src={imgSrc}
              alt={current.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ background: "var(--bg-secondary)" }}
            >
              <span className="text-5xl">🏋️</span>
              <p
                className="text-xs font-bold"
                style={{ color: "var(--text-secondary)" }}
              >
                {current.name}
              </p>
            </div>
          );
        })()}

        {/* Gradient overlay at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        />

        {/* i button — top right */}
        <button
          onClick={() => setInfoOpen(true)}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center font-black text-white transition-all hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Info size={16} />
        </button>

        {/* Warning at bottom of image */}
        {current.warning != null && String(current.warning).trim() !== "" && (
          <div
            className="absolute bottom-3 left-3 right-3 flex items-start gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(239,68,68,0.88)",
              backdropFilter: "blur(4px)",
            }}
          >
            <span className="text-white text-xs font-black shrink-0 mt-0.5">
              ⚠️
            </span>
            <p className="text-white text-xs leading-snug font-semibold">
              {String(current.warning)}
            </p>
          </div>
        )}
      </div>

      {/* Set dots */}
      <div className="flex items-center gap-2 mb-4">
        {Array.from({ length: current.sets }).map((_, i) => (
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
          Set {setsDone + 1} / {current.sets}
        </span>
      </div>

      {/* Reps + rest info */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="font-black text-3xl"
            style={{ color: "var(--primary)" }}
          >
            {current.reps}
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
          <p
            className="font-black text-3xl"
            style={{ color: "var(--text-primary)" }}
          >
            {current.rest}s
          </p>
          <p
            className="text-[10px] font-bold uppercase tracking-wider mt-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Rest After
          </p>
        </div>
      </div>

      {/* Sticky CTA */}
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
            className="flex items-center justify-center gap-2 py-4 px-5 rounded-2xl font-bold text-sm transition-all"
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
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-white"
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

      {/* ── Rest Overlay ── */}
      <AnimatePresence>
        {phase === "rest" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="w-full max-w-xs rounded-3xl p-8 text-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-1"
                style={{ color: "var(--text-secondary)" }}
              >
                Rest Time
              </p>
              <p
                className="text-sm font-semibold mb-6"
                style={{ color: "var(--primary)" }}
              >
                {isLastSet
                  ? "Get ready for next exercise"
                  : `Next: Set ${setsDone + 1} of ${current.sets}`}
              </p>

              {/* SVG ring */}
              <div className="relative w-28 h-28 mx-auto mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="var(--border-color)"
                    strokeWidth="6"
                  />
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circ}
                    animate={{ strokeDashoffset: circ * restPct }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-black text-3xl"
                    style={{
                      color:
                        restLeft === 0
                          ? "var(--primary)"
                          : "var(--text-primary)",
                    }}
                  >
                    {restLeft === 0 ? "GO!" : restLeft}
                  </span>
                  {restLeft > 0 && (
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      sec
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={advanceAfterRest}
                className="w-full py-3 rounded-2xl font-black text-sm text-white hover:brightness-110 transition-all"
                style={{
                  background: "var(--primary)",
                  boxShadow: "0 4px 20px rgba(244,121,32,0.4)",
                }}
              >
                Skip Rest →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Quit confirm ── */}
      <AnimatePresence>
        {quitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.6)",
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
                Your progress for today will be lost.
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
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-red-500"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Info Modal */}
      <InfoModal
        exercise={infoOpen ? current : null}
        onClose={() => setInfoOpen(false)}
      />
    </div>
  );
}
