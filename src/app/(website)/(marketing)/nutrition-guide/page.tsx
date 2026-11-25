"use client";

import React from "react";
import { Apple, ArrowRight } from "lucide-react";
import Link from "next/link";
import { NutritionMacrosSection } from "./NutritionMacrosSection";
import { NutritionHydrationTiming } from "./NutritionHydrationTiming";

export default function NutritionGuidePage() {
  return (
    <div className="min-h-screen pb-20">
      <title>Nutrition Guide | Flexify</title>

      <section className="relative my-12 md:my-16 lg:my-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10">
          <div className="absolute top-0 left-0 w-72 h-72 bg-[var(--primary)] rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-[var(--secondary)] rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--primary-light)] text-[var(--primary-dark)] text-xs font-black uppercase tracking-widest mb-6">
            Fuel Your Progress
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--text-primary)] mb-6 tracking-tighter">
            EAT LIKE A <span className="text-[var(--primary)]">CHAMPION</span>
          </h1>
          <p className="max-w-2xl mx-auto text-[var(--text-secondary)] text-lg">
            Fitness is 30% training and 70% nutrition. Whether you&apos;re bulking,
            cutting, or maintaining, your results start in the kitchen.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        <NutritionMacrosSection />

        <NutritionHydrationTiming />

        <section className="py-10 border-y border-[var(--border-color)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 01
              </h4>
              <p className="font-bold text-[var(--text-primary)]">Avoid Processed Sugars</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 02
              </h4>
              <p className="font-bold text-[var(--text-primary)]">Prioritize Whole Foods</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 03
              </h4>
              <p className="font-bold text-[var(--text-primary)]">Don&apos;t Fear Salt (Electrolytes)</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-xs font-black text-[var(--primary)] uppercase tracking-widest mb-2">
                Tip 04
              </h4>
              <p className="font-bold text-[var(--text-primary)]">Sleep is part of Nutrition</p>
            </div>
          </div>
        </section>

        <section className="pb-10">
          <div className="card-glass bg-[var(--primary)] border-none overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-10 opacity-80 group-hover:scale-110 transition-transform">
              <Apple size={200} />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl font-black mb-4 text-white">READY TO OPTIMIZE?</h2>
              <p className="text-white/80 mb-8 max-w-xl">
                Get a personalized meal plan tailored to your body weight,
                activity level, and fitness goals. Stop guessing, start growing.
              </p>
              <Link href="/dashboard/nutrition-tracker">
                <button className="bg-white text-[var(--primary)] px-8 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-emerald-50 transition-all active:scale-95 shadow-xl cursor-pointer">
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
