"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  sub?: string;
  iconColor: string;
  iconBg: string;
  trend?: { val: number };
  delay?: number;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

export const GreetingHeader = ({ name }: { name: string }) => {
  const h = new Date().getHours();
  const greet = h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
  return (
    <motion.div {...fadeUp(0)}>
      <p className="text-sm font-medium mb-0.5 text-[var(--text-secondary)]">{greet},</p>
      <h1 className="font-black tracking-tight text-[var(--text-primary)]" style={{ fontSize: "clamp(22px, 4vw, 32px)" }}>{name} 👋</h1>
    </motion.div>
  );
};

export const TodayGoalCard = ({ 
  planName, 
  progress = 0, 
  onSetGoal 
}: { 
  planName?: string; 
  progress?: number;
  onSetGoal: () => void;
}) => (
  <motion.div {...fadeUp(0.05)} className={`relative p-5 overflow-hidden rounded-2xl ${planName ? 'bg-gradient-to-br from-[var(--primary)] to-[#c45d10]' : 'bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)]'}`}>
    <div className="relative z-10 flex items-center justify-between gap-4">
      <div className={planName ? "text-white" : "text-[var(--text-secondary)]"}>
        <p className="text-[11px] font-black uppercase tracking-widest mb-1 opacity-70">Today's Goal</p>
        {planName ? (
          <>
            <p className="text-lg font-black leading-tight">Focus: {planName}</p>
            <p className="mt-1 text-xs opacity-70">{progress}% completed</p>
          </>
        ) : (
          <div>
            <p className="text-base font-bold">No goal set for today</p>
            <button onClick={onSetGoal} className="mt-2 text-xs font-black text-[var(--primary)] uppercase">Set a Target +</button>
          </div>
        )}
      </div>
      {planName && <div className="shrink-0 font-black text-xl text-white">{progress}%</div>}
    </div>
    
    {planName && (
      <div className="relative z-10 mt-4 h-1.5 rounded-full bg-white/20 overflow-hidden">
        <div className="h-full bg-white transition-all duration-700" style={{ width: `${progress}%` }} />
      </div>
    )}
  </motion.div>
);
export const StatCard = ({ icon: Icon, label, value, sub, iconColor, iconBg, trend, delay = 0 }: StatCardProps) => (
  <motion.div {...fadeUp(delay)} className="flex flex-col gap-3 p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
    <div className="flex items-start justify-between">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl" style={{ backgroundColor: iconBg }}>
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: trend.val >= 0 ? "#dcfce7" : "#fee2e2", color: trend.val >= 0 ? "#16a34a" : "#dc2626" }}>
          {trend.val >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(trend.val)}%
        </div>
      )}
    </div>
    <div>
      <p className="text-[11px] font-black uppercase tracking-wider mb-1 text-[var(--text-secondary)]">{label}</p>
      <p className="text-2xl font-black leading-none text-[var(--text-primary)]">{value}</p>
      {sub && <p className="mt-1 text-xs text-[var(--text-secondary)]">{sub}</p>}
    </div>
  </motion.div>
);