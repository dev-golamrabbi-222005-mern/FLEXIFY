"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight } from "./rolesData";

export function HighlightBlock({
  highlight,
  color,
}: {
  highlight: Highlight;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-10 rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${color}30` }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 transition-all"
        style={{ backgroundColor: `${color}40` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{highlight.icon}</span>
          <p className="font-black text-sm tracking-tight" style={{ color }}>
            {highlight.title}
          </p>
        </div>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-xs font-black shrink-0"
          style={{ color }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5" style={{ backgroundColor: `${color}06` }}>
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                {highlight.text}
              </p>

              <div className="grid grid-cols-3 gap-3">
                {highlight.stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="text-center py-3 rounded-xl"
                    style={{
                      backgroundColor: `${color}12`,
                      border: `1px solid ${color}20`,
                    }}
                  >
                    <p
                      className="font-black text-lg md:text-xl leading-none"
                      style={{ color }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[10px] font-semibold mt-1 uppercase tracking-wider"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
