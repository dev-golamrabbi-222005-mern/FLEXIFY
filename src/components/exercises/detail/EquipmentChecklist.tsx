"use client";

import React from "react";
import { motion } from "framer-motion";

export function EquipmentChecklist({
  related,
  checked,
  onToggle,
}: {
  related: string[];
  checked: string[];
  onToggle: (item: string) => void;
}) {
  if (related.length === 0) return null;

  return (
    <div
      className="rounded-2xl p-5"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-[11px] font-black uppercase tracking-widest"
          style={{ color: "var(--text-secondary)" }}
        >
          What You Need
        </p>
        <p
          className="text-[11px] font-bold"
          style={{ color: "var(--primary)" }}
        >
          {checked.length}/{related.length} ready
        </p>
      </div>
      <div className="space-y-2.5">
        {related.map((item, i) => {
          const isOpt = item.toLowerCase().includes("optional");
          const done = checked.includes(item);
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onToggle(item)}
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all"
              style={{
                background: done
                  ? "rgba(244,121,32,0.06)"
                  : "var(--bg-primary)",
                border: `1px solid ${done ? "rgba(244,121,32,0.2)" : "var(--border-color)"}`,
              }}
            >
              <div
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-all"
                style={{
                  background: done ? "var(--primary)" : "transparent",
                  border: `2px solid ${done ? "var(--primary)" : "var(--border-color)"}`,
                }}
              >
                {done && (
                  <span className="text-white text-[10px] font-black">✓</span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{
                    background: done
                      ? "var(--primary)"
                      : isOpt
                        ? "var(--border-color)"
                        : "var(--text-secondary)",
                  }}
                />
                <span
                  className={`text-sm font-semibold ${done ? "line-through opacity-50" : ""}`}
                  style={{ color: "var(--text-primary)" }}
                >
                  {item}
                </span>
              </div>
              {isOpt && !done && (
                <span
                  className="text-[9px] font-black uppercase tracking-wider shrink-0 px-1.5 py-0.5 rounded"
                  style={{
                    background: "var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  OPT
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
