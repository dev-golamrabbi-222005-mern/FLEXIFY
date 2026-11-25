"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Coach, ease } from "./types";
import { CoachAvatar } from "./CoachAvatar";
import { PriceBreakdown } from "./PriceBreakdown";

export function ConfirmView({
  coach,
  base,
  onBack,
  onProceed,
}: {
  coach: Coach;
  base: number;
  onBack: () => void;
  onProceed: () => void;
}) {
  const total = base + coach.charge;
  return (
    <motion.div
      key="confirm"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.28, ease }}
      className="flex flex-col h-full"
    >
      <div
        className="flex items-center gap-3 px-5 py-4 border-b shrink-0"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} />
        </button>
        <h3
          className="font-black text-base flex-1"
          style={{ color: "var(--text-primary)" }}
        >
          Order Summary
        </h3>
      </div>

      <div className="flex-1 p-5 space-y-4 overflow-y-auto">
        <div
          className="flex items-center gap-4 p-4 rounded-2xl"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <CoachAvatar coach={coach} size={52} />
          <div>
            <p
              className="font-black text-base"
              style={{ color: "var(--text-primary)" }}
            >
              {coach.name}
            </p>
            <p
              className="text-xs font-semibold capitalize"
              style={{ color: "var(--primary)" }}
            >
              {coach.expertise}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {coach.experience} yrs experience
            </p>
          </div>
        </div>

        <PriceBreakdown base={base} coach={coach} />

        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            What&apos;s Included
          </p>
          {[
            "Full Elite plan features",
            "Personal coach assigned to you",
            "Direct messaging with coach",
            "Custom workout plan by coach",
            "Weekly check-ins & progress review",
          ].map((item) => (
            <div key={item} className="flex items-center gap-2.5 py-1.5">
              <CheckCircle2
                size={14}
                style={{ color: "var(--primary)" }}
                className="shrink-0"
              />
              <span
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="px-5 py-4 border-t shrink-0 flex gap-2"
        style={{ borderColor: "var(--border-color)" }}
      >
        <button
          onClick={onBack}
          className="py-3 px-5 rounded-2xl font-bold text-sm"
          style={{
            border: "1.5px solid var(--border-color)",
            color: "var(--text-secondary)",
          }}
        >
          Cancel
        </button>
        <button
          onClick={onProceed}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-white hover:brightness-110"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={15} /> Proceed to Payment · ${total}/mo
        </button>
      </div>
    </motion.div>
  );
}
