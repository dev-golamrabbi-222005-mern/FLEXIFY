"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";
import { useSession } from "next-auth/react";

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

// 1. Define Interfaces for your data
interface Coach {
  email: string;
  maxClients: number;
  userName?: string;
}

interface MonthlyEarning {
  month: string;
  total: number;
}

interface Payment {
  userName: string;
  planName: string;
  amount: string;
  status: "success" | "failed" | "pending";
}

export default function CoachEarnings() {
  const { data: session } = useSession();

  // 2. Apply interfaces to useQuery
  const { data: coaches = [] } = useQuery<Coach[]>({
    queryKey: ["coaches"],
    queryFn: async () => {
      const res = await axios.get("/api/coach");
      return res.data;
    },
  });

  // coach is now automatically typed as Coach
  const singleCoach = coaches.find(
    (coach) => coach?.email === session?.user?.email,
  );

  const { data: monthlyEarnings = [] } = useQuery<MonthlyEarning[]>({
    queryKey: ["monthlyEarnings"],
    queryFn: async () => {
      const res = await axios.get("/api/monthly-earnings");
      return res.data.data;
    },
  });

  const { data: recentPayments = [] } = useQuery<Payment[]>({
    queryKey: ["recentPayments"],
    queryFn: async () => {
      const res = await axios.get("/api/payment");
      return res.data.slice(0, 5);
    },
  });

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mx-auto space-y-8 max-w-7xl">
          <title>Earning | Dashboard - Flexify</title>

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1
              className="text-2xl font-extrabold md:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              Earnings
            </h1>

            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Overview of your financial performance and subscriptions.
            </p>
          </div>

          <button className="flex items-center gap-2 btn-primary">
            <CreditCard size={16} />
            Withdraw Funds
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              label: "This Month",
              value: `৳${monthlyEarnings?.[5]?.total}`,
              change: "+7%",
              icon: DollarSign,
            },
            {
              label: "Total Clients",
              value: singleCoach?.maxClients,
              change: "+3 new",
              icon: Users,
            },
            {
              label: "Growth Rate",
              value: "12%",
              change: "Last 30 days",
              icon: TrendingUp,
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              className="card-glass"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ background: "var(--primary-light)" }}
                >
                  <s.icon size={18} style={{ color: "var(--primary)" }} />
                </div>

                <span
                  className="flex items-center gap-1 text-xs font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  <ArrowUpRight size={12} />
                  {s.change}
                </span>
              </div>

              <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>

              <p
                className="text-2xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Chart + Payments */}
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Chart */}
         <div className="grid gap-8 lg:grid-cols-5">
          {/* Chart Section */}
          <div className="lg:col-span-3">
             <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {/* Fix 1 & 2: Use _ for unused param and explicit types for index */}
                    {monthlyEarnings.map((_, index: number) => (
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
          
{/* Recent Payments Section */}
          <div className="lg:col-span-2">
            {recentPayments.map((p: Payment, i: number) => ( // Fix 4 & 5: Explicit types
              <div key={i} className="flex items-center justify-between p-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold">
                    {p.userName
                      .split(" ")
                      .map((n: string) => n[0]) // Fix 6: Explicit string type
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.userName}</p>
                    <p className="text-xs text-[var(--text-muted)]">{p.planName} Plan</p>
                  </div>
                </div>

                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p?.amount}
                    </p>

                    <p
                      className={`text-[10px] font-bold uppercase
                        ${
                          p?.status === "success"
                            ? "text-(--success)"
                            : p?.status === "failed"
                              ? "text-(--danger)"
                              : "text-(--warning)"
                        }`}
                    >
                      {p?.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="pt-5 mt-auto text-sm font-semibold"
              style={{ color: "var(--primary)" }}
            >
              View All Transactions
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
