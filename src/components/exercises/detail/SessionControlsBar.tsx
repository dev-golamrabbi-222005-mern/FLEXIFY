"use client";

import React from "react";
import { motion } from "framer-motion";
import { Pause, Play, CheckCircle2 } from "lucide-react";

export function SessionControlsBar({
  running,
  onToggleRunning,
  onFinishSet,
  setsCompleted,
  targetSets,
  currentSet,
}: {
  running: boolean;
  onToggleRunning: () => void;
  onFinishSet: () => void;
  setsCompleted: number;
  targetSets: number;
  currentSet: number;
}) {
  return (
    <div
      className="px-4 pb-5 pt-3"
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
          onClick={onFinishSet}
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
  );
}
