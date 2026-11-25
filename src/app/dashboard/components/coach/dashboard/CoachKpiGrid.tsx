"use client";

import React from "react";
import { Users, CalendarCheck, MessageSquare, Star, TrendingUp, Zap } from "lucide-react";
import { StatCard } from "@/app/dashboard/components/dashboard-shared";

interface CoachKpiGridProps {
  totalClients: number;
  newUsersThisWeek?: number;
  sessionsToday: number;
  nextSessionTime?: string;
  avgRating: string;
  reviewsCount: number;
  monthlyEarnings: number;
  avgCompletionRate: number;
}

export default function CoachKpiGrid({
  totalClients,
  newUsersThisWeek,
  sessionsToday,
  nextSessionTime,
  avgRating,
  reviewsCount,
  monthlyEarnings,
  avgCompletionRate,
}: CoachKpiGridProps) {
  const stats = [
    {
      icon: Users,
      label: "Active Clients",
      value: String(totalClients),
      sub: `${newUsersThisWeek || 0} new this week`,
      iconColor: "#4b9eff",
      iconBg: "#dbeeff",
      trend: { val: 20 },
      delay: 0.1,
    },
    {
      icon: CalendarCheck,
      label: "Sessions Today",
      value: String(sessionsToday),
      sub: nextSessionTime ? `Next at ${nextSessionTime}` : "No session today",
      iconColor: "#f47920",
      iconBg: "#fff3e0",
      delay: 0.16,
    },
    {
      icon: MessageSquare,
      label: "Unread Messages",
      value: "7",
      sub: "3 need response",
      iconColor: "#f0a500",
      iconBg: "#fef3c7",
      delay: 0.22,
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: avgRating,
      sub: `from ${reviewsCount} reviews`,
      iconColor: "#f0a500",
      iconBg: "#fef3c7",
      trend: { val: 2 },
      delay: 0.28,
    },
    {
      icon: TrendingUp,
      label: "Monthly Earnings",
      value: `৳${monthlyEarnings.toLocaleString()}`,
      sub: "this month",
      iconColor: "#27ae60",
      iconBg: "#dcfce7",
      trend: { val: 14 },
      delay: 0.34,
    },
    {
      icon: Zap,
      label: "Completion Rate",
      value: `${avgCompletionRate}%`,
      sub: "avg across clients",
      iconColor: "#7c5cbf",
      iconBg: "#ede9fe",
      delay: 0.4,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6 lg:gap-6">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
