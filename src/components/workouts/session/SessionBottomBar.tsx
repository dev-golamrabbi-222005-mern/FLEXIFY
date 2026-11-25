"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pause, Play, Loader2, CheckCircle2, Save } from "lucide-react";

export function SessionBottomBar({
  running,
  onToggleRunning,
  isSaving,
  allSetsDone,
  isLastExercise,
  onNext,
  onFinish,
}: {
  running: boolean;
  onToggleRunning: () => void;
  isSaving: boolean;
  allSetsDone: boolean;
  isLastExercise: boolean;
  onNext: () => void;
  onFinish: () => void;
}) {
  return (
    <div
      className="fixed bottom-0 left-0 md:left-64 right-0 z-40 px-4 pb-5 pt-3"
      style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
        <button
          onClick={onToggleRunning}
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
          onClick={isSaving ? undefined : allSetsDone ? onNext : onFinish}
          disabled={isSaving}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white disabled:opacity-60"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
          }}
        >
          {isSaving ? (
            <>
              <Loader2 size={16} className="animate-spin" /> Saving…
            </>
          ) : allSetsDone ? (
            <>
              <CheckCircle2 size={16} />{" "}
              {isLastExercise ? "Finish Workout" : "Next Exercise →"}
            </>
          ) : (
            <>
              <Save size={16} /> Finish Workout
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
