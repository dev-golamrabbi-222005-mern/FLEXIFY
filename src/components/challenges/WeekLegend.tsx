"use client";

import React from "react";
import { DayPlan } from "@/lib/challengeUtils";

interface WeekLegendProps {
  plan: DayPlan[];
  tagColors: Record<string, string>;
}

export function WeekLegend({ plan, tagColors }: WeekLegendProps) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      {Object.entries(tagColors).map(([tag, color]) => {
        const hasDays = plan.some((d) => d.tag === tag);
        if (!hasDays) return null;
        return (
          <div key={tag} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ background: color }} />
            <span
              className="text-[10px] font-bold uppercase tracking-wider capitalize"
              style={{ color: "var(--text-secondary)" }}
            >
              {tag}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-[var(--border-color)]" />
        <span
          className="text-[10px] font-bold uppercase tracking-wider"
          style={{ color: "var(--text-secondary)" }}
        >
          Locked
        </span>
      </div>
    </div>
  );
}
