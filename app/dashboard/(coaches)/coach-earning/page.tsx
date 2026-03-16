

"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  CreditCard,
} from "lucide-react";

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

const monthlyEarnings = [
  { month: "Sep", amount: 32000 },
  { month: "Oct", amount: 35000 },
  { month: "Nov", amount: 38000 },
  { month: "Dec", amount: 36000 },
  { month: "Jan", amount: 42000 },
  { month: "Feb", amount: 45000 },
];

const recentPayments = [
  { client: "Arif Hossain", amount: "৳5,000", date: "Mar 1", status: "Paid", plan: "Premium" },
  { client: "Nadia Akter", amount: "৳3,500", date: "Mar 1", status: "Paid", plan: "Standard" },
  { client: "Kamal Uddin", amount: "৳5,000", date: "Feb 28", status: "Paid", plan: "Premium" },
  { client: "Rashed Khan", amount: "৳3,500", date: "Feb 28", status: "Pending", plan: "Standard" },
  { client: "Sabrina Islam", amount: "৳2,500", date: "Feb 25", status: "Paid", plan: "Basic" },
];

export default function CoachEarnings() {
  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              Earnings
            </h1>

            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              Overview of your financial performance and subscriptions.
            </p>
          </div>

          <button className="btn-primary flex items-center gap-2">
            <CreditCard size={16} />
            Withdraw Funds
          </button>
        </div>

        {/* Stats */}
        <div className="grid gap-6 md:grid-cols-3">

          {[
            {
              label: "This Month",
              value: "৳45,000",
              change: "+7%",
              icon: DollarSign,
            },
            {
              label: "Total Clients",
              value: "24",
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
                  className="text-xs flex items-center gap-1 font-semibold"
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
        <div className="grid lg:grid-cols-5 gap-8">

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
                className="text-xs px-2 py-1 rounded-lg"
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

                  <Bar dataKey="amount" radius={[6, 6, 0, 0]}>
                    {monthlyEarnings.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={
                          index === monthlyEarnings.length - 1
                            ? "var(--primary)"
                            : "#94a3b8"
                        }
                        fillOpacity={
                          index === monthlyEarnings.length - 1 ? 1 : 0.25
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
            className="lg:col-span-2 card-glass flex flex-col"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3
              className="font-bold mb-6"
              style={{ color: "var(--text-primary)" }}
            >
              Recent Transactions
            </h3>

            <div className="space-y-5 max-h-[300px] overflow-y-auto">

              {recentPayments.map((p, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center p-2 rounded-xl hover:bg-gray-500/10 transition"
                >
                  <div className="flex items-center gap-3">

                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{
                        background: "var(--primary-light)",
                        color: "var(--primary)",
                      }}
                    >
                      {p.client
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {p.client}
                      </p>

                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {p.plan} Plan
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {p.amount}
                    </p>

                    <p
                      className="text-[10px] font-bold uppercase"
                      style={{
                        color:
                          p.status === "Paid"
                            ? "var(--primary)"
                            : "var(--warning)",
                      }}
                    >
                      {p.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="mt-auto pt-5 text-sm font-semibold"
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