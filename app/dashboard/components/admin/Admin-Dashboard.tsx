import { motion } from "framer-motion";
import {
  Dumbbell,
  Salad,
  Moon,
  Flame,
  Droplets,
  Trophy,
  Users,
  DollarSign,
  ShieldCheck,
  TrendingUp,
  CalendarCheck,
  MessageSquare,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  UserCheck,
  PackageCheck,
  CreditCard,
} from "lucide-react";
import {
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
import { ChartCard, fadeUp, greeting, SectionHeader, StatCard } from "../../page";



const ADMIN_REVENUE = [
  { month: "Aug", revenue: 4200, users: 38 },
  { month: "Sep", revenue: 5800, users: 52 },
  { month: "Oct", revenue: 5100, users: 47 },
  { month: "Nov", revenue: 6700, users: 61 },
  { month: "Dec", revenue: 7400, users: 68 },
  { month: "Jan", revenue: 8900, users: 79 },
];
interface TooltipEntry {
  dataKey: string | number;
  name: string;
  value: string | number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
}
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
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
        {String(label ?? "")}
      </p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}


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
export default AdminDashboard