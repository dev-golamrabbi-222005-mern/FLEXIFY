"use client";

import React from "react";
import { motion } from "framer-motion";

export function FeaturesCtaSection() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="text-center py-12 md:py-16 lg:py-20 mb-8 md:mb-12 lg:mb-16 rounded-3xl relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, var(--success) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 100%, var(--secondary) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 0%, var(--primary) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      />

      <h2
        className="text-3xl md:text-5xl font-bold mb-6 relative z-10 text-[var(--text-primary)]"
      >
        Ready to Experience the Difference?
      </h2>
      <p
        className="text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10 text-[var(--text-secondary)]"
      >
        Join thousands of users who have transformed their fitness journey with
        Flexify.
      </p>
      <motion.button
        className="btn-primary text-lg font-bold shadow-xl relative z-10 cursor-pointer"
        whileHover={{
          scale: 1.05,
          boxShadow: "0 10px 40px rgba(249, 115, 22, 0.3)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        Start Free Trial →
      </motion.button>
    </motion.div>
  );
}
