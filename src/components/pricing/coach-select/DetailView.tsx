"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, DollarSign, User, Star, Award, CheckCircle2 } from "lucide-react";
import { Coach, ease } from "./types";
import { CoachAvatar } from "./CoachAvatar";
import { PriceBreakdown } from "./PriceBreakdown";

export function DetailView({
  coach,
  base,
  onBack,
  onGetCoach,
}: {
  coach: Coach;
  base: number;
  onBack: () => void;
  onGetCoach: () => void;
}) {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
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
        <h3 className="font-black text-base flex-1" style={{ color: "var(--text-primary)" }}>
          Coach Profile
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        <div className="flex items-start gap-4">
          <CoachAvatar coach={coach} size={64} />
          <div className="flex-1 min-w-0">
            <h2 className="font-black text-xl leading-tight" style={{ color: "var(--text-primary)" }}>
              {coach.name}
            </h2>
            <p className="text-sm font-semibold capitalize mt-0.5" style={{ color: "var(--primary)" }}>
              {coach.expertise}
            </p>
            {coach.rating && (
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    fill={i < Math.round(coach.rating ?? 0) ? "#f59e0b" : "none"}
                    stroke="#f59e0b"
                  />
                ))}
                <span className="text-xs font-bold ml-1" style={{ color: "var(--text-secondary)" }}>
                  {coach.rating.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Clock, label: "Experience", val: `${coach.experience} yrs` },
            { icon: DollarSign, label: "Monthly", val: `$${coach.charge}` },
            { icon: User, label: "Clients", val: coach.clients ? `${coach.clients}+` : "Active" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl p-3 text-center"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <s.icon size={14} className="mx-auto mb-1" style={{ color: "var(--primary)" }} />
              <p className="font-black text-sm leading-none" style={{ color: "var(--text-primary)" }}>
                {s.val}
              </p>
              <p className="text-[9px] font-black uppercase tracking-wider mt-0.5" style={{ color: "var(--text-secondary)" }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {coach.bio && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
              About
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
              {coach.bio}
            </p>
          </div>
        )}

        {coach.certifications && coach.certifications.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
              Certifications
            </p>
            <div className="flex flex-wrap gap-2">
              {coach.certifications.map((c, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "var(--primary)",
                  }}
                >
                  <Award size={10} />
                  {c}
                </div>
              ))}
            </div>
          </div>
        )}

        {coach.specialties && coach.specialties.length > 0 && (
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest mb-2" style={{ color: "var(--text-secondary)" }}>
              Specialties
            </p>
            <div className="flex flex-wrap gap-1.5">
              {coach.specialties.map((s, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        <PriceBreakdown base={base} coach={coach} />
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
          Back
        </button>
        <button
          onClick={onGetCoach}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-black text-sm text-white hover:brightness-110"
          style={{
            background: "var(--primary)",
            boxShadow: "0 4px 16px rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={15} /> Get Coach · ${base + coach.charge}/mo
        </button>
      </div>
    </motion.div>
  );
}
