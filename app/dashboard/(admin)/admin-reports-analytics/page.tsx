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
} from "recharts";

import { TrendingUp, Users, DollarSign } from "lucide-react";
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

export default function ReportsAnalyticsPage() {
  const {data: users = []} = useQuery({
      queryKey: ["users"],
      queryFn: async() => {
        const res = await axios.get("/api/user?role=user");
        return res.data;
      }
    });
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

      {/* PAGE HEADER */}

      <div className="flex items-center gap-3">
        <TrendingUp size={28} />
        <h1 className="text-2xl md:text-3xl font-bold">
          Reports & Analytics
        </h1>
      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow flex items-center gap-4">
          <Users className="text-blue-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow flex items-center gap-4">
          <TrendingUp className="text-green-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Platform Growth</p>
            <p className="text-2xl font-bold">+32%</p>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-xl shadow flex items-center gap-4">
          <DollarSign className="text-yellow-600" size={28} />
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold">$18,200</p>
          </div>
        </div>

      </div>

      {/* ================= PLATFORM GROWTH ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Platform Growth
        </h2>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={growthData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="users"
                stroke="#10B981"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </section>

      {/* ================= ENGAGEMENT METRICS ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Engagement Metrics
        </h2>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </section>

      {/* ================= REVENUE REPORT ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Revenue Report
        </h2>

        <div className="h-[300px]">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#F97316"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

      </section>

    </div>
  );
}