"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Clock } from "lucide-react";
import { Exercise, fmt } from "./types";
import { RestOverlay } from "./RestOverlay";
import { SessionTimerCard } from "./SessionTimerCard";
import { SessionStatsProgress } from "./SessionStatsProgress";
import { SessionFormCoach } from "./SessionFormCoach";
import { SessionControlsBar } from "./SessionControlsBar";
import { SessionQuitModal } from "./SessionQuitModal";

export function SessionView({
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
    <div className="mx-auto my-10 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6 space-y-4">
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

      <SessionTimerCard
        totalSecs={totalSecs}
        setsCompleted={setsCompleted}
      />

      <SessionStatsProgress
        setsCompleted={setsCompleted}
        targetSets={targetSets}
        targetReps={targetReps}
        targetWeight={targetWeight}
        progress={progress}
      />

      <SessionFormCoach />

      <SessionControlsBar
        running={running}
        onToggleRunning={() => setRunning((r) => !r)}
        onFinishSet={finishSet}
        setsCompleted={setsCompleted}
        targetSets={targetSets}
        currentSet={currentSet}
      />

      <AnimatePresence>
        {resting && (
          <RestOverlay
            nextSetNum={setsCompleted + 1}
            totalSets={targetSets}
            onSkip={() => setResting(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {quitConfirm && (
          <SessionQuitModal
            open={quitConfirm}
            onCancel={() => setQuitConfirm(false)}
            onConfirm={onQuit}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
