"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Edit3, Target } from "lucide-react";
import { Exercise, LEVEL_STYLE } from "./types";

export function DetailHeader({
  ex,
  targetSets,
  targetReps,
  onEditGoal,
}: {
  ex: Exercise;
  targetSets: number;
  targetReps: number;
  onEditGoal: () => void;
}) {
  const router = useRouter();
  const lc = LEVEL_STYLE[ex.level] ?? { bg: "#f1f5f9", text: "#64748b" };

  return (
    <>
      <nav
        className="flex items-center gap-1.5 text-xs mb-4"
        style={{ color: "var(--text-secondary)" }}
      >
        <button
          onClick={() => router.push("/dashboard/exercise")}
          className="flex items-center gap-1 hover:text-[var(--primary)] transition-colors"
        >
          <ChevronLeft size={14} /> Exercises
        </button>
        <span className="opacity-40">›</span>
        <span
          className="font-semibold truncate max-w-[180px]"
          style={{ color: "var(--text-primary)" }}
        >
          {ex.name}
        </span>
      </nav>

      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1">
          <h1
            className="font-black tracking-tight leading-tight mb-2"
            style={{
              fontSize: "clamp(20px, 4vw, 28px)",
              color: "var(--text-primary)",
            }}
          >
            {ex.name}
          </h1>
          <div className="flex gap-2 flex-wrap">
            {ex.category && (
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                style={{
                  background: "var(--primary)15",
                  color: "var(--primary)",
                }}
              >
                {ex.category}
              </span>
            )}
            <span
              className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
              style={{ background: lc.bg, color: lc.text }}
            >
              {ex.level}
            </span>
            {ex.mechanic && (
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                {ex.mechanic}
              </span>
            )}
          </div>
        </div>

        <button
          onClick={onEditGoal}
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all hover:brightness-95"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Target size={14} style={{ color: "var(--primary)" }} />
          <span
            className="text-sm font-black"
            style={{ color: "var(--text-primary)" }}
          >
            {targetSets}×{targetReps}
          </span>
          <Edit3 size={12} style={{ color: "var(--text-secondary)" }} />
        </button>
      </div>
    </>
  );
}
