"use client";

import React from "react";
import { Zap } from "lucide-react";

export function SessionFormCoach() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: "#0f172a", border: "1px solid #1e293b" }}
    >
      <p className="font-bold text-sm text-white mb-3 flex items-center gap-2">
        <Zap size={14} style={{ color: "#f47920" }} /> AI Form Coach
      </p>
      <ul className="space-y-2">
        <li className="text-sm flex items-start gap-2 text-white/75">
          <span className="shrink-0 mt-0.5 text-emerald-400">✔</span>
          Keep your chest up and core engaged throughout the movement.
        </li>
        <li className="text-sm flex items-start gap-2 text-white/75">
          <span className="shrink-0 mt-0.5 text-amber-400">⚠</span>
          Drive through your full foot — do not rise on your toes.
        </li>
      </ul>
    </div>
  );
}
