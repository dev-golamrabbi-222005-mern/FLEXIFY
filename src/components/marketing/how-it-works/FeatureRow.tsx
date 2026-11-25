"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Feature } from "./rolesData";

export function FeatureRow({
  feature,
  index,
  color,
}: {
  feature: Feature;
  index: number;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <motion.button className="w-full text-left group" whileTap={{ scale: 0.995 }}>
        <motion.div
          className="flex items-center gap-4 py-4 px-3 rounded-xl transition-all duration-300"
          animate={{
            backgroundColor: open ? `${color}10` : "transparent",
          }}
          whileHover={{ backgroundColor: `${color}08` }}
          style={{
            borderBottom: `1px solid ${open ? `${color}20` : "var(--border-color)"}`,
          }}
        >
          <motion.span
            animate={{ color: open ? color : "var(--text-secondary)" }}
            className="text-xs font-black w-5 shrink-0 tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          <motion.div
            animate={{
              backgroundColor: open ? color : "var(--border-color)",
              scale: open ? 1.4 : 1,
            }}
            className="w-2 h-2 rounded-full shrink-0"
          />

          <div className="flex-1 min-w-0">
            <motion.p
              animate={{
                color: open ? "var(--text-primary)" : "var(--text-primary)",
              }}
              className="font-black text-sm md:text-base tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {feature.label}
            </motion.p>
            <p
              className="text-xs mt-0.5 hidden sm:block"
              style={{ color: "var(--text-secondary)" }}
            >
              {feature.sub}
            </p>
          </div>

          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 hidden sm:block"
            style={{
              backgroundColor: open ? `${color}20` : "var(--bg-primary)",
              color: open ? color : "var(--text-secondary)",
              border: `1px solid ${open ? `${color}40` : "var(--border-color)"}`,
              transition: "all 0.2s",
            }}
          >
            {feature.details.length} items
          </span>

          <motion.span
            animate={{
              rotate: open ? 180 : 0,
              color: open ? color : "var(--text-secondary)",
            }}
            className="text-xs shrink-0"
            transition={{ duration: 0.25 }}
          >
            ▾
          </motion.span>
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mx-3 mb-2 mt-1 rounded-xl p-3 grid grid-cols-1 gap-1.5"
              style={{
                backgroundColor: `${color}08`,
                border: `1px solid ${color}15`,
              }}
            >
              {feature.details.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5 text-[15px] py-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color, opacity: 0.7 }}
                  />
                  {d}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
