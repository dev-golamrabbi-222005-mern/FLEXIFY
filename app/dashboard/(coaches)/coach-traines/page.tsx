
"use client";


import { Search, Filter, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";


const trainees = [
  { id: "1", name: "Arif Hossain", email: "arif@email.com", plan: "Muscle Building", status: "Active", progress: 85, joined: "Jan 2025", avatar: "A" },
  { id: "2", name: "Nadia Akter", email: "nadia@email.com", plan: "Weight Loss", status: "Active", progress: 72, joined: "Feb 2025", avatar: "N" },
  { id: "3", name: "Kamal Uddin", email: "kamal@email.com", plan: "Strength Training", status: "Active", progress: 90, joined: "Dec 2024", avatar: "K" },
  { id: "4", name: "Sabrina Islam", email: "sabrina@email.com", plan: "Yoga & Flexibility", status: "Paused", progress: 65, joined: "Mar 2025", avatar: "S" },
  { id: "5", name: "Rashed Khan", email: "rashed@email.com", plan: "Cardio Fitness", status: "Active", progress: 78, joined: "Jan 2025", avatar: "R" },
  { id: "6", name: "Fatima Begum", email: "fatima@email.com", plan: "Post-natal Fitness", status: "Active", progress: 55, joined: "Feb 2025", avatar: "F" },
];

export default function CoachTrainees() {
  const [search, setSearch] = useState("");

  const filtered = trainees.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
<>

      <div className="max-w-7xl mx-auto px-4 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          <div>
            <h1
              className="text-2xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              My Trainees
            </h1>

            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              {trainees.length} total clients
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="flex gap-3">

          <div className="flex-1 relative">

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2"
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filtered.map((t, i) => (

            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >

              <div
                
                className="block card-glass p-5 group"
              >

                {/* Top */}
                <div className="flex justify-between mb-4">

                  <div className="flex items-center gap-3">

                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "var(--primary)",
                        color: "white",
                      }}
                    >
                      {t.avatar}
                    </div>

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
                        {t.email}
                      </p>

                    </div>

                  </div>

                  <button
                    className="p-1 rounded-lg hover:bg-gray-500/10"
                  >
                    <MoreVertical size={16} />
                  </button>

                </div>

                {/* Plan + Status */}
                <div className="flex flex-wrap gap-2 mb-4">

                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background: "var(--primary-light)",
                      color: "var(--primary)",
                    }}
                  >
                    {t.plan}
                  </span>

                  <span
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      background:
                        t.status === "Active"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(245,158,11,0.15)",
                      color:
                        t.status === "Active"
                          ? "#10b981"
                          : "#f59e0b",
                    }}
                  >
                    {t.status}
                  </span>

                </div>

                {/* Progress */}
                <div className="flex items-center gap-2">

                  <div
                    className="flex-1 h-1.5 rounded-full"
                    style={{ background: "var(--bg-secondary)" }}
                  >

                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${t.progress}%`,
                        background: "var(--primary)",
                      }}
                    />

                  </div>

                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t.progress}%
                  </span>

                </div>

                <p
                  className="text-xs mt-3"
                  style={{ color: "var(--text-muted)" }}
                >
                  Joined {t.joined}
                </p>

              </div>

            </motion.div>

          ))}

        </div>

      </div>

    </>
  );
}