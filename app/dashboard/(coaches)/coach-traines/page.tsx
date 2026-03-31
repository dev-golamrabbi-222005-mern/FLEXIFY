"use client";

import { Search, Filter, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import axios from "axios";

// 1. Define the Trainee interface
interface Trainee {
  _id: string;
  name: string;
  userEmail: string;
  image: string;
  plan: string;
  createdAt: Date;
}

export default function CoachTrainees() {
  const {data: session} = useSession();
  const [search, setSearch] = useState("");

  // 2. Add <Trainee[]> to useQuery
  const { data: trainees = [] } = useQuery<Trainee[]>({
    queryKey: ["trainees", search],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  // 3. Fix: Add type 'Trainee' to the filter parameter
  const filtered = trainees?.filter((t: Trainee) =>
    t.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="space-y-8 max-w-full">
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
              {trainees?.length} total clients
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex gap-3">
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
          <button
            className="p-2.5 rounded-xl"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <Filter size={16} />
          </button>
        </div>

        {/* Grid - Using 'filtered' instead of 'trainees' to support search logic */}
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
                      background: "rgba(var(--primary-rgb), 0.1)", // Assuming a CSS variable for the RGB values exists
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
