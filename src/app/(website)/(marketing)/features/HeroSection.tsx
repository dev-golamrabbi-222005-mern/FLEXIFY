"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="text-center mb-6 md:mb-8 lg:mb-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-block mb-6"
      >
        <div
          className="px-5 py-2 rounded-full text-sm font-bold backdrop-blur-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "2px solid var(--primary)",
            color: "var(--primary)",
          }}
        >
          ✨ Powered by AI & Expert Coaching
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-[var(--text-primary)]"
      >
        Features That{" "}
        <span
          className="relative inline-block"
          style={{ color: "var(--primary)" }}
        >
          Transform
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-lg max-w-3xl mx-auto text-[var(--text-secondary)]"
      >
        Everything you need to achieve your fitness goals — backed by AI,
        science, and certified trainers.
      </motion.p>
    </motion.div>
  );
}
