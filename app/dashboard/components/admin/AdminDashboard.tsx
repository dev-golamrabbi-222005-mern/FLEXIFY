"use client";

import { motion } from "framer-motion";
import { Users, UserCheck, DollarSign, CreditCard, ShieldCheck, Clock, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { fadeUp, greeting, StatCard, ChartCard, SectionHeader } from "../../page";

interface DashboardStats {
  totalUsers: number;
  activeCoaches: number;
  pendingCoaches: number;
  totalRevenue: number;
  totalTransactions: number;
  health: string;
}

interface Activity {
  action: string;
  detail: string;
  time: string;
  dot: string;
}

interface ChartData {
  month: string;
  revenue: number;
  users: number;
}

interface DashboardResponse {
  stats: DashboardStats;
  activities: Activity[];
  chartData: ChartData[];
}

export default function AdminDashboard({ name }: { name: string }) {
  const { data, isLoading, error } = useQuery<DashboardResponse>({
    queryKey: ["admin-overview"],
    queryFn: async () => (await axios.get("/api/admin/overview")).data,
    refetchInterval: 60000,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={40} />
        <p className="text-[var(--text-secondary)] font-medium">Fetching flexify insights...</p>
      </div>
    );
  }

  if (error || !data) return <div className="p-10 text-center text-red-500">Failed to load admin data.</div>;

  const { stats, activities, chartData } = data;

  const statConfig = [
    { icon: Users, label: "Total Users", value: stats.totalUsers.toString(), iconColor: "#4b9eff", iconBg: "#dbeeff", delay: 0.1 },
    { icon: UserCheck, label: "Active Coaches", value: stats.activeCoaches.toString(), sub: `${stats.pendingCoaches} pending`, iconColor: "#f47920", iconBg: "#fff3e0", delay: 0.16 },
    { icon: DollarSign, label: "Total Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, iconColor: "#27ae60", iconBg: "#dcfce7", delay: 0.22 },
    { icon: CreditCard, label: "Transactions", value: stats.totalTransactions.toString(), iconColor: "#f0a500", iconBg: "#fef3c7", delay: 0.28 },
    { icon: ShieldCheck, label: "Platform Health", value: stats.health, iconColor: "#27ae60", iconBg: "#dcfce7", delay: 0.34 },
  ];

  return (
    <div className="space-y-6">
      <motion.div {...fadeUp(0)}>
        <p className="leading-relaxed mb-2 text-[var(--text-secondary)]">
          {greeting()}, Admin
        </p>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          {name} 🖥️
        </h1>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {statConfig.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <ChartCard title="Revenue & Growth Overview" delay={0.2}>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "var(--bg-tertiary)" }}
                contentStyle={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border-color)",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "var(--text-primary)",
                }}
                itemStyle={{ fontWeight: "bold" }}
              />
              <Bar
                dataKey="revenue"
                name="Revenue"
                fill="#7c5cbf"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="users"
                name="New Users"
                fill="#f47920"
                radius={[4, 4, 0, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>

      <motion.div
        {...fadeUp(0.3)}
        className="p-6 rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-color)]"
      >
        <SectionHeader
          title="System Activity"
          action="View Records"
          link="/dashboard/admin/logs"
        />
        <div className="mt-4 space-y-4">
          {activities.length > 0 ? (
            activities.map((a, i) => (
              <div
                key={i}
                className="flex items-start gap-4 pb-4 border-b border-[var(--border-color)] last:border-0 last:pb-0"
              >
                <div
                  className="mt-1.5 w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: a.dot }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[var(--text-primary)]">
                    {a.action}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] truncate">
                    {a.detail}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                  <Clock size={12} />
                  <span className="text-[10px] font-medium">{a.time}</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-center text-[var(--text-secondary)] py-4">
              No recent activity.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}