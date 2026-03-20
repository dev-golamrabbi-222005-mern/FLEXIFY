"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { TrendingUp, Activity, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const growthData = [
  { month: "Jan", users: 120 },
  { month: "Feb", users: 200 },
  { month: "Mar", users: 350 },
  { month: "Apr", users: 500 },
  { month: "May", users: 650 },
  { month: "Jun", users: 820 },
];

const engagementData = [
  { name: "Workouts", value: 400 },
  { name: "Programs", value: 300 },
  { name: "Challenges", value: 200 },
  { name: "Coaching", value: 150 },
];

const revenueData = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2500 },
  { month: "Apr", revenue: 3200 },
  { month: "May", revenue: 4100 },
  { month: "Jun", revenue: 5200 },
];

const COLORS = ["#3B82F6", "#10B981", "#F97316", "#8B5CF6"];

export default function ReportsAnalyticsPage() {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/api/user?role=user");
      return res.data;
    },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-8 bg-[var(--bg-primary)] min-h-screen">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold tracking-wide">Analytics Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Overview of platform performance</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Users</p>
            <h2 className="text-2xl font-bold">{users.length}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white">
            <TrendingUp size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Engagement</p>
            <h2 className="text-2xl font-bold">1.2K</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-600 text-white">
            <Activity size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Revenue</p>
            <h2 className="text-2xl font-bold">$5,200</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white">
            <DollarSign size={22} />
          </div>
        </div>

      </div>

      {/* CHARTS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* LINE CHART */}
        <div className="bg-[var(--card-bg)] p-5 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">📈 Platform Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growthData}>
              <XAxis dataKey="month" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* BAR CHART */}
        <div className="bg-[var(--card-bg)] p-5 rounded-2xl shadow hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">📊 Engagement</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={engagementData}>
              <XAxis dataKey="name" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PIE CHART */}
        <div className="bg-[var(--card-bg)] p-5 rounded-2xl shadow md:col-span-2 hover:shadow-xl transition">
          <h2 className="text-lg font-semibold mb-3 text-center">💰 Revenue Distribution</h2>
          <div className="flex justify-center">
            <ResponsiveContainer width={300} height={260}>
              <PieChart>
                <Pie
                  data={revenueData}
                  dataKey="revenue"
                  nameKey="month"
                  outerRadius={90}
                  label
                >
                  {revenueData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </section>
    </div>
  );
}