"use client";

import React from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LabelList,
} from "recharts";
import { Loader2 } from "lucide-react";

// 1. Define a strict interface for the expected data shape
export interface WorkoutStat {
  day: string;
  calories: number;
  workout: number;
}

// 2. Define props interface to replace 'any'
interface DashboardChartsProps {
  data: WorkoutStat[];
  isLoading?: boolean;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  data = [],
  isLoading,
}) => {
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

  /**
   * 3. Type-safe Formatters
   * Recharts LabelList expects a return type of string | number.
   * We use 'unknown' and then check types to satisfy 'no-explicit-any' rules.
   */
  const caloriesFormatter = (value: unknown): string => {
    const num = typeof value === "number" ? value : Number(value);
    return !isNaN(num) && num > 0 ? `${num} kcal` : "";
  };

  const workoutFormatter = (value: unknown): string => {
    const num = typeof value === "number" ? value : Number(value);
    return !isNaN(num) && num > 0 ? `${num}m` : "";
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Weekly Calories Burned Chart */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h3 className="mb-5 text-xs font-black text-[var(--text-primary)] uppercase tracking-widest text-center sm:text-left">
          Weekly Calories Burned
        </h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.2}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
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
                  offset={10}
                  style={{
                    fill: "var(--text-primary)",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                  formatter={caloriesFormatter}
                />
              </Area>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout Min Chart */}
      <div className="p-5 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h3 className="mb-5 text-xs font-black text-[var(--text-primary)] uppercase tracking-widest text-center sm:text-left">
          Workout Min
        </h3>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "var(--border-color)", opacity: 0.1 }}
                contentStyle={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="workout"
                fill="var(--primary)"
                radius={[4, 4, 0, 0]}
                barSize={20}
              >
                <LabelList
                  dataKey="workout"
                  position="top"
                  offset={10}
                  style={{
                    fill: "var(--text-primary)",
                    fontSize: 10,
                    fontWeight: "bold",
                  }}
                  formatter={workoutFormatter}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
