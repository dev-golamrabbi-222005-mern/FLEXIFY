"use client";

import React from "react";
import { motion } from "framer-motion";
import { Exercise } from "./types";

export function CompletionBurstHero({ ex }: { ex: Exercise }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl p-8 text-center relative overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 3, opacity: 1 }}
        transition={{ delay: 0.2, duration: 1.2, ease: "easeOut" }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 40%, rgba(244,121,32,0.08) 0%, transparent 65%)",
        }}
      />

      <div
        className="relative mx-auto mb-6"
        style={{ width: 100, height: 100 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full"
            style={{ border: `2px solid rgba(244,121,32,${0.35 - i * 0.1})` }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.1 + i * 0.28, opacity: [0, 0.6, 0] }}
            transition={{
              delay: 0.3 + i * 0.15,
              duration: 0.9,
              ease: "easeOut",
            }}
          />
        ))}

        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: 10,
              height: 2,
              borderRadius: 2,
              background: "var(--primary)",
              marginTop: -1,
              rotate: `${i * 45}deg`,
              translateX: 42,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: [0, 1, 0] }}
            transition={{ delay: 0.35 + i * 0.04, duration: 0.5 }}
          />
        ))}

        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.15,
            type: "spring",
            stiffness: 280,
            damping: 20,
          }}
          className="absolute inset-0 rounded-full flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(244,121,32,0.18), rgba(244,121,32,0.08))",
            border: "2px solid rgba(244,121,32,0.4)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
            <motion.path
              d="M10 23L18 31L34 14"
              stroke="var(--primary)"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.4,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </svg>
        </motion.div>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
        className="font-black tracking-tight mb-2"
        style={{
          fontSize: "clamp(28px, 5vw, 38px)",
          color: "var(--text-primary)",
        }}
      >
        Well Done! 🎉
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.75 }}
        className="text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        You crushed all sets for{" "}
        <span className="font-bold" style={{ color: "var(--primary)" }}>
          {ex.name}.
        </span>
      </motion.p>
    </motion.div>
  );
}
