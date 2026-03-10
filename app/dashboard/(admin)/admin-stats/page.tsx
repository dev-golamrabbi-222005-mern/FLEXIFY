"use client";

import {Users, UserCheck, CreditCard, DollarSign, UserPlus} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,} from "recharts";

export default function AdminStatsSection() {
  const stats = [
    {
      title: "Total Users",
      value: "1,245",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Active Coaches",
      value: "58",
      icon: UserCheck,
      color: "from-emerald-500 to-green-500",
    },
    {
      title: "Active Subscriptions",
      value: "892",
      icon: CreditCard,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Monthly Revenue",
      value: "$12,430",
      icon: DollarSign,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "New Signups Today",
      value: "34",
      icon: UserPlus,
      color: "from-cyan-500 to-sky-500",
    },
  ];

  const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 6000 },
  { month: "Mar", revenue: 8000 },
  { month: "Apr", revenue: 7500 },
  { month: "May", revenue: 9000 },
  { month: "Jun", revenue: 12000 },
];

const userGrowthData = [
  { month: "Jan", users: 200 },
  { month: "Feb", users: 350 },
  { month: "Mar", users: 500 },
  { month: "Apr", users: 700 },
  { month: "May", users: 950 },
  { month: "Jun", users: 1200 },
];

const subscriptionData = [
  { name: "Basic", value: 400 },
  { name: "Pro", value: 300 },
  { name: "Premium", value: 200 },
];

const COLORS = ["#3b82f6", "#8b5cf6", "#f97316"];

  return (
    <div className="mt-6 md:mt-8 bg-[var(--bg-primary)] md:px-4 py-6 rounded-2xl shadow">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
              >
                <Icon size={22} />
              </div>
            </div>

            <h4 className="text-sm text-[var(--text-secondary)]">{stat.title}</h4>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        );
      })}
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-10">

      {/* Monthly Revenue */}
      <div className="bg-[var(--card-bg)] p-2 md:p-6 rounded-2xl shadow text-[var(--text-primary)]">
        <h3 className="font-semibold mb-4">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={revenueData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Growth */}
      <div className="bg-[var(--card-bg)] p-2 md:p-6 rounded-2xl shadow text-[var(--text-primary)]">
        <h3 className="font-semibold mb-4">User Growth</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={userGrowthData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="users" fill="#10b981" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Subscription Pie */}
      <div className="bg-[var(--card-bg)] p-2 md:p-6 rounded-2xl shadow text-[var(--text-primary)]">
        <h3 className="font-semibold mb-4">Subscription Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={subscriptionData}
              dataKey="value"
              nameKey="name"
              outerRadius={80}
              label
            >
              {subscriptionData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Heatmap */}
      <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow text-[var(--text-primary)]">
        <h3 className="font-semibold mb-4">Activity Heatmap</h3>

        <div className="grid grid-cols-7 gap-1 md:gap-2">
          {Array.from({ length: 35 }).map((_, index) => {
            const intensity = Math.floor(Math.random() * 4);
            const colors = [
              "bg-gray-200",
              "bg-green-200",
              "bg-green-400",
              "bg-green-600",
            ];
            return (
              <div
                key={index}
                className={`h-4 w-4 md:h-6 md:w-6 rounded ${colors[intensity]}`}
              />
            );
          })}
        </div>
      </div>

    </div>
    </div>
  );
}