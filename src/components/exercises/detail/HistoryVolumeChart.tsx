"use client";

import React from "react";
import { motion } from "framer-motion";
import { HistorySession } from "./mockHistory";

export function HistoryVolumeChart({
  history,
  vol,
}: {
  history: HistorySession[];
  vol: (h: HistorySession) => number;
}) {
  const maxVol = Math.max(...history.map(vol), 1);

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <h3
        className="font-bold text-sm mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Volume Progress
      </h3>
      <div className="flex items-end gap-3" style={{ height: 80 }}>
        {[...history].reverse().map((h, i) => {
          const pct = (vol(h) / maxVol) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full relative" style={{ height: 68 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${pct}%` }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="absolute bottom-0 w-full rounded-t-lg"
                  style={{
                    background: "var(--primary)",
                    opacity: 0.5 + i * 0.18,
                  }}
                />
              </div>
              <p
                className="text-[9px]"
                style={{ color: "var(--text-secondary)" }}
              >
                {h.date.split(",")[0]}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
