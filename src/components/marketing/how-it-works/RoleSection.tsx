"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { RoleData } from "./rolesData";
import { FeatureRow } from "./FeatureRow";
import { HighlightBlock } from "./HighlightBlock";

export function RoleSection({ role }: { role: RoleData }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const verbY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const numY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div ref={sectionRef} className="relative py-16 md:py-20 lg:py-28">
      {/* Parallax watermark */}
      <motion.div
        style={{ y: verbY }}
        className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden"
      >
        <span
          className="font-black select-none leading-none pr-2 md:pr-6"
          style={{
            fontSize: "clamp(60px, 14vw, 160px)",
            color: role.color,
            opacity: 0.06,
            letterSpacing: "-0.04em",
          }}
        >
          {role.verb}
        </span>
      </motion.div>

      {/* Grid: left identity + right features */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-16 items-start">
        <div className="md:sticky md:top-24">
          <motion.div
            style={{ y: numY }}
            className="font-black leading-none mb-1 select-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span
              style={{
                color: role.color,
                fontSize: "clamp(56px, 10vw, 110px)",
                letterSpacing: "-0.04em",
                display: "block",
              }}
            >
              {role.num}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tighter leading-none mb-3"
            style={{
              fontSize: "clamp(36px, 7vw, 68px)",
              color: "var(--text-primary)",
            }}
          >
            {role.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest mb-4"
            style={{
              backgroundColor: `${role.color}18`,
              color: role.color,
              border: `1px solid ${role.color}35`,
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: role.color }}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            {role.subtitle.toUpperCase()}
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm leading-relaxed mb-5 max-w-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {role.description}
          </motion.p>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.18,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-[3px] w-14 rounded-full origin-left"
            style={{ backgroundColor: role.color }}
          />

          <div className="hidden md:block">
            <HighlightBlock highlight={role.highlight} color={role.color} />
          </div>
        </div>

        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 px-3"
            style={{ color: role.color }}
          >
            What you get
          </p>
          <div>
            {role.features.map((f, i) => (
              <FeatureRow key={f.label} feature={f} index={i} color={role.color} />
            ))}
          </div>

          <div className="md:hidden mt-2">
            <HighlightBlock highlight={role.highlight} color={role.color} />
          </div>
        </div>
      </div>
    </div>
  );
}
