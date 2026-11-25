"use client";

import React from "react";
import { motion } from "framer-motion";

export function MusclesTab({
  primaryMuscles,
  secondaryMuscles,
}: {
  primaryMuscles: string[];
  secondaryMuscles: string[];
}) {
  const all = [
    ...primaryMuscles.map((m) => ({ name: m, role: "Primary" })),
    ...secondaryMuscles.map((m) => ({ name: m, role: "Secondary" })),
  ];

  const style = {
    Primary: {
      bg: "var(--primary)12",
      color: "var(--primary)",
      border: "var(--primary)25",
      icon: "🔴",
    },
    Secondary: {
      bg: "#f0a50012",
      color: "#f0a500",
      border: "#f0a50030",
      icon: "🟡",
    },
  } as Record<
    string,
    { bg: string; color: string; border: string; icon: string }
  >;

  return (
    <div className="space-y-4">
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
          Muscles Activated
        </h3>
        {all.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            No muscle data available.
          </p>
        ) : (
          <div className="space-y-2">
            {all.map((m, i) => {
              const s = style[m.role] ?? style.Secondary;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between p-3 rounded-xl"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.icon}</span>
                    <span
                      className="text-sm font-semibold capitalize"
                      style={{ color: s.color }}
                    >
                      {m.name}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md"
                    style={{ background: s.bg, color: s.color }}
                  >
                    {m.role}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activation bars */}
      {all.length > 0 && (
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
            Activation %
          </h3>
          <div className="space-y-3">
            {all.slice(0, 5).map((m, i) => {
              const pct = m.role === "Primary" ? 70 - i * 8 : 40 - i * 5;
              return (
                <div key={i} className="flex items-center gap-3">
                  <span
                    className="text-xs font-semibold w-28 shrink-0 capitalize"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {m.name}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full"
                    style={{ background: "var(--border-color)" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{
                        delay: 0.1 + i * 0.07,
                        duration: 0.6,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        background:
                          m.role === "Primary" ? "var(--primary)" : "#f0a500",
                      }}
                    />
                  </div>
                  <span
                    className="text-xs font-black w-8 text-right"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
