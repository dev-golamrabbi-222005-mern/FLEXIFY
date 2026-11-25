"use client";

import React from "react";
import { motion } from "framer-motion";
import { Clock, DollarSign, Star, ChevronRight } from "lucide-react";
import { Coach } from "./types";
import { CoachAvatar } from "./CoachAvatar";

export function CoachCardItem({
  coach,
  index,
  eliteBasePrice,
  onSelectDetail,
  onSelectCoach,
}: {
  coach: Coach;
  index: number;
  eliteBasePrice: number;
  onSelectDetail: (c: Coach) => void;
  onSelectCoach: (c: Coach) => void;
}) {
  return (
    <motion.div
      key={coach._id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl p-4"
      style={{
        background: "var(--bg-primary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <CoachAvatar coach={coach} size={44} />
        <div className="flex-1 min-w-0">
          <p
            className="font-black text-sm leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {coach.name || "Coach"}
          </p>
          <p
            className="text-xs font-semibold capitalize mt-0.5"
            style={{ color: "var(--primary)" }}
          >
            {coach.expertise || "Fitness Expert"}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className="font-black text-base leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            ${eliteBasePrice + (coach.charge ?? 0)}
          </p>
          <p
            className="text-[9px] font-black uppercase tracking-wider mt-0.5"
            style={{ color: "var(--text-secondary)" }}
          >
            /mo total
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <Clock size={10} />
          {coach.experience ?? 0} yrs exp
        </span>
        <span
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          <DollarSign size={10} />${coach.charge ?? 0}/mo
        </span>
        {coach.rating && (
          <span
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "#f59e0b",
            }}
          >
            <Star size={10} fill="#f59e0b" />
            {coach.rating.toFixed(1)}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onSelectDetail(coach)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:text-[var(--primary)] hover:border-[var(--primary)]"
          style={{
            border: "1.5px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          View Details <ChevronRight size={12} />
        </button>
        <button
          onClick={() => onSelectCoach(coach)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black text-white hover:brightness-110 transition-all"
          style={{
            background: "var(--primary)",
            boxShadow: "0 3px 10px rgba(16,185,129,0.25)",
          }}
        >
          Get Coach
        </button>
      </div>
    </motion.div>
  );
}
