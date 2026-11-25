"use client";

import React, { useState } from "react";
import { Sparkles, Bot, Send, RefreshCw } from "lucide-react";
import {
  CopilotConditionSelectors,
  SorenessLevel,
  EnergyLevel,
} from "./CopilotConditionSelectors";
import { CopilotResultCard, CopilotData } from "./CopilotResultCard";

export default function FlexifyAICopilot() {
  const [prompt, setPrompt] = useState("");
  const [soreness, setSoreness] = useState<SorenessLevel>("mild");
  const [energy, setEnergy] = useState<EnergyLevel>("medium");
  const [isLoading, setIsLoading] = useState(false);
  const [copilotData, setCopilotData] = useState<CopilotData | null>(null);

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
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

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

      <CopilotConditionSelectors
        soreness={soreness}
        setSoreness={setSoreness}
        energy={energy}
        setEnergy={setEnergy}
        onSelectQuickPrompt={(q) => {
          setPrompt(q);
          handleAskCopilot(q);
        }}
      />

      <div className="relative z-10 mt-4 flex gap-2">
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
          className="flex items-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-teal-400 px-5 py-2.5 text-sm font-semibold text-black shadow-lg shadow-emerald-500/20 transition-all hover:brightness-110 disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          <span>Analyze</span>
        </button>
      </div>

      {copilotData && <CopilotResultCard data={copilotData} />}
    </div>
  );
}
