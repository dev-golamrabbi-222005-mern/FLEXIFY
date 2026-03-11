"use client";

import { useState } from "react";
import { UserCheck, AlertTriangle, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from "recharts";

export default function CoachManagementPage() {
  const [coaches, setCoaches] = useState([
    {
      id: 1,
      name: "Coach Rahim",
      clients: 45,
      rating: 4.8,
      status: "Active",
    },
    {
      id: 2,
      name: "Coach Karim",
      clients: 30,
      rating: 4.2,
      status: "Active",
    },
    {
      id: 3,
      name: "Coach Jony",
      clients: 12,
      rating: 3.5,
      status: "Warning",
    },
  ]);

  const warnCoach = (id) => {
    setCoaches(
      coaches.map((coach) =>
        coach.id === id ? { ...coach, status: "Warning" } : coach
      )
    );
  };

  const removeCoach = (id) => {
    setCoaches(coaches.filter((coach) => coach.id !== id));
  };

  const performanceData = [
    { month: "Jan", sessions: 120 },
    { month: "Feb", sessions: 180 },
    { month: "Mar", sessions: 220 },
    { month: "Apr", sessions: 200 },
    { month: "May", sessions: 260 },
    { month: "Jun", sessions: 300 },
  ];

  const clientGrowth = [
    { month: "Jan", clients: 50 },
    { month: "Feb", clients: 80 },
    { month: "Mar", clients: 120 },
    { month: "Apr", clients: 160 },
    { month: "May", clients: 210 },
    { month: "Jun", clients: 260 },
  ];

  const stats = [
    {
      title: "Approved Coaches",
      value: coaches.length,
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Performance Monitoring",
      value: "Active",
      icon: Activity,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Warnings Issued",
      value: coaches.filter((c) => c.status === "Warning").length,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-6 md:mt-10 bg-[var(--bg-primary)] space-y-8">

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow"
            >
              <div className="flex justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
                >
                  <Icon size={20} />
                </div>
              </div>

              <h4 className="text-sm text-[var(--text-secondary)]">
                {stat.title}
              </h4>

              <p className="text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* Performance Chart */}

        <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow text-[var(--text-primary)]">

          <h3 className="font-semibold mb-4">Coach Performance</h3>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sessions"
                stroke="#3b82f6"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* Client Growth */}

        <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow text-[var(--text-primary)]">

          <h3 className="font-semibold mb-4">Client Growth</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={clientGrowth}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="clients" fill="#10b981" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>

        </div>

      </div>

      {/* ================= COACH TABLE ================= */}

      <section className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow">

        <h2 className="text-lg md:text-xl font-bold mb-6">
          Approved Coaches
        </h2>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[600px] border-collapse">

            <thead className="border-b text-left">
              <tr>
                <th className="py-3 text-sm md:text-base">Name</th>
                <th className="text-sm md:text-base">Clients</th>
                <th className="text-sm md:text-base">Rating</th>
                <th className="text-sm md:text-base">Status</th>
                <th className="text-sm md:text-base">Action</th>
              </tr>
            </thead>

            <tbody>

              {coaches.map((coach) => (
                <tr key={coach.id} className="border-b">

                  <td className="py-3 text-sm md:text-base">
                    {coach.name}
                  </td>

                  <td className="text-sm md:text-base">
                    {coach.clients}
                  </td>

                  <td className="text-sm md:text-base">
                    {coach.rating}
                  </td>

                  <td>
                    <span
                      className={`px-2 py-1 text-xs md:text-sm rounded-full ${
                        coach.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {coach.status}
                    </span>
                  </td>

                  <td className="space-x-2 md:space-x-3">

                    <button
                      onClick={() => warnCoach(coach.id)}
                      className="text-yellow-600 text-xs md:text-sm"
                    >
                      Warn
                    </button>

                    <button
                      onClick={() => removeCoach(coach.id)}
                      className="text-red-600 text-xs md:text-sm"
                    >
                      Remove
                    </button>

                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}