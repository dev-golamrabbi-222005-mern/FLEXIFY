"use client";

import React from "react";
import { HeartPulse, Zap } from "lucide-react";

export type SorenessLevel = "none" | "mild" | "moderate" | "severe";
export type EnergyLevel = "low" | "medium" | "high";

interface CopilotConditionSelectorsProps {
  soreness: SorenessLevel;
  setSoreness: (level: SorenessLevel) => void;
  energy: EnergyLevel;
  setEnergy: (level: EnergyLevel) => void;
  onSelectQuickPrompt: (prompt: string) => void;
}

const QUICK_PROMPTS = [
  "Lower back & hamstring tightness after deadlifts",
  "Time-crunched 25-minute upper body hypertrophy",
  "Shoulder mobility & rotator cuff prehab",
];

export function CopilotConditionSelectors({
  soreness,
  setSoreness,
  energy,
  setEnergy,
  onSelectQuickPrompt,
}: CopilotConditionSelectorsProps) {
  return (
    <div className="relative z-10 mt-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5 font-medium text-[var(--text-secondary)]">
            <HeartPulse className="h-3.5 w-3.5 text-rose-400" />
            <span>Muscle Soreness:</span>
          </div>
          <div className="flex gap-1.5">
            {(["none", "mild", "moderate", "severe"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSoreness(level)}
                className={`flex-1 rounded-lg px-2.5 py-1.5 capitalize transition-all cursor-pointer ${
                  soreness === level
                    ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-1.5 font-medium text-[var(--text-secondary)]">
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Energy Reserves:</span>
          </div>
          <div className="flex gap-1.5">
            {(["low", "medium", "high"] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setEnergy(lvl)}
                className={`flex-1 rounded-lg px-2.5 py-1.5 capitalize transition-all cursor-pointer ${
                  energy === lvl
                    ? "bg-emerald-500 text-black font-semibold shadow-md shadow-emerald-500/20"
                    : "bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {QUICK_PROMPTS.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onSelectQuickPrompt(q)}
            className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/60 cursor-pointer"
          >
            ⚡ {q}
          </button>
        ))}
      </div>
    </div>
  );
}
