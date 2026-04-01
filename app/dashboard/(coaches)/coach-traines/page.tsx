"use client";

import { Search, Filter, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";

interface Trainee {
  _id: string;
  name: string;
  userEmail: string;
  image: string;
  plan: string;
  createdAt: Date;
}

// Helper function to get date range
const getDateRange = (days: number | null) => {
  if (!days) return { start: null, end: null };
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - days);
  return { start, end };
};

export default function CoachTrainees() {
  const {data: session} = useSession();
  const [search, setSearch] = useState("");
  const [selectedDays, setSelectedDays] = useState<number | null>(null);

  // 2. Add <Trainee[]> to useQuery
  const { data: trainees = [] } = useQuery<Trainee[]>({
    queryKey: ["trainees", search, selectedDays],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  // Filter by date range and search
  const filtered = trainees?.filter((t: Trainee) => {
    const nameMatch = t.name.toLowerCase().includes(search.toLowerCase());
    
    if (!selectedDays) return nameMatch;
    
    const { start, end } = getDateRange(selectedDays);
    const traineeDate = new Date(t.createdAt);
    const dateMatch = traineeDate >= start! && traineeDate <= end!;
    
    return nameMatch && dateMatch;
  });

  return (
    <>
      <div className="max-w-full space-y-8">
        <title>Traines | Dashboard - Flexify</title>

        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              My Trainees
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              {filtered?.length} total clients
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute -translate-y-1/2 left-3 top-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            placeholder="Search trainees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        {/* Date Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedDays(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              selectedDays === null ? "ring-2" : ""
            }`}
            style={{
              background: selectedDays === null ? "var(--primary)" : "var(--bg-secondary)",
              color: selectedDays === null ? "white" : "var(--text-primary)",
              border: selectedDays === null ? "none" : "1px solid var(--border-color)",
            }}
          >
            All
          </button>
          {[
            { label: "Last 24 hours", days: 1 },
            { label: "Last 7 days", days: 7 },
            { label: "Last 15 days", days: 15 },
            { label: "Last 30 days", days: 30 },
            { label: "Last 90 days", days: 90 },
          ].map(({ label, days }) => (
            <button
              key={days}
              onClick={() => setSelectedDays(days)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedDays === days ? "ring-2" : ""
              }`}
              style={{
                background: selectedDays === days ? "var(--primary)" : "var(--bg-secondary)",
                color: selectedDays === days ? "white" : "var(--text-primary)",
                border: selectedDays === days ? "none" : "1px solid var(--border-color)",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t: Trainee, i: number) => (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <div className="block p-5 card-glass group">
                {/* Top */}
                <div className="flex justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={t.image} alt={t.name}
                      className="flex items-center justify-center text-sm font-bold rounded-full w-11 h-11"
                    />
                    <div>
                      <h3
                        className="text-sm font-semibold group-hover:underline"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {t.name}
                      </h3>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {t.userEmail}
                      </p>
                    </div>
                  </div>
                  <button className="p-1 rounded-lg hover:bg-gray-500/10">
                    <MoreVertical size={16} />
                  </button>
                </div>

                {/* Plan + Status */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span
                    className="px-2 py-1 text-xs rounded-full"
                    style={{
                      background: "rgba(var(--primary-rgb), 0.1)",
                      color: "var(--primary)",
                    }}
                  >
                    {t.plan}
                  </span>
                </div>

                <p
                  className="mt-3 text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  Joined {new Date(t.createdAt).toLocaleString()}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
