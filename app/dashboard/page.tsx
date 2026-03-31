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
  Link,
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
import CoachDashboard from "./components/coach/dashboard/CoachDashboard";
import UserDashboard from "./components/user/dashboard/UserDashboard";
import AdminDashboard from "./components/admin/Admin-Dashboard";


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



// ─── Helpers ─────────────────────────────────────────────────────────────────
export const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: {
    delay,
    duration: 0.45,
    ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
});

export function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export function StatCard({
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
export function SectionHeader({ title, action, link }: { title: string; action?: string; link?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3
        className="text-base font-black"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </h3>
      {action && link && (
        <button
          className="text-xs font-bold hover:underline"
          style={{ color: "var(--primary)" }}
        >
          <Link href={link}>{action}</Link>
        </button>
      )}
    </div>
  );
}

// ─── Chart Container ──────────────────────────────────────────────────────────
export function ChartCard({
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




// ══════════════════════════════════════════════════════════════════════════════
// ─── MAIN EXPORT ──────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════════════
export default function Dashboard() {
const { data: session } = useSession();
  
  const { data: dbUser, isLoading } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  if (isLoading) return null;

  const role = dbUser?.role;
  const userName = dbUser?.name ?? "User";

  return (
    <div className="max-w-full">
      {role === "user" && <UserDashboard name={userName} />}
      {role === "coach" && <CoachDashboard name={userName} />}
      {role === "admin" && <AdminDashboard name={userName} />}
    </div>
  );
}