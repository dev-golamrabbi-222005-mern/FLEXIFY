"use client";

import { motion } from "framer-motion";
import { Swords, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EmptyChallengesState() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="text-center py-16 rounded-3xl"
      style={{
        border: "2px dashed var(--border-color)",
        background: "var(--bg-secondary)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
        style={{
          background: "rgba(16,185,129,0.1)",
          border: "1px solid rgba(16,185,129,0.2)",
        }}
      >
        <Swords size={24} style={{ color: "var(--primary)" }} />
      </div>
      <p className="font-black text-lg mb-1" style={{ color: "var(--text-primary)" }}>
        No challenges yet
      </p>
      <p className="text-sm mb-6 max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>
        Pick a challenge and start your 28-day transformation journey.
      </p>
      <button
        onClick={() => router.push("/#challenges")}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white"
        style={{
          background: "var(--primary)",
          boxShadow: "0 6px 20px rgba(16,185,129,0.35)",
        }}
      >
        Browse Challenges <ChevronRight size={14} />
      </button>
    </motion.div>
  );
}
