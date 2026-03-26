"use client";

import { fadeUp, greeting, StatCard } from "@/app/dashboard/page";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  CalendarCheck,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import React from "react";
import ClientProgressChart from "./ClientProgressChart";
import ClientList from "./ClientList";

// 1. Define all necessary interfaces
interface Coach {
  _id: string;
  email: string;
  clients: number;
}

interface MonthlyEarning {
  total: number;
}

interface Review {
  rating: number;
}

interface Trainee {
  progress: number;
}

const CoachDashboard = ({ name }: { name: string }) => {
  const { data: session } = useSession();

  // 2. Type the Coaches Query
  const { data: coaches = [] } = useQuery<Coach[]>({
    queryKey: ["coaches"],
    queryFn: async () => {
      const res = await axios.get("/api/coach");
      return res.data;
    },
  });

  // Fix: Explicitly type 'coach' in find
  const singleCoach = coaches.find(
    (coach: Coach) => coach?.email === session?.user?.email,
  );

  // 3. Type the Earnings Query
  const { data: monthlyEarning } = useQuery<MonthlyEarning[]>({
    queryKey: ["monthlyEarning"],
    queryFn: async () => {
      const res = await axios.get("/api/monthly-earnings");
      return res.data.data;
    },
  });

  // 4. Type the Reviews Query
  const { data: reviews = [] } = useQuery<Review[]>({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axios.get("/api/coach/reviews");
      return res.data;
    },
  });

  // Fix: Add a check for reviews.length to avoid NaN
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r: Review) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  // 5. Type the Trainees Query
  const { data: trainees = [] } = useQuery<Trainee[]>({
    queryKey: ["trainees"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/trainees`);
      return res.data;
    },
  });

  // Fix: Add a check for trainees.length to avoid NaN
  const avgCompletionRate =
    trainees.length > 0
      ? Math.round(
          trainees.reduce((sum, t: Trainee) => sum + t.progress, 0) /
            trainees.length,
        )
      : 0;

const stats = [
  {
    icon: Users,
    label: "Active Clients",
    // Convert number to string using a template literal
    value: String(singleCoach?.clients || 0),
    sub: "2 new this week",
    iconColor: "#4b9eff",
    iconBg: "#dbeeff",
    trend: { val: 20 },
    delay: 0.1,
  },
  {
    icon: CalendarCheck,
    label: "Sessions Today",
    value: "4", // This was already a string
    sub: "Next at 3:00 PM",
    iconColor: "#f47920",
    iconBg: "#fff3e0",
    delay: 0.16,
  },
  {
    icon: MessageSquare,
    label: "Unread Messages",
    value: "7", // This was already a string
    sub: "3 need response",
    iconColor: "#f0a500",
    iconBg: "#fef3c7",
    delay: 0.22,
  },
  {
    icon: Star,
    label: "Avg Rating",
    value: avgRating, // Fixed: .toFixed(1) already returns a string
    sub: `from ${reviews?.length} reviews`,
    iconColor: "#f0a500",
    iconBg: "#fef3c7",
    trend: { val: 2 },
    delay: 0.28,
  },
  {
    icon: TrendingUp,
    label: "Monthly Earnings",
    // The ৳ symbol makes this a string automatically
    value: `৳${monthlyEarning?.[5]?.total || 0}`,
    sub: "this month",
    iconColor: "#27ae60",
    iconBg: "#dcfce7",
    trend: { val: 14 },
    delay: 0.34,
  },
  {
    icon: Zap,
    label: "Completion Rate",
    // The % symbol makes this a string automatically
    value: `${avgCompletionRate}%`,
    sub: "avg across clients",
    iconColor: "#7c5cbf",
    iconBg: "#ede9fe",
    delay: 0.4,
  },
];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <p
          className="text-sm font-medium mb-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {greeting()}, Coach
        </p>
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            color: "var(--text-primary)",
          }}
        >
          {name} 💪
        </h1>
      </motion.div>

      {/* Banner */}
      <motion.div
        {...fadeUp(0.05)}
        className="relative p-5 overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #f0a500 0%, #c17d00 100%)",
        }}
      >
        <div className="absolute w-40 h-40 rounded-full -right-8 -top-8 bg-white/10" />
        <div className="relative z-10">
          <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">
            Today's Schedule
          </p>
          <p className="text-lg font-black text-white">4 Sessions · 6 Hours</p>
          <p className="mt-1 text-xs text-white/70">
            Next: Ali Hassan at 3:00 PM — Hypertrophy Day 3
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Client Progress Chart */}
      <ClientProgressChart />

      {/* Client List */}
      <ClientList />
    </div>
  );
};

export default CoachDashboard;
