"use client";

import React from "react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  Tooltip, ResponsiveContainer, CartesianGrid, LabelList 
} from "recharts";
import { Loader2 } from "lucide-react";

export const DashboardCharts = ({ data = [], isLoading }: { data: any[], isLoading?: boolean }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="h-[260px] bg-[var(--bg-secondary)] animate-pulse rounded-2xl border border-[var(--border-color)] flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--primary)]" />
        </div>
        <div className="h-[260px] bg-[var(--bg-secondary)] animate-pulse rounded-2xl border border-[var(--border-color)] flex items-center justify-center">
          <Loader2 className="animate-spin text-[var(--primary)]" />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Weekly Calories Burned Chart */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h3 className="mb-5 text-xs font-black text-[var(--text-primary)] uppercase tracking-widest text-center sm:text-left">
          Weekly Calories Burned
        </h3>
        <ResponsiveContainer width="100%" aspect={2}>
          <AreaChart data={data} margin={{ top: 20 }}>
            <defs>
              <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="day" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Area 
              type="monotone" 
              dataKey="calories" 
              stroke="var(--primary)" 
              fill="url(#calGrad)" 
              strokeWidth={2.5} 
              dot={{ r: 4, fill: "var(--primary)" }}
            >
              <LabelList 
                dataKey="calories" 
                position="top" 
                style={{ fill: 'var(--text-primary)', fontSize: 10, fontWeight: 'bold' }}
                formatter={(val: number) => val > 0 ? `${val} kcal` : ''} 
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Workout Min Chart */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h3 className="mb-5 text-xs font-black text-[var(--text-primary)] uppercase tracking-widest text-center sm:text-left">
          Workout Min
        </h3>
        <ResponsiveContainer width="100%" aspect={2}>
          <BarChart data={data} margin={{ top: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
            <XAxis dataKey="day" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="workout" fill="var(--primary)" radius={[4, 4, 0, 0]} barSize={20}>
              <LabelList 
                dataKey="workout" 
                position="top" 
                style={{ fill: 'var(--text-primary)', fontSize: 10, fontWeight: 'bold' }}
                formatter={(val: number) => val > 0 ? `${val}m` : ''} 
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};