"use client";

import React from "react";
import { motion } from "framer-motion";
import { ChevronLeft, Clock } from "lucide-react";
import { fmt } from "./types";

export function SessionHeader({
  elapsed,
  running,
  isRest,
  onQuit,
  progress,
  exIdx,
  totalExercises,
  name,
  completedSets,
  totalSets,
  currentSetNum,
}: {
  elapsed: number;
  running: boolean;
  isRest: boolean;
  onQuit: () => void;
  progress: number;
  exIdx: number;
  totalExercises: number;
  name: string;
  completedSets: number;
  totalSets: number;
  currentSetNum: number;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={onQuit}
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
          <Clock
            size={13}
            className={running && !isRest ? "animate-pulse" : ""}
            style={{ color: "var(--primary)" }}
          />
          <span
            className="font-black text-sm tabular-nums"
            style={{ color: "var(--text-primary)" }}
          >
            {fmt(elapsed)}
          </span>
        </div>
      </div>

      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border-color)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--primary)" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      <div>
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-0.5"
          style={{ color: "var(--primary)" }}
        >
          Exercise {exIdx + 1} of {totalExercises} · Currently Active
        </p>
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(20px, 4vw, 28px)",
            color: "var(--text-primary)",
          }}
        >
          {name}
        </h1>

        <div className="flex items-center gap-2 mt-2">
          {Array.from({ length: totalSets }).map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i + 1 === currentSetNum ? 1.3 : 1,
                backgroundColor:
                  i < completedSets
                    ? "var(--primary)"
                    : i + 1 === currentSetNum
                      ? "var(--primary)"
                      : "var(--border-color)",
                opacity: i < completedSets ? 0.5 : 1,
              }}
              className="w-2.5 h-2.5 rounded-full transition-all"
            />
          ))}
          <span
            className="text-xs font-bold ml-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Set {currentSetNum} of {totalSets}
          </span>
        </div>
      </div>
    </div>
  );
}
