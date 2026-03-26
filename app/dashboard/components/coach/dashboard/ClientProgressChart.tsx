"use client";

import { ChartCard } from "@/app/dashboard/page";
import React from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

// 1. Define the interface for progress data
interface ClientProgress {
  name: string;
  progress: number;
}

const ClientProgressChart = () => {
  // 2. Add the <ClientProgress[]> type to useQuery
  const { data: clients = [] } = useQuery<ClientProgress[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/trainees`);
      return res.data;
    },
  });

  return (
    <ChartCard title="Client Progress Overview" delay={0.2}>
      <div className="space-y-3">
        {/* 3. Explicitly type the map parameters */}
        {clients?.map((c: ClientProgress, i: number) => (
          <div key={i} className="flex items-center gap-3">
            <span
              className="w-16 text-xs font-bold shrink-0"
              style={{ color: "var(--text-secondary)" }}
            >
              {c.name}
            </span>
            <div
              className="flex-1 h-2 rounded-full"
              style={{ background: "var(--border-color)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${c.progress}%` }}
                transition={{
                  delay: 0.3 + i * 0.08,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full"
                style={{
                  background:
                    c.progress > 80
                      ? "#10b981"
                      : c.progress > 60
                        ? "#f0a500"
                        : c.progress > 40
                          ? "#f47920"
                          : "#ef4444",
                }}
              />
            </div>
            <span
              className="w-10 text-xs font-black text-right"
              style={{ color: "var(--text-primary)" }}
            >
              {c.progress}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
};

export default ClientProgressChart;
