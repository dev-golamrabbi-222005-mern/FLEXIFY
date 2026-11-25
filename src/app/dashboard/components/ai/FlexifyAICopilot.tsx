"use client";

import { useState } from "react";
import { Sparkles, Bot, Dumbbell, HeartPulse, Send, RefreshCw, Zap } from "lucide-react";

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  notes: string;
}

interface CopilotData {
  advice: string;
  adaptedWorkout: Exercise[];
  recoveryTips: string[];
}

export default function FlexifyAICopilot() {
  const [prompt, setPrompt] = useState("");
  const [soreness, setSoreness] = useState<"none" | "mild" | "moderate" | "severe">("mild");
  const [energy, setEnergy] = useState<"low" | "medium" | "high">("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<CopilotData | null>(null);

  const quickPrompts = [
    "Lower back & hamstring tightness after deadlifts",
    "Time-crunched 25-minute upper body hypertrophy",
    "Shoulder mobility & rotator cuff prehab",
  ];

  const handleAskCopilot = async (customPrompt?: string) => {
    const textToSubmit = customPrompt || prompt;
    if (!textToSubmit.trim()) return;

    setIsLoading(true);
    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: textToSubmit,
          sorenessLevel: soreness,
          energyLevel: energy,
          goal: "Adaptive Fitness & Hypertrophy",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCopilotData(data);
      }
    } catch (err) {
      console.error("AI Copilot Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-linear-to-br from-slate-900/90 via-slate-900/60 to-emerald-950/30 p-6 shadow-xl backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 text-black shadow-lg shadow-emerald-500/20">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Flexify AI Workout Copilot</h3>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                <Sparkles className="h-3 w-3" /> Gemini 2.5
              </span>
            </div>
            <p className="text-xs text-slate-400">Real-time biomechanics & adaptive workout suggestions</p>
          </div>
        </div>
      </div>

      {/* Controls & Condition Pills */}
      <div className="relative z-10 mt-5 space-y-4">
        {/* State Selectors */}
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
                  className={`flex-1 rounded-lg px-2.5 py-1.5 capitalize transition-all ${
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
                  className={`flex-1 rounded-lg px-2.5 py-1.5 capitalize transition-all ${
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

        {/* Quick Suggestion Pills */}
        <div className="flex flex-wrap gap-2 pt-1">
          {quickPrompts.map((q, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setPrompt(q);
                handleAskCopilot(q);
              }}
              className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-slate-300 transition-colors hover:bg-emerald-500/20 hover:text-emerald-300 border border-slate-700/60"
            >
              ⚡ {q}
            </button>
          ))}
        </div>

        {/* Prompt Input Form */}
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAskCopilot();
              }
            }}
            placeholder="E.g., How should I train today with stiff lower back?"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
          <button
            type="button"
            disabled={isLoading || !prompt.trim()}
            onClick={() => handleAskCopilot()}
            className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 disabled:opacity-50"
          >
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span>Analyze</span>
          </button>
        </div>
      </div>

      {/* Copilot Response Section */}
      {copilotData && (
        <div className="relative z-10 mt-6 space-y-4 rounded-xl border border-white/10 bg-slate-950/50 p-4">
          {/* Advice */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5" /> Coach Evaluation
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">{copilotData.advice}</p>
          </div>

          {/* Adapted Routine */}
          {copilotData.adaptedWorkout && copilotData.adaptedWorkout.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">
                <Dumbbell className="h-3.5 w-3.5" /> Adapted Exercises
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {copilotData.adaptedWorkout.map((ex, i) => (
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

          {/* Recovery Tips */}
          {copilotData.recoveryTips && copilotData.recoveryTips.length > 0 && (
            <div className="pt-2 border-t border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1.5">
                <HeartPulse className="h-3.5 w-3.5" /> Recovery Directives
              </div>
              <ul className="space-y-1 text-xs text-slate-300">
                {copilotData.recoveryTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
