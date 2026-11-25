"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface MonthlyEarning {
  _id?: { monthName: string };
  month?: string;
  total: number;
}

interface EarningsChartSectionProps {
  monthlyEarnings: MonthlyEarning[];
}

export default function EarningsChartSection({ monthlyEarnings }: EarningsChartSectionProps) {
  const chartData = monthlyEarnings.map((item) => ({
    month: item?._id?.monthName || item?.month,
    total: item?.total,
  }));

  return (
    <div className="lg:col-span-3">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="total" radius={[6, 6, 0, 0]}>
            {monthlyEarnings.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={index === monthlyEarnings.length - 1 ? "var(--primary)" : "#94a3b8"}
                fillOpacity={index === monthlyEarnings.length - 1 ? 1 : 0.25}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
