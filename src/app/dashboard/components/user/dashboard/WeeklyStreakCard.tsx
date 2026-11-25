"use client";

import React from "react";
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from "recharts";
import { Flame, Trophy, Zap, Activity } from "lucide-react";
import { motion } from "framer-motion";

interface StreakData {
  completedDays: number;
  targetDays: number;
  progress: number;
  isGoalAchieved: boolean;
  totalStreak?: number;
}

interface WeeklyChartProps {
  streak: StreakData | null;
}

const WeeklyConsistencyChart = ({ streak }: WeeklyChartProps) => {
  if (!streak) return null;

  const chartData = [{ value: streak.progress, fill: "var(--primary)" }];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl w-full h-full bg-[var(--bg-secondary)] border border-[var(--border-color)] flex flex-col justify-between  min-h-[320px]"
    >
      <div className="flex justify-between items-center mb-4 shrink-0">
    <div className="flex items-center gap-2">
      <div className="p-1.5 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
        <Activity size={16} />
      </div>
      <h3 className="text-xs font-black uppercase tracking-tight text-[var(--text-primary)]">
        Consistency
      </h3>
    </div>
    <div className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 border border-orange-500/20">
      Weekly
    </div>
  </div>

  <div className="flex-1 flex flex-col justify-center items-center relative min-h-[180px]">
    <div className="relative w-full h-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="75%"
          outerRadius="110%"
          barSize={12}
          data={chartData}
          startAngle={225}
          endAngle={-45}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar
            background={{ fill: "var(--border-color)", opacity: 0.2 }}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>

      {/* Center Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-3xl font-black text-[var(--text-primary)] leading-none">
          {streak.progress}%
        </span>
        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase mt-1">
          Goal Progress
        </span>
      </div>
    </div>
  </div>

      <div className="space-y-2">
        <StatRow icon={<Zap size={14} className="text-yellow-500" />} label="Target" value={`${streak.targetDays} Days`} />
        <StatRow icon={<Flame size={14} className="text-orange-500" />} label="Current" value={`${streak.completedDays} Hit`} />
        <StatRow icon={<Trophy size={14} className="text-blue-500" />} label="Best" value={`${streak.totalStreak || 0} Days`} />
        
        {/* Progress Dots */}
        <div className="flex justify-center gap-1.5 pt-1">
          {Array.from({ length: streak.targetDays }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i < streak.completedDays ? "w-5 bg-[var(--primary)]" : "w-2 bg-[var(--border-color)]"
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const StatRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center justify-between p-2 px-3 rounded-xl bg-[var(--bg-primary)]/40 border border-[var(--border-color)]/50">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-[10px] font-bold text-[var(--text-secondary)]">{label}</span>
    </div>
    <span className="text-[10px] font-black text-[var(--text-primary)]">{value}</span>
  </div>
);

export default WeeklyConsistencyChart;