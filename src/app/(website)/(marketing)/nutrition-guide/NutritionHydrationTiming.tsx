"use client";

import React from "react";
import { Droplets, Clock, Zap } from "lucide-react";

export function NutritionHydrationTiming() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="card-glass bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-nav-footer)] border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-[var(--text-primary)]">
              <Droplets className="text-blue-500" /> HYDRATION
            </h3>
            <p className="text-[var(--text-secondary)]">
              Water is the secret weapon for performance.
            </p>
          </div>
          <span className="text-3xl font-black text-blue-500/20">3-4L</span>
        </div>
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-sm font-semibold italic text-blue-400">
              &ldquo;If you feel thirsty, you&apos;re already dehydrated. Drink
              500ml as soon as you wake up.&rdquo;
            </p>
          </div>
        </div>
      </div>

      <div className="card-glass bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-nav-footer)] border-l-4 border-l-[var(--secondary)]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-[var(--text-primary)]">
              <Clock className="text-[var(--secondary)]" /> MEAL TIMING
            </h3>
            <p className="text-[var(--text-secondary)]">
              When you eat matters for recovery.
            </p>
          </div>
          <Zap className="text-[var(--secondary)] opacity-20" size={40} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-[var(--border-color)]">
            <div className="font-black text-[var(--secondary)] text-xs">
              PRE
            </div>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              Fast-acting carbs 60m before gym.
            </p>
          </div>
          <div className="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-[var(--border-color)]">
            <div className="font-black text-[var(--secondary)] text-xs">
              POST
            </div>
            <p className="text-xs text-[var(--text-muted)] font-bold">
              High protein + Carbs within 2 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
