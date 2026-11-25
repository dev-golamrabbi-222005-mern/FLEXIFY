"use client";

import React from "react";

export function SessionTimerCard({
  totalSecs,
  setsCompleted,
}: {
  totalSecs: number;
  setsCompleted: number;
}) {
  return (
    <div
      className="rounded-3xl p-6 text-center relative overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <span
          className="font-black"
          style={{ fontSize: 120, color: "var(--primary)", lineHeight: 1 }}
        >
          {String(setsCompleted + 1)}
        </span>
      </div>
      <p
        className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10"
        style={{ color: "var(--text-secondary)" }}
      >
        Elapsed Time
      </p>
      <div className="relative z-10 flex items-baseline justify-center gap-3">
        <div className="text-center">
          <p
            className="font-black tabular-nums"
            style={{
              fontSize: 52,
              lineHeight: 1,
              color: "var(--text-primary)",
            }}
          >
            {String(Math.floor(totalSecs / 60)).padStart(2, "0")}
          </p>
          <p
            className="text-[10px] font-black uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            min
          </p>
        </div>
        <span
          className="font-black text-3xl pb-4"
          style={{ color: "var(--border-color)" }}
        >
          :
        </span>
        <div className="text-center">
          <p
            className="font-black tabular-nums"
            style={{ fontSize: 52, lineHeight: 1, color: "var(--primary)" }}
          >
            {String(totalSecs % 60).padStart(2, "0")}
          </p>
          <p
            className="text-[10px] font-black uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            sec
          </p>
        </div>
      </div>
    </div>
  );
}
