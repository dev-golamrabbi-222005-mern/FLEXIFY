"use client";

import React from "react";
import { Sparkles, Dumbbell, HeartPulse } from "lucide-react";

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

export interface CopilotData {
  advice: string;
  adaptedWorkout: Exercise[];
  recoveryTips: string[];
}

interface CopilotResultCardProps {
  data: CopilotData;
}

export function CopilotResultCard({ data }: CopilotResultCardProps) {
  return (
    <div className="relative z-10 mt-6 space-y-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <Sparkles className="h-3.5 w-3.5" /> Coach Evaluation
        </div>
        <p className="text-sm text-slate-200 leading-relaxed">{data.advice}</p>
      </div>

      {data.adaptedWorkout && data.adaptedWorkout.length > 0 && (
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
            <Dumbbell className="h-3.5 w-3.5" /> Adapted Exercises
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {data.adaptedWorkout.map((ex, i) => (
              <div key={i} className="rounded-lg border border-slate-800/80 bg-slate-900/70 p-2.5">
                <div className="flex justify-between items-start gap-2">
                  <span className="font-semibold text-sm text-white">{ex.name}</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    {ex.sets} × {ex.reps}
                  </span>
                </div>
                {ex.notes && <p className="mt-1 text-xs text-slate-400">{ex.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {data.recoveryTips && data.recoveryTips.length > 0 && (
        <div className="pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1.5">
            <HeartPulse className="h-3.5 w-3.5" /> Recovery Directives
          </div>
          <ul className="space-y-1 text-xs text-slate-300">
            {data.recoveryTips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
