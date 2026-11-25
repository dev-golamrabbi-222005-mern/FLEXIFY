"use client";

import React from "react";
import { Apple, Beef, Wheat, Flame, CheckCircle2 } from "lucide-react";

export function NutritionMacrosSection() {
  return (
    <section>
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-[var(--primary)] rounded-lg text-white">
          <Apple size={24} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-[var(--text-primary)]">
          THE BIG THREE (MACROS)
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-glass group hover:border-[var(--primary)] transition-all">
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
            <Beef size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Muscle Builder (Protein)</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Essential for tissue repair and muscle growth. Aim for 1.6g - 2.2g per
            kg of body weight.
          </p>
          <ul className="space-y-2 text-xs font-bold text-[var(--text-muted)] uppercase">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--primary)]" /> Chicken & Beef
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--primary)]" /> Eggs & Dairy
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--primary)]" /> Lentils & Tofu
            </li>
          </ul>
        </div>

        <div className="card-glass group hover:border-[var(--secondary)] transition-all">
          <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 mb-6">
            <Wheat size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Energy Source (Carbs)</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Your body&apos;s preferred fuel for high-intensity training. Focus on
            complex carbohydrates.
          </p>
          <ul className="space-y-2 text-xs font-bold text-[var(--text-muted)] uppercase">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" /> Oats & Brown Rice
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" /> Sweet Potatoes
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--secondary)]" /> Whole Grain Pasta
            </li>
          </ul>
        </div>

        <div className="card-glass group hover:border-[var(--warning)] transition-all">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
            <Flame size={28} />
          </div>
          <h3 className="text-xl font-bold mb-3">Hormone Support (Fats)</h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Crucial for brain function and hormone production. Never cut healthy
            fats completely.
          </p>
          <ul className="space-y-2 text-xs font-bold text-[var(--text-muted)] uppercase">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--warning)]" /> Avocado & Nuts
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--warning)]" /> Olive Oil
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={14} className="text-[var(--warning)]" /> Fatty Fish
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
