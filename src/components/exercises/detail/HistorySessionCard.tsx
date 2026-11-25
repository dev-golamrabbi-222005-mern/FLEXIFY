"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HistorySession } from "./mockHistory";

export function HistorySessionCard({
  session,
  index,
  isOpen,
  vol,
  onToggle,
}: {
  session: HistorySession;
  index: number;
  isOpen: boolean;
  vol: (h: HistorySession) => number;
  onToggle: () => void;
}) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)]/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {session.date}
          </span>
          {index === 0 && (
            <span
              className="text-[10px] font-black px-2 py-0.5 rounded-lg"
              style={{
                background: "var(--primary)15",
                color: "var(--primary)",
              }}
            >
              LATEST
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {session.sets.length} sets · {vol(session).toLocaleString()} kg
          </span>
          <motion.span
            animate={{ rotate: isOpen ? 180 : 0 }}
            className="text-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            ▾
          </motion.span>
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-2 border-t"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div
                className="grid grid-cols-4 text-[10px] font-black uppercase tracking-wider mb-2 px-2"
                style={{ color: "var(--text-secondary)" }}
              >
                <span>Set</span>
                <span>Reps</span>
                <span>Weight</span>
                <span>Vol</span>
              </div>
              {session.sets.map((s, j) => (
                <div
                  key={j}
                  className="grid grid-cols-4 px-2 py-2 rounded-lg mb-1 text-sm"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <span
                    className="font-bold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {j + 1}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.reps}
                  </span>
                  <span
                    className="font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s.weight}kg
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    {s.reps * s.weight}
                  </span>
                </div>
              ))}
              {session.notes && (
                <p
                  className="mt-2 text-xs italic px-2 py-2 rounded-lg"
                  style={{
                    background: "var(--bg-primary)",
                    color: "var(--text-secondary)",
                  }}
                >
                  📝 {session.notes}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
