"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VideoSlide } from "./VideoSlide";

export function ExerciseImageViewer({
  images,
  name,
}: {
  images: string[];
  name: string;
}) {
  const total = (images.length || 0) + 1; // +1 for the video slide
  const [idx, setIdx] = useState(0);
  const isVideo = idx === total - 1;

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#111]">
      <AnimatePresence mode="wait">
        {!isVideo ? (
          <motion.div
            key={`img-${idx}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {images.length > 0 ? (
              <img
                src={`/exercises/${images[idx]}`}
                alt={name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.opacity = "0";
                }}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e2028] to-[#2a2d35]">
                <div className="w-20 h-20 rounded-full border-2 border-[var(--primary)]/30 flex items-center justify-center mb-3">
                  <span className="text-4xl">🏋️</span>
                </div>
                <p className="text-white/50 text-xs font-bold uppercase tracking-widest">
                  Exercise Preview
                </p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="video"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <VideoSlide name={name} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prev */}
      {idx > 0 && (
        <button
          onClick={() => setIdx((i) => i - 1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm z-10"
        >
          ‹
        </button>
      )}
      {/* Next */}
      {idx < total - 1 && (
        <button
          onClick={() => setIdx((i) => i + 1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors text-sm z-10"
        >
          ›
        </button>
      )}

      {/* Dots — last one is the video indicator */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="rounded-full transition-all duration-200"
            style={{
              width: i === idx ? 20 : 6,
              height: 6,
              background:
                i === idx
                  ? "var(--primary)"
                  : i === total - 1
                    ? "rgba(255,165,0,0.5)"
                    : "rgba(255,255,255,0.35)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
