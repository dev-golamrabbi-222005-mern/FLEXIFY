"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function VideoSlide({ name }: { name: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setPlaying(false);
          return 0;
        }
        return p + 0.4;
      });
    }, 100);
    return () => clearInterval(t);
  }, [playing]);

  const totalSecs = 135;
  const elapsed = Math.round((progress / 100) * totalSecs);
  const fmtT = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    setProgress(
      Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)),
    );
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-br from-[#0f1117] to-[#1a1d26] flex flex-col items-center justify-center group cursor-pointer"
      onClick={() => setPlaying((p) => !p)}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, var(--primary) 0%, transparent 70%)",
        }}
      />

      <div className="relative mb-5">
        {playing &&
          [0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{
                borderColor: "var(--primary)",
                borderWidth: 1,
                borderStyle: "solid",
              }}
              initial={{ scale: 1, opacity: 0.5 }}
              animate={{ scale: 2.2 + i * 0.5, opacity: 0 }}
              transition={{
                repeat: Infinity,
                duration: 1.6,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center relative z-10"
          style={{
            background: "rgba(244,121,32,0.15)",
            border: "2px solid rgba(244,121,32,0.3)",
          }}
        >
          <span className="text-4xl">🏋️</span>
        </div>
      </div>

      <p className="text-white/80 text-sm font-black tracking-wider mb-1 text-center px-6 truncate max-w-xs">
        {name}
      </p>
      <p className="text-white/35 text-[10px] font-bold uppercase tracking-widest mb-5">
        Exercise Demonstration
      </p>

      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          setPlaying((p) => !p);
        }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.9 }}
        className="w-16 h-16 rounded-full flex items-center justify-center relative z-10"
        style={{
          background: "var(--primary)",
          boxShadow:
            "0 0 0 8px rgba(244,121,32,0.15), 0 8px 32px rgba(244,121,32,0.5)",
        }}
      >
        <span className="text-white text-2xl leading-none">
          {playing ? "⏸" : "▶"}
        </span>
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-10">
        <div
          ref={barRef}
          className="w-full h-1.5 rounded-full cursor-pointer mb-2 relative group/bar"
          style={{ background: "rgba(255,255,255,0.12)" }}
          onClick={(e) => {
            e.stopPropagation();
            handleBarClick(e);
          }}
        >
          <div
            className="h-full rounded-full relative"
            style={{ width: `${progress}%`, background: "var(--primary)" }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full -mr-1.5 opacity-0 group-hover/bar:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white/45 text-[10px] font-mono">
            {fmtT(elapsed)}
          </span>
          <div
            className="px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.35)",
            }}
          >
            Video Preview
          </div>
          <span className="text-white/30 text-[10px] font-mono">
            {fmtT(totalSecs)}
          </span>
        </div>
      </div>
    </div>
  );
}
