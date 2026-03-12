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
import { ObjectId } from "mongodb";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export default function CoachManagementPage() {
  // const [coaches, setCoaches] = useState([
  //   {
  //     id: 1,
  //     name: "Coach Rahim",
  //     clients: 45,
  //     rating: 4.8,
  //     status: "Active",
  //   },
  //   {
  //     id: 2,
  //     name: "Coach Karim",
  //     clients: 30,
  //     rating: 4.2,
  //     status: "Active",
  //   },
  //   {
  //     id: 3,
  //     name: "Coach Jony",
  //     clients: 12,
  //     rating: 3.5,
  //     status: "Warning",
  //   },
  // ]);

  const {data: coaches = [], refetch} = useQuery({
    queryKey: ["coaches"],
    queryFn: async() => {
      const res = await axios.get("/api/coach?status=approved");
      return res.data;
    }
  });

  const warnCoach = (id: ObjectId) => {
    // setCoaches(
    //   coaches.map((coach) =>
    //     coach.id === id ? { ...coach, status: "Warning" } : coach
    //   )
    // );
    try{
      axios.patch("/api/coach/warn", {
        id,
        status: "warning"
      });
      refetch();
      Swal.fire("Warned", "Coach warned by admin", "success");
    }
    catch(error){
      Swal.fire("Error", error.message, "error");
    }
  };

  const removeCoach = (id: ObjectId) => {
    // setCoaches(coaches.filter((coach) => coach.id !== id));
    try{
      axios.patch("/api/coach/reject", {
        id,
        status: "rejected"
      });
      refetch();
      Swal.fire("Removed", "Coach removed by admin", "success");
    }
    catch(error){
      Swal.fire("Error", error.message, "error");
    }
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
      value: coaches.filter((c) => c.status === "warning").length,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 mt-6 md:mt-10 bg-[var(--bg-primary)] space-y-8">

      {/* ================= STATS ================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-6">
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

              <p className="mt-1 text-xl font-bold md:text-2xl">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* ================= CHARTS ================= */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 md:gap-8">

        {/* Performance Chart */}

        <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow text-[var(--text-primary)]">

          <h3 className="mb-4 font-semibold">Coach Performance</h3>

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

          <h3 className="mb-4 font-semibold">Client Growth</h3>

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

     <section className="space-y-6">

  <h2 className="mb-4 text-xl font-bold">Approved Coaches</h2>

  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    {coaches.map((coach) => (
      <div
        key={coach._id}
        className="bg-[var(--card-bg)] p-6 rounded-2xl shadow hover:shadow-lg transition flex flex-col justify-between gap-3"
      >
        {/* COACH INFO */}
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{coach.fullName}</h3>
          <p className="text-sm text-gray-500">Clients: {coach.maxClients}</p>
          <p className="text-sm text-gray-500">Rating: {coach.rating ?? 0}</p>

          {/* STATUS BADGE */}
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
              coach.status === "approved"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {coach.status}
          </span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex flex-wrap gap-3 mt-3">
          <button
            onClick={() => warnCoach(coach._id)}
            className="text-sm text-yellow-600 transition hover:underline"
          >
            Warn
          </button>

          <button
            onClick={() => removeCoach(coach._id)}
            className="text-sm text-red-600 transition hover:underline"
          >
            Remove
          </button>
        </div>
      </div>
    ))}
  </div>
</section>
    </div>
  );
}