"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
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
import { FaXmark } from "react-icons/fa6";

// 1. Define Interfaces for your data
interface Trainee {
  _id: string;
  name: string;
  userEmail: string;
  image: string;
  plan: string;
  status: string;
  progress: number;
  joined: string;
  avatar: string;
}

interface NewUsersWeekly {
  newUsersThisWeek: number;
}

interface MonthlyEarning {
  _id?: {
    year: number;
    month: number;
    monthName: string;
  };
  month?: string;
  total: number;
}

interface RawPayment {
  _id: string;
  totalPaid: number;
  lastPayment: string;
  status?: "success" | "failed" | "pending";
  user: {
    name: string;
    planName: string;
    planActivated: string;
    planExpiry: string;
    imageUrl: string;
  };
}

interface Payment {
  user: {
    name: string;
    planName: string;
    planActivated: Date;
    planExpiry: Date;
    imageUrl: string;
  };
  totalPaid: string;
  lastPayment: Date;
  status: "success" | "failed" | "pending";
}

export default function CoachEarnings() {
  const { data: session } = useSession();


  // coach is now automatically typed as Coach

  const { data: trainees = [] } = useQuery<Trainee[]>({
    queryKey: ["trainees"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res?.data;
    },
  });

  const {data: weeklyNewUsers} = useQuery<NewUsersWeekly>({
    queryKey: ["weeklyNewUsers"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/new-users-weekly?coachId=${session?.user?.id}`);
      return res?.data;
    },
  });

  const { data: monthlyEarnings = [] } = useQuery<MonthlyEarning[]>({
    queryKey: ["monthlyEarnings"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/earnings?coachId=${session?.user?.id}`);
      return res?.data;
    },
  });

  const [isAllTxModalOpen, setIsAllTxModalOpen] = useState(false);

  const { data: allTransactions = [] } = useQuery<Payment[]>({
    queryKey: ["allTransactions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/user-payments?coachId=${session?.user?.id}`);
      const rawPayments = res?.data ?? [];

      return rawPayments.map((p: RawPayment) => ({
        user: {
          name: p?.user?.name || "Unknown",
          planName: p?.user?.planName || "Unknown",
          planActivated: p?.user?.planActivated ? new Date(p.user.planActivated) : new Date(),
          planExpiry: p?.user?.planExpiry ? new Date(p.user.planExpiry) : new Date(),
          imageUrl: p?.user?.imageUrl || "/default-avatar.png",
        },
        totalPaid: `৳${Number(p?.totalPaid ?? 0).toLocaleString()}`,
        lastPayment: p?.lastPayment ? new Date(p.lastPayment) : new Date(),
        status: (p?.status as "success" | "failed" | "pending") || "success",
      }));
    },
  });

  const recentPayments = allTransactions.slice(0, 5);

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
              value: `৳${monthlyEarnings?.[monthlyEarnings.length - 1]?.total.toLocaleString()}`,
              change: "+7%",
              icon: DollarSign,
            },
            {
              label: "Total Clients",
              value: trainees?.length,
              change: `+${weeklyNewUsers?.newUsersThisWeek} new`,
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
          {/* Chart */}
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Chart Section */}
            <div className="lg:col-span-3">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyEarnings.map((item: MonthlyEarning) => ({
                    month: item?._id?.monthName || item?.month,
                    total: item?.total,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]}>
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
                    <Image src={p?.user?.imageUrl || "/default-avatar.png"} alt={p?.user?.name} width={40} height={40} className="flex items-center justify-center w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-bold" />
                    <div>
                      <p className="text-sm font-semibold">{p?.user?.name}</p>
                      <p className="text-xs text-[var(--text-muted)]">{p?.user?.planName} Plan</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p?.totalPaid}
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
              onClick={() => setIsAllTxModalOpen(true)}
            >
              View All Transactions
            </button>
          </div>
      </div>

      <AnimatePresence>
        {isAllTxModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsAllTxModalOpen(false)}
          >
            <motion.div
              className="w-full max-w-4xl overflow-hidden bg-(--bg-primary) shadow-lg rounded-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-bold">All Transactions</h2>
                <button
                  onClick={() => setIsAllTxModalOpen(false)}
                  className="text-sm cursor-pointer font-semibold text-(--text-primary)"
                >
                  <FaXmark />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="text-xs text-(--text-primary) uppercase bg-(--bg-secondary)">
                    <tr>
                      <th className="px-3 py-2">User</th>
                      <th className="px-3 py-2">Plan</th>
                      <th className="px-3 py-2">Total Paid</th>
                      <th className="px-3 py-2">Last Payment</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTransactions.map((p, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Image
                              src={p.user.imageUrl || "/default-avatar.png"}
                              alt={p.user.name}
                              width={32}
                              height={32}
                              className="rounded-full"
                            />
                            <span className="text-sm font-semibold">{p.user.name}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-sm">{p.user.planName}</td>
                        <td className="px-3 py-2 text-sm">{p.totalPaid}</td>
                        <td className="px-3 py-2 text-sm">{p.lastPayment.toLocaleString()}</td>
                        <td className="px-3 py-2 text-sm uppercase">{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
