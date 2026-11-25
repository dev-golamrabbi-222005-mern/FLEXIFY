"use client";

import React from "react";
import { Coach } from "./types";

export function PriceBreakdown({ base, coach }: { base: number; coach: Coach }) {
  const total = base + (coach.charge ?? 0);
  return (
    <div
      className="rounded-2xl p-4 space-y-2.5"
      style={{
        background: "rgba(16,185,129,0.05)",
        border: "1px solid rgba(16,185,129,0.2)",
      }}
    >
      <p
        className="text-[10px] font-black uppercase tracking-widest"
        style={{ color: "var(--text-secondary)" }}
      >
        Price Breakdown
      </p>
      <div className="flex justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Elite Plan
        </span>
        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          ${base}/mo
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Coach: {coach.name}
        </span>
        <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
          ${coach.charge}/mo
        </span>
      </div>
      <div
        className="flex justify-between pt-2.5 border-t"
        style={{ borderColor: "rgba(16,185,129,0.2)" }}
      >
        <span className="font-black text-sm" style={{ color: "var(--text-primary)" }}>
          Total
        </span>
        <span className="font-black text-xl" style={{ color: "var(--primary)" }}>
          ${total}/mo
        </span>
      </div>
    </div>
  );
}
