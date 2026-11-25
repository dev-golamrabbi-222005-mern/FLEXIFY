"use client";

import { motion } from "framer-motion";
import { DollarSign, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import React from "react";

interface EarningsOverviewStatsProps {
  thisMonthTotal?: number;
  totalClients: number;
  newUsersThisWeek?: number;
}

export default function EarningsOverviewStats({
  thisMonthTotal,
  totalClients,
  newUsersThisWeek,
}: EarningsOverviewStatsProps) {
  const stats = [
    {
      label: "This Month",
      value: `৳${(thisMonthTotal || 0).toLocaleString()}`,
      change: "+7%",
      icon: DollarSign,
    },
    {
      label: "Total Clients",
      value: String(totalClients),
      change: `+${newUsersThisWeek || 0} new`,
      icon: Users,
    },
    {
      label: "Growth Rate",
      value: "12%",
      change: "Last 30 days",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          className="card-glass"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-lg" style={{ background: "var(--primary-light)" }}>
              <s.icon size={18} style={{ color: "var(--primary)" }} />
            </div>
            <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: "var(--primary)" }}>
              <ArrowUpRight size={12} />
              {s.change}
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
