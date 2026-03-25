

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

// const monthlyEarnings = [
//   { month: "Sep", amount: 32000 },
//   { month: "Oct", amount: 35000 },
//   { month: "Nov", amount: 38000 },
//   { month: "Dec", amount: 36000 },
//   { month: "Jan", amount: 42000 },
//   { month: "Feb", amount: 45000 },
// ];

// const recentPayments = [
//   { client: "Arif Hossain", amount: "৳5,000", date: "Mar 1", status: "Paid", plan: "Premium" },
//   { client: "Nadia Akter", amount: "৳3,500", date: "Mar 1", status: "Paid", plan: "Standard" },
//   { client: "Kamal Uddin", amount: "৳5,000", date: "Feb 28", status: "Paid", plan: "Premium" },
//   { client: "Rashed Khan", amount: "৳3,500", date: "Feb 28", status: "Pending", plan: "Standard" },
//   { client: "Sabrina Islam", amount: "৳2,500", date: "Feb 25", status: "Paid", plan: "Basic" },
// ];

export default function CoachEarnings() {
  const { data: session } = useSession();
  const { data: coaches = [] } = useQuery({
      queryKey: ["coaches"],
      queryFn: async() => {
      const res = await axios.get("/api/coach");
      return res.data;
      }
  });

  const singleCoach = coaches.find(coach => coach?.email === session?.user?.email);

  const { data: monthlyEarnings } = useQuery({
      queryKey: ["monthlyEarnings"],
      queryFn: async() => {
      const res = await axios.get("/api/monthly-earnings");
      return res.data.data;
      }
  });

  const { data: recentPayments } = useQuery({
      queryKey: ["recentPayments"],
      queryFn: async() => {
      const res = await axios.get("/api/payment");
      return res.data.slice(0, 5);
      }
  });
  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mx-auto space-y-8 max-w-7xl">
          <title>Coach-Earning | Dashboard - Flexify</title>

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1
              className="text-2xl font-extrabold md:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              Earnings
            </h1>

            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
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

              <p
                className="text-sm"
                style={{ color: "var(--text-muted)" }}
              >
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
          <motion.div
            className="lg:col-span-3 card-glass"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex justify-between mb-6">
              <h3
                className="font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Revenue Analytics
              </h3>

              <select
                className="px-2 py-1 text-xs rounded-lg"
                style={{
                  background: "var(--bg-secondary)",
                  color: "var(--text-secondary)",
                }}
              >
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>

            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyEarnings}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />

                  <Tooltip />

                  <Bar dataKey="total" radius={[6, 6, 0, 0]}>
                    {monthlyEarnings?.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === monthlyEarnings?.length - 1
                            ? "var(--primary)"
                            : "#94a3b8"
                        }
                        fillOpacity={
                          index === monthlyEarnings?.length - 1 ? 1 : 0.25
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Recent Payments */}
          <motion.div
            className="flex flex-col lg:col-span-2 card-glass"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3
              className="mb-6 font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              Recent Transactions
            </h3>

            <div className="space-y-5 max-h-[300px] overflow-y-auto">

              {recentPayments?.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 transition rounded-xl hover:bg-gray-500/10"
                >
                  <div className="flex items-center gap-3">

                    <div
                      className="flex items-center justify-center w-10 h-10 text-xs font-bold rounded-full"
                      style={{
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                      }}
                    >
                      {p?.userName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {p?.userName}
                      </p>

                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {p?.planName} Plan
                      </p>
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
                        ${p?.status === "success"
                        ? "text-(--success)"
                          : p?.status === "failed"
                          ? "text-(--danger)"
                        : "text-(--warning)"}`}
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}