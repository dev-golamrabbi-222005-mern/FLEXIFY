"use client";

import React from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Coach, ease } from "./types";
import { CoachCardItem } from "./CoachCardItem";

export function CoachListView({
  coaches,
  eliteBasePrice,
  loading,
  error,
  onClose,
  onSelectDetail,
  onSelectCoach,
}: {
  coaches: Coach[];
  eliteBasePrice: number;
  loading: boolean;
  error: string | null;
  onClose: () => void;
  onSelectDetail: (c: Coach) => void;
  onSelectCoach: (c: Coach) => void;
}) {
  return (
    <motion.div
      key="list"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.28, ease }}
      className="flex flex-col h-full"
    >
      <div
        className="flex items-center justify-between px-5 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-0.5"
            style={{ color: "var(--primary)" }}
          >
            Elite Plan
          </p>
          <h3
            className="font-black text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            Choose Your Coach
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <X size={16} />
        </button>
      </div>

      <div
        className="px-5 py-2.5 shrink-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Elite base:{" "}
          <strong style={{ color: "var(--text-primary)" }}>
            ${eliteBasePrice}/mo
          </strong>{" "}
          + coach charge = your total monthly cost.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {loading && (
          <div className="flex items-center justify-center py-16 gap-3">
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: "var(--primary)" }}
            />
            <span
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Loading coaches...
            </span>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-3xl mb-3">⚠️</p>
            <p
              className="font-black text-sm mb-1"
              style={{ color: "var(--text-primary)" }}
            >
              Could not load coaches
            </p>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {error}
            </p>
          </div>
        )}

        {!loading && !error && coaches.length === 0 && (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">🏋️</p>
            <p className="font-black text-base" style={{ color: "var(--text-primary)" }}>
              No coaches available
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              Check back soon
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          coaches.map((coach, i) => (
            <CoachCardItem
              key={coach._id}
              coach={coach}
              index={i}
              eliteBasePrice={eliteBasePrice}
              onSelectDetail={onSelectDetail}
              onSelectCoach={onSelectCoach}
            />
          ))}
      </div>
    </motion.div>
  );
}
