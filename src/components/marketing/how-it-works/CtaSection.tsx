"use client";

import React from "react";
import { motion } from "framer-motion";
import { RoleData } from "./rolesData";

export function CtaSection({ role }: { role: RoleData }) {
  return (
    <motion.div
      className="relative rounded-3xl p-8 md:p-14 text-center overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: `1px solid ${role.color}25`,
      }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${role.color} 0%, transparent 70%)`,
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[100px] md:text-[160px] font-black select-none pointer-events-none leading-none opacity-5 tracking-tighter"
        style={{ color: role.color }}
      >
        START
      </div>

      <p
        className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 relative z-10"
        style={{ color: role.color }}
      >
        — Get Moving
      </p>

      <h3
        className="font-black tracking-tighter leading-none mb-4 relative z-10"
        style={{
          fontSize: "clamp(30px, 6vw, 72px)",
          color: "var(--text-primary)",
        }}
      >
        Ready to
        <br />
        <span style={{ color: role.color }}>Get Started?</span>
      </h3>

      <p
        className="text-sm md:text-base max-w-sm mx-auto mb-8 relative z-10"
        style={{ color: "var(--text-secondary)" }}
      >
        Join thousands achieving their goals with AI-powered personalization.
      </p>

      <motion.button
        className="relative z-10 inline-flex items-center gap-3 px-7 py-4 font-black text-sm md:text-base text-white rounded-2xl"
        style={{
          backgroundColor: role.color,
          boxShadow: `0 10px 36px ${role.color}40`,
        }}
        whileHover={{
          scale: 1.05,
          boxShadow: `0 16px 48px ${role.color}55`,
        }}
        whileTap={{ scale: 0.97 }}
      >
        Start Your Journey
        <motion.span
          animate={{ x: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 1.3 }}
        >
          →
        </motion.span>
      </motion.button>
    </motion.div>
  );
}
