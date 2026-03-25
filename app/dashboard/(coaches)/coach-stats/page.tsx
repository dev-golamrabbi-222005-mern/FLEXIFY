"use client";

import {
  Users,
  UserCheck,
  UserPlus,
  CalendarCheck,
} from "lucide-react";

export default function CoachStatsSection() {
  const stats = [
    {
      title: "Total Clients",
      value: "124",
      icon: Users,
      color: "from-blue-500 to-indigo-500",
    },
    {
      title: "Active Clients",
      value: "96",
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Pending Requests",
      value: "12",
      icon: UserPlus,
      color: "from-orange-500 to-amber-500",
    },
    {
      title: "Today Sessions",
      value: "8",
      icon: CalendarCheck,
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <div
            key={index}
            className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition"
          >
             <title>Coach-Stats | Dashboard - Flexify</title>
            <div className="flex items-center justify-between mb-4">

              <div
                className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
              >
                <Icon size={22} />
              </div>

            </div>

            <h4 className="text-sm text-[var(--text-primary)]">{stat.title}</h4>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}