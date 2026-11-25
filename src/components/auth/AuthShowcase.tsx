"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Trophy, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

interface FitnessGoal {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  calories: string;
  protein: string;
  split: string;
  color: string;
}

const GOALS: FitnessGoal[] = [
  {
    id: "muscle",
    title: "Hypertrophy & Muscle",
    icon: "🏋️",
    tagline: "High-protein hypertrophy programming with progressive overload.",
    calories: "2,850 kcal/day",
    protein: "165g protein",
    split: "5-day Upper/Lower Split",
    color: "#10b981",
  },
  {
    id: "fatloss",
    title: "Accelerated Fat Loss",
    icon: "⚡",
    tagline: "Metabolic conditioning with dynamic deficit and heart rate zones.",
    calories: "2,150 kcal/day",
    protein: "145g protein",
    split: "4-day Strength + HIIT",
    color: "#f59e0b",
  },
  {
    id: "athletic",
    title: "Peak Athleticism",
    icon: "🏆",
    tagline: "Hybrid endurance, explosive mobility, and strength endurance.",
    calories: "2,550 kcal/day",
    protein: "155g protein",
    split: "6-day Hybrid Functional",
    color: "#3b82f6",
  },
];

export function AuthShowcase() {
  const [activeGoal, setActiveGoal] = useState<FitnessGoal>(GOALS[0]);

  return (
    <div className="w-full max-w-lg flex flex-col justify-between h-full py-12 relative z-10">
      {/* Background radial glows */}
      <div
        className="absolute -top-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: activeGoal.color }}
      />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full blur-3xl opacity-15 pointer-events-none bg-emerald-500" />

      {/* Header section */}
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-emerald-400 mb-6 backdrop-blur-md">
          <Sparkles size={13} className="text-emerald-400 animate-pulse" />
          <span>Next-Gen Fitness Intelligence</span>
        </div>

        <h2 className="text-3xl xl:text-4xl font-black text-white tracking-tight leading-tight mb-3">
          Transform Your Body & Mind With{" "}
          <span
            className="transition-colors duration-500"
            style={{ color: activeGoal.color }}
          >
            Intelligent Coaching
          </span>
        </h2>
        <p className="text-sm xl:text-base text-gray-400 leading-relaxed font-normal mb-8">
          Adaptive workout routines, live nutrition tracking, and certified coach mentoring in one unified ecosystem.
        </p>
      </div>

      {/* Interactive Goal Preview Card */}
      <div className="my-auto space-y-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center justify-between">
          <span>Choose Your Training Focus</span>
          <span className="text-emerald-400 font-bold">Interactive Preview</span>
        </p>

        {/* Goal selector tabs */}
        <div className="grid grid-cols-3 gap-2">
          {GOALS.map((g) => {
            const active = g.id === activeGoal.id;
            return (
              <button
                key={g.id}
                onClick={() => setActiveGoal(g)}
                className="py-2.5 px-3 rounded-xl text-left border transition-all cursor-pointer relative overflow-hidden"
                style={{
                  background: active ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)",
                  borderColor: active ? g.color : "rgba(255,255,255,0.08)",
                }}
              >
                <span className="text-lg block mb-1">{g.icon}</span>
                <span
                  className="text-xs font-bold block truncate"
                  style={{ color: active ? "#ffffff" : "rgba(255,255,255,0.6)" }}
                >
                  {g.title.split(" ")[0]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Animated Detail Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeGoal.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl relative"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} style={{ color: activeGoal.color }} />
                AI Generated Blueprint
              </span>
              <span
                className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{
                  background: `${activeGoal.color}20`,
                  color: activeGoal.color,
                }}
              >
                Adaptive Plan
              </span>
            </div>

            <p className="text-xs text-gray-300 mb-4 leading-relaxed font-normal">
              {activeGoal.tagline}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/10">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Target</p>
                <p className="text-xs font-black text-white">{activeGoal.calories}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Macro</p>
                <p className="text-xs font-black text-white">{activeGoal.protein}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400">Split</p>
                <p className="text-xs font-black text-white truncate">{activeGoal.split.split(" ")[0]}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating Trust Metrics */}
      <div className="pt-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>256-Bit SSL Encrypted</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span>14.8k+ Athletes</span>
          <span>·</span>
          <span>1.2M+ Workouts</span>
        </div>
      </div>
    </div>
  );
}
