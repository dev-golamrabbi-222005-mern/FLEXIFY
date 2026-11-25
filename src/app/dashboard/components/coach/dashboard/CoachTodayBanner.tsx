"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/app/dashboard/components/dashboard-shared";
import React from "react";

interface Session {
  day: number;
  month: number;
  year: number;
  time: string;
  client: string;
  type: string;
}

interface CoachTodayBannerProps {
  todaySessions?: Session[];
  formatTime12h: (time: string) => string;
}

export default function CoachTodayBanner({
  todaySessions,
  formatTime12h,
}: CoachTodayBannerProps) {
  return (
    <motion.div
      {...fadeUp(0.05)}
      className="relative p-5 overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(135deg, #f0a500 0%, #c17d00 100%)",
      }}
    >
      <div className="absolute w-40 h-40 rounded-full -right-8 -top-8 bg-white/10" />
      <div className="relative z-10">
        <p className="text-white/70 text-[11px] font-black uppercase tracking-widest mb-1">
          Today&apos;s Schedule
        </p>
        <p className="text-lg font-black text-white">
          {todaySessions?.length || 0} Sessions
        </p>
        {todaySessions?.map((s, i) => (
          <p key={i} className="mt-1 text-xs text-white/70">
            Next: {s.client} at {formatTime12h(s.time)} — {s.type}
          </p>
        ))}
      </div>
    </motion.div>
  );
}
