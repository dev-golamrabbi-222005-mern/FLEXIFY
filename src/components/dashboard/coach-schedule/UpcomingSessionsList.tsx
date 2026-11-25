"use client";

import { motion } from "framer-motion";
import React from "react";

interface Session {
  day: number;
  month: number;
  year: number;
  time: string;
  type: string;
  clientInfo?: { name: string };
}

interface UpcomingSessionsListProps {
  upcomingSessions: Session[];
  formatTime12h: (time: string) => string;
}

export default function UpcomingSessionsList({
  upcomingSessions,
  formatTime12h,
}: UpcomingSessionsListProps) {
  return (
    <motion.div
      className="card-glass"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <h3 className="mb-4 font-semibold" style={{ color: "var(--text-primary)" }}>
        Upcoming Sessions
      </h3>

      <div className="space-y-3">
        {upcomingSessions.map((s, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-xl"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
          >
            <div>
              <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                {s?.clientInfo?.name}
              </span>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.type}</p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs" style={{ color: "var(--primary)" }}>
                {formatTime12h(s.time)}
              </span>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(s.year, s.month - 1).toLocaleString("default", { month: "long" })} {s.day}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
