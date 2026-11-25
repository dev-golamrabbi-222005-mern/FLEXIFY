"use client";

import React from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, CartesianGrid
} from "recharts";
import { BarChart3, LineChart as GrowthIcon } from "lucide-react";

interface AnalyticsChartsGridProps {
  userGrowth?: { month: string; users: number }[];
  engagementData?: { name: string; value: number }[];
}

export default function AnalyticsChartsGrid({
  userGrowth,
  engagementData,
}: AnalyticsChartsGridProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      <div className="card-glass p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--primary)]">
          <GrowthIcon size={20} /> Platform Growth
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userGrowth}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
            <YAxis allowDecimals={false} axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
              }}
            />
            <Line type="monotone" dataKey="users" stroke="var(--primary)" strokeWidth={4} dot={{ r: 6, fill: "var(--primary)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card-glass p-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 text-[var(--secondary)]">
          <BarChart3 size={20} /> Content Engagement
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.3} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
            <YAxis axisLine={false} tickLine={false} fontSize={12} stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "12px",
              }}
            />
            <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
