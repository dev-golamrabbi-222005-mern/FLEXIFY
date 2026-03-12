"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  Salad,
  Moon,
  Flame,
  Droplets,
  Trophy,
  TrendingUp,
  Users,
  DollarSign,
  ShieldCheck,
  CalendarCheck,
  MessageSquare,
  Star,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Zap,
  UserCheck,
  PackageCheck,
  CreditCard,
  BarChart3,
} from "lucide-react";
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
} from "recharts";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = "user" | "coach" | "admin";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const USER_WEEKLY = [
  { day: "Mon", calories: 420, workout: 45 },
  { day: "Tue", calories: 380, workout: 30 },
  { day: "Wed", calories: 510, workout: 60 },
  { day: "Thu", calories: 290, workout: 0 },
  { day: "Fri", calories: 460, workout: 50 },
  { day: "Sat", calories: 540, workout: 75 },
  { day: "Sun", calories: 310, workout: 20 },
];

const COACH_CLIENT_PROGRESS = [
  { name: "Ali", progress: 82 },
  { name: "Sara", progress: 67 },
  { name: "James", progress: 91 },
  { name: "Mia", progress: 54 },
  { name: "Rafi", progress: 76 },
];

const ADMIN_REVENUE = [
  { month: "Aug", revenue: 4200, users: 38 },
  { month: "Sep", revenue: 5800, users: 52 },
  { month: "Oct", revenue: 5100, users: 47 },
  { month: "Nov", revenue: 6700, users: 61 },
  { month: "Dec", revenue: 7400, users: 68 },
  { month: "Jan", revenue: 8900, users: 79 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconColor,
  iconBg,
  trend,
  delay = 0,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  iconColor: string;
  iconBg: string;
  trend?: { val: number };
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="flex flex-col gap-3 p-5 transition-transform duration-200 cursor-default rounded-2xl hover:-translate-y-1"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-start justify-between">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ backgroundColor: iconBg }}
        >
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        {trend && (
          <div
            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{
              background: trend.val >= 0 ? "#dcfce7" : "#fee2e2",
              color: trend.val >= 0 ? "#16a34a" : "#dc2626",
            }}
          >
            {trend.val >= 0 ? (
              <ArrowUpRight size={12} />
            ) : (
              <ArrowDownRight size={12} />
            )}
            {Math.abs(trend.val)}%
          </div>
        )}
      </div>
      <div>
        <p
          className="text-[11px] font-black uppercase tracking-wider mb-1"
          style={{ color: "var(--text-secondary)" }}
        >
          {label}
        </p>
        <p
          className="text-2xl font-black leading-none"
          style={{ color: "var(--text-primary)" }}
        >
          {value}
        </p>
        {sub && (
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title, action }: { title: string; action?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3
        className="text-base font-black"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      {action && (
        <button
          className="text-xs font-bold hover:underline"
          style={{ color: "var(--primary)" }}
        >
          {action}
        </button>
      )}
    </div>
  );
}

// ─── Chart Container ──────────────────────────────────────────────────────────
function ChartCard({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className="p-5 rounded-2xl"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <h3
        className="mb-5 text-sm font-black"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 text-xs shadow-lg rounded-xl"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <p className="mb-1 font-black" style={{ color: "var(--text-primary)" }}>
        {label}
      </p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── USER DASHBOARD ───────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function UserDashboard({ name }: { name: string }) {
  const todayStats = [
    {
      icon: Dumbbell,
      label: "Exercises",
      value: "10",
      sub: "1h 50m",
      iconColor: "#f47920",
      iconBg: "#fff3e0",
      trend: { val: 12 },
      delay: 0.1,
    },
    {
      icon: Salad,
      label: "Calories",
      value: "1,600",
      sub: "kcal eaten",
      iconColor: "#27ae60",
      iconBg: "#dcfce7",
      trend: { val: 5 },
      delay: 0.16,
    },
    {
      icon: Flame,
      label: "Burned",
      value: "480",
      sub: "kcal burned",
      iconColor: "#e74c3c",
      iconBg: "#fee2e2",
      trend: { val: 8 },
      delay: 0.22,
    },
    {
      icon: Moon,
      label: "Sleep",
      value: "8h 20m",
      sub: "Last night",
      iconColor: "#7c5cbf",
      iconBg: "#ede9fe",
      delay: 0.28,
    },
    {
      icon: Droplets,
      label: "Water",
      value: "6 / 8",
      sub: "glasses",
      iconColor: "#4b9eff",
      iconBg: "#dbeeff",
      delay: 0.34,
    },
    {
      icon: Trophy,
      label: "Streak",
      value: "14 days",
      sub: "Keep it up!",
      iconColor: "#f0a500",
      iconBg: "#fef3c7",
      trend: { val: 3 },
      delay: 0.4,
    },
  ];

  const recentWorkouts = [
    { name: "Barbell Squats", duration: "45 min", cal: 210, date: "Today" },
    {
      name: "Romanian Deadlift",
      duration: "30 min",
      cal: 180,
      date: "Yesterday",
    },
    { name: "Leg Press", duration: "25 min", cal: 150, date: "2 days ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <motion.div {...fadeUp(0)}>
        <p
          className="text-sm font-medium mb-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {greeting()},
        </p>
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            color: "var(--text-primary)",
          }}
        >
          {name} 👋
        </h1>
      </motion.div>

      {/* Today's Goal Banner */}
      <motion.div
        {...fadeUp(0.05)}
        className="relative p-5 overflow-hidden rounded-2xl"
        style={{
          background:
            "linear-gradient(135deg, var(--primary) 0%, #c45d10 100%)",
        }}
      >
        <div className="absolute w-40 h-40 rounded-full -right-8 -top-8 bg-white/10" />
        <div className="absolute w-24 h-24 rounded-full -right-4 -bottom-4 bg-white/5" />
        <div className="relative z-10 flex items-center justify-between gap-4">
          <div>
            <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">
              Today's Goal
            </p>
            <p className="text-lg font-black leading-tight text-white">
              Build Muscles — Leg Day
            </p>
            <p className="mt-1 text-xs text-white/70">
              3 of 5 exercises completed
            </p>
          </div>
          <div className="shrink-0">
            <svg width="56" height="56" viewBox="0 0 56 56">
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="5"
              />
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke="white"
                strokeWidth="5"
                strokeDasharray={`${2 * Math.PI * 24 * 0.6} ${2 * Math.PI * 24 * 0.4}`}
                strokeDashoffset={2 * Math.PI * 24 * 0.25}
                strokeLinecap="round"
                style={{
                  transform: "rotate(-90deg)",
                  transformOrigin: "28px 28px",
                }}
              />
              <text
                x="28"
                y="33"
                textAnchor="middle"
                fill="white"
                fontSize="13"
                fontWeight="900"
              >
                60%
              </text>
            </svg>
          </div>
        </div>
        <div className="relative z-10 mt-4 h-1.5 rounded-full bg-white/20">
          <div className="h-full w-[60%] rounded-full bg-white" />
        </div>
      </motion.div>

      {/* Stat Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {todayStats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard title="Weekly Calorie Intake" delay={0.2}>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={USER_WEEKLY}>
              <defs>
                <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f47920" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#f47920" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="calories"
                name="Calories"
                stroke="#f47920"
                strokeWidth={2.5}
                fill="url(#calGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Workout Duration (min)" delay={0.25}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={USER_WEEKLY} barSize={24}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border-color)"
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="workout"
                name="Minutes"
                fill="#f47920"
                radius={[6, 6, 0, 0]}
                opacity={0.9}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Recent Workouts */}
      <motion.div
        {...fadeUp(0.3)}
        className="p-5 rounded-2xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <SectionHeader title="Recent Workouts" action="View All" />
        <div className="space-y-2">
          {recentWorkouts.map((w, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-xl"
                  style={{ background: "var(--primary)15" }}
                >
                  <Dumbbell size={16} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {w.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {w.date} · {w.duration}
                  </p>
                </div>
              </div>
              <span
                className="text-sm font-black"
                style={{ color: "var(--primary)" }}
              >
                {w.cal} kcal
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── COACH DASHBOARD ──────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
function CoachDashboard({ name }: { name: string }) {
  const stats = [
    {
      icon: Users,
      label: "Active Clients",
      value: "12",
      sub: "2 new this week",
      iconColor: "#4b9eff",
      iconBg: "#dbeeff",
      trend: { val: 20 },
      delay: 0.1,
    },
    {
      icon: CalendarCheck,
      label: "Sessions Today",
      value: "4",
      sub: "Next at 3:00 PM",
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
      value: "4.9",
      sub: "from 38 reviews",
      iconColor: "#f0a500",
      iconBg: "#fef3c7",
      trend: { val: 2 },
      delay: 0.28,
    },
    {
      icon: TrendingUp,
      label: "Monthly Earnings",
      value: "৳18,400",
      sub: "this month",
      iconColor: "#27ae60",
      iconBg: "#dcfce7",
      trend: { val: 14 },
      delay: 0.34,
    },
    {
      icon: Zap,
      label: "Completion Rate",
      value: "94%",
      sub: "avg across clients",
      iconColor: "#7c5cbf",
      iconBg: "#ede9fe",
      delay: 0.4,
    },
  ];

  const clients = [
    {
      name: "Ali Hassan",
      plan: "Hypertrophy",
      nextSession: "Today 3 PM",
      status: "on-track",
    },
    {
      name: "Sara Khan",
      plan: "Fat Loss",
      nextSession: "Tomorrow 10 AM",
      status: "needs-attention",
    },
    {
      name: "James Lee",
      plan: "Strength",
      nextSession: "Wed 5 PM",
      status: "excellent",
    },
    {
      name: "Mia Patel",
      plan: "Endurance",
      nextSession: "Thu 8 AM",
      status: "on-track",
    },
  ];

  const statusStyle: Record<
    string,
    { bg: string; color: string; label: string }
  > = {
    excellent: { bg: "#dcfce7", color: "#16a34a", label: "Excellent" },
    "on-track": { bg: "#dbeeff", color: "#2563eb", label: "On Track" },
    "needs-attention": {
      bg: "#fee2e2",
      color: "#dc2626",
      label: "Needs Attention",
    },
  };

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
      <ChartCard title="Client Progress Overview" delay={0.2}>
        <div className="space-y-3">
          {COACH_CLIENT_PROGRESS.map((c, i) => (
            <div key={i} className="flex items-center gap-3">
              <span
                className="w-12 text-xs font-bold shrink-0"
                style={{ color: "var(--text-secondary)" }}
              >
                {c.name}
              </span>
              <div
                className="flex-1 h-2 rounded-full"
                style={{ background: "var(--border-color)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${c.progress}%` }}
                  transition={{
                    delay: 0.3 + i * 0.08,
                    duration: 0.7,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="h-full rounded-full"
                  style={{
                    background:
                      c.progress > 80
                        ? "#27ae60"
                        : c.progress > 60
                          ? "#f47920"
                          : "#f0a500",
                  }}
                />
              </div>
              <span
                className="w-10 text-xs font-black text-right"
                style={{ color: "var(--text-primary)" }}
              >
                {c.progress}%
              </span>
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Client List */}
      <motion.div
        {...fadeUp(0.3)}
        className="p-5 rounded-2xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <SectionHeader title="Your Clients" action="View All" />
        <div className="space-y-2">
          {clients.map((c, i) => {
            const s = statusStyle[c.status];
            return (
              <div
                key={i}
                className="flex items-center justify-between py-3 border-b last:border-0"
                style={{ borderColor: "var(--border-color)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center text-sm font-black text-white rounded-full w-9 h-9"
                    style={{
                      background: "linear-gradient(135deg, #f0a500, #f47920)",
                    }}
                  >
                    {c.name[0]}
                  </div>
                  <div>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {c.name}
                    </p>
                    <p
                      className="text-[11px]"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {c.plan} · {c.nextSession}
                    </p>
                  </div>
                </div>
                <span
                  className="text-[10px] font-black px-2.5 py-1 rounded-full"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── ADMIN DASHBOARD ──────────────────────────────────────════════════════════
// ══════════════════════════════════════════════════════════════════════════════
function AdminDashboard({ name }: { name: string }) {
  const {data: users = []} = useQuery({
    queryKey: ["users"],
    queryFn: async() => {
      const res = await axios.get("/api/user?role=user");
      return res.data;
    }
  });
  const {data: coaches = []} = useQuery({
    queryKey: ["coaches"],
    queryFn: async() => {
      const res = await axios.get("/api/coach");
      return res.data;
    }
  });
  const {data: activeCoaches = []} = useQuery({
    queryKey: ["activeCoaches"],
    queryFn: async() => {
      const res = await axios.get("/api/coach?status=approved");
      return res.data;
    }
  });
  const {data: pendingCoaches = []} = useQuery({
    queryKey: ["pendingCoaches"],
    queryFn: async() => {
      const res = await axios.get("/api/coach?status=pending");
      return res.data;
    }
  });
  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: users.length,
      sub: "+79 this month",
      iconColor: "#4b9eff",
      iconBg: "#dbeeff",
      trend: { val: 18 },
      delay: 0.1,
    },
    {
      icon: UserCheck,
      label: "Active Coaches",
      value: activeCoaches.length,
      sub: `${pendingCoaches.length} pending approval`,
      iconColor: "#f47920",
      iconBg: "#fff3e0",
      delay: 0.16,
    },
    {
      icon: DollarSign,
      label: "Monthly Revenue",
      value: "৳89k",
      sub: "vs ৳74k last mo.",
      iconColor: "#27ae60",
      iconBg: "#dcfce7",
      trend: { val: 20 },
      delay: 0.22,
    },
    {
      icon: PackageCheck,
      label: "Active Packages",
      value: "24",
      sub: "3 modified today",
      iconColor: "#7c5cbf",
      iconBg: "#ede9fe",
      delay: 0.28,
    },
    {
      icon: CreditCard,
      label: "Transactions",
      value: "142",
      sub: "last 7 days",
      iconColor: "#f0a500",
      iconBg: "#fef3c7",
      trend: { val: 9 },
      delay: 0.34,
    },
    {
      icon: ShieldCheck,
      label: "Platform Health",
      value: "99.9%",
      sub: "uptime this month",
      iconColor: "#27ae60",
      iconBg: "#dcfce7",
      delay: 0.4,
    },
  ];

  const recentActions = [
    {
      action: "Coach approved",
      detail: "Rahul Sharma — Hypertrophy Specialist",
      time: "2m ago",
      dot: "#27ae60",
    },
    {
      action: "Package modified",
      detail: "Premium Plan — updated by Coach Ali",
      time: "18m ago",
      dot: "#f0a500",
    },
    {
      action: "User banned",
      detail: "User #3821 — spam activity detected",
      time: "1h ago",
      dot: "#e74c3c",
    },
    {
      action: "CS Token issued",
      detail: "Sara Khan → Coach James Lee",
      time: "2h ago",
      dot: "#4b9eff",
    },
    {
      action: "New registration",
      detail: "42 new users signed up today",
      time: "3h ago",
      dot: "#f47920",
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
          {greeting()}, Admin
        </p>
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            color: "var(--text-primary)",
          }}
        >
          {name} 🖥️
        </h1>
      </motion.div>

      {/* Alert Banner */}
      <motion.div
        {...fadeUp(0.05)}
        className="relative p-5 overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(135deg, #7c5cbf 0%, #5a3d99 100%)",
        }}
      >
        <div className="absolute w-40 h-40 rounded-full -right-8 -top-8 bg-white/10" />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">
              Platform Summary
            </p>
            <p className="text-lg font-black text-white">
              {users.length} Users · {coaches.length} Coaches · ৳89k Revenue
            </p>
            <p className="mt-1 text-xs text-white/70">
              {pendingCoaches.length} coach applications pending your review
            </p>
          </div>
          <button className="px-4 py-2 text-xs font-black text-white transition-colors shrink-0 rounded-xl bg-white/20 hover:bg-white/30">
            Review Now →
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Revenue Chart */}
      <ChartCard title="Revenue & User Growth (6 months)" delay={0.2}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={ADMIN_REVENUE} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "var(--text-secondary)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="revenue"
              name="Revenue (৳)"
              fill="#7c5cbf"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
            <Bar
              dataKey="users"
              name="New Users"
              fill="#f47920"
              radius={[6, 6, 0, 0]}
              barSize={18}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Activity Log */}
      <motion.div
        {...fadeUp(0.3)}
        className="p-5 rounded-2xl"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <SectionHeader title="Recent Activity" action="View All Logs" />
        <div className="space-y-0">
          {recentActions.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-3 py-3 border-b last:border-0"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div
                className="mt-1.5 w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: a.dot }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {a.action}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {a.detail}
                </p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Clock size={11} style={{ color: "var(--text-secondary)" }} />
                <span
                  className="text-[11px]"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {a.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
  const { data: session } = useSession();
  const role = (session?.role as Role) ?? "user";
  const name = session?.user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="max-w-4xl mx-auto">
      {role === "user" && <UserDashboard name={name} />}
      {role === "coach" && <CoachDashboard name={name} />}
      {role === "admin" && <AdminDashboard name={name} />}
    </div>
  );
}
