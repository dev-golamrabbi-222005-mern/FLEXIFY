"use client";

import React from "react";

export function Ticker({ color }: { color: string }) {
  const items = [
    "TRAIN",
    "EAT",
    "SLEEP",
    "REPEAT",
    "TRACK",
    "IMPROVE",
    "FLEXIFY",
  ];
  const repeated = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{ borderColor: `${color}30` }}
    >
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: ticker-scroll 18s linear infinite;
        }
      `}</style>

      <div className="ticker-track">
        {[...repeated, ...repeated].map((item, i) => (
          <span
            key={i}
            className="text-[11px] font-black tracking-[0.3em] flex items-center gap-8 whitespace-nowrap"
            style={{ color: `${color}70` }}
          >
            {item}
            <span style={{ color }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
