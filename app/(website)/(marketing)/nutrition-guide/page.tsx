"use client";

import React from "react";
import {
  Apple,
  Droplets,
  Flame,
  Beef,
  Wheat,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function NutritionGuidePage() {
  return (
    <div className="min-h-screen pb-20">
      <title>Nutrition Guide | Flexify</title>

      {/* --- HERO SECTION --- */}
      <section className="relative my-12 md:my-16 lg:my-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--primary)] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--secondary)] rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)] text-xs font-black uppercase tracking-widest mb-6">
            Fuel Your Progress
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tighter">
            EAT LIKE A <span className="text-[var(--primary)]">CHAMPION</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--text-secondary)] text-lg">
            Fitness is 30% training and 70% nutrition. Whether you're bulking,
            cutting, or maintaining, your results start in the kitchen.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* --- MACRONUTRIENTS GRID --- */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-[var(--primary)] rounded-lg text-white">
              <Apple size={24} />
            </div>
            <h2 className="text-3xl font-black tracking-tight">
              THE BIG THREE (MACROS)
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Protein */}
            <div className="card-glass group hover:border-[var(--primary)] transition-all">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 mb-6">
                <Beef size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Muscle Builder (Protein)
              </h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Essential for tissue repair and muscle growth. Aim for 1.6g -
                2.2g per kg of body weight.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[var(--text-muted)] uppercase">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--primary)]" />{" "}
                  Chicken & Beef
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--primary)]" />{" "}
                  Eggs & Dairy
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--primary)]" />{" "}
                  Lentils & Tofu
                </li>
              </ul>
            </div>

            {/* Carbs */}
            <div className="card-glass group hover:border-[var(--secondary)] transition-all">
              <div className="w-12 h-12 bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-500 mb-6">
                <Wheat size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Energy Source (Carbs)</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Your body's preferred fuel for high-intensity training. Focus on
                complex carbohydrates.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[var(--text-muted)] uppercase">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--secondary)]" />{" "}
                  Oats & Brown Rice
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--secondary)]" />{" "}
                  Sweet Potatoes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--secondary)]" />{" "}
                  Whole Grain Pasta
                </li>
              </ul>
            </div>

            {/* Fats */}
            <div className="card-glass group hover:border-[var(--warning)] transition-all">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 mb-6">
                <Flame size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Hormone Support (Fats)</h3>
              <p className="text-sm text-[var(--text-secondary)] mb-4">
                Crucial for brain function and hormone production. Never cut
                healthy fats completely.
              </p>
              <ul className="space-y-2 text-xs font-bold text-[var(--text-muted)] uppercase">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--warning)]" />{" "}
                  Avocado & Nuts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--warning)]" />{" "}
                  Olive Oil
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-[var(--warning)]" />{" "}
                  Fatty Fish
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* --- HYDRATION & TIMING --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Hydration Card */}
          <div className="card-glass bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-nav-footer)] border-l-4 border-l-blue-500">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
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
                  "If you feel thirsty, you're already dehydrated. Drink 500ml
                  as soon as you wake up."
                </p>
              </div>
            </div>
          </div>

          {/* Timing Card */}
          <div className="card-glass bg-gradient-to-br from-[var(--bg-secondary)] to-[var(--bg-nav-footer)] border-l-4 border-l-[var(--secondary)]">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black mb-2 flex items-center gap-2">
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

        {/* --- NUTRITION TIPS SECTION --- */}
        <section className="py-10 border-y border-[var(--border-color)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 01
              </h4>
              <p className="font-bold">Avoid Processed Sugars</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 02
              </h4>
              <p className="font-bold">Prioritize Whole Foods</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 03
              </h4>
              <p className="font-bold">Don't Fear Salt (Electrolytes)</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 04
              </h4>
              <p className="font-bold">Sleep is part of Nutrition</p>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA --- */}
        <section className="pb-10">
          <div className="card-glass bg-[var(--primary)] border-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-80 group-hover:scale-110 transition-transform">
              <Apple size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4">READY TO OPTIMIZE?</h2>
              <p className="text-[var(--text-muted)] mb-8 max-w-xl">
                Get a personalized meal plan tailored to your body weight,
                activity level, and fitness goals. Stop guessing, start growing.
              </p>
              <Link href={"/dashboard/nutrition-tracker"}>
              <button className="bg-white text-[var(--primary)] px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-95 shadow-xl">
                Go to the nutrition Tracker <ArrowRight size={20} />
              </button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
