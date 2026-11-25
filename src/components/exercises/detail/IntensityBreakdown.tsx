"use client";

import React from "react";
import { motion } from "framer-motion";

export function IntensityBreakdown({
  peakBpm,
  zones,
}: {
  peakBpm: number;
  zones: { warmup: number; fatBurn: number; cardio: number; peak: number };
}) {
  const zoneMax = Math.max(...Object.values(zones));

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.32 }}
      className="rounded-3xl p-5"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-start justify-between mb-1">
        <div>
          <h3
            className="font-black text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            Intensity Breakdown
          </h3>
          <p
            className="text-xs mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            Peak: {peakBpm} bpm
          </p>
        </div>
        <div
          className="px-2.5 py-1 rounded-full text-[11px] font-black"
          style={{ background: "#dcfce7", color: "#16a34a" }}
        >
          ↗ +5% vs last week
        </div>
      </div>
      <div className="flex gap-3 mt-5 px-2" style={{ height: 100 }}>
        {[
          {
            label: "WARMUP",
            pct: (zones.warmup / zoneMax) * 100,
            color: "#ffd0b0",
          },
          {
            label: "FAT BURN",
            pct: (zones.fatBurn / zoneMax) * 100,
            color: "#ffb07a",
          },
          {
            label: "CARDIO",
            pct: (zones.cardio / zoneMax) * 100,
            color: "#f47920",
          },
          {
            label: "PEAK",
            pct: (zones.peak / zoneMax) * 100,
            color: "#c45d10",
          },
        ].map((z, i) => (
          <div
            key={z.label}
            className="flex flex-col items-center gap-2 flex-1"
          >
            <div
              className="w-full relative rounded-t-xl overflow-hidden"
              style={{ height: 80, background: `${z.color}20` }}
            >
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${z.pct}%` }}
                transition={{
                  delay: 0.5 + i * 0.08,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute bottom-0 w-full rounded-t-xl"
                style={{ background: z.color }}
              />
            </div>
            <span
              className="text-[9px] font-black uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              {z.label}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
