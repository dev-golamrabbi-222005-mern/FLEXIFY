"use client";

import React, { useState } from "react";

export function InstructionsTab({
  instructions,
  primaryMuscles,
  secondaryMuscles,
  equipment,
}: {
  instructions: string[];
  primaryMuscles: string[];
  secondaryMuscles: string[];
  equipment: string | null;
}) {
  const [checked, setChecked] = useState<number[]>([]);
  const toggle = (i: number) =>
    setChecked((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4">
      {/* Steps */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className="font-bold text-sm"
            style={{ color: "var(--text-primary)" }}
          >
            How to perform
          </h3>
          <span
            className="text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            {checked.length}/{instructions.length} reviewed
          </span>
        </div>
        <div className="space-y-2.5">
          {instructions.map((step, i) => (
            <div
              key={i}
              onClick={() => toggle(i)}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border
                ${checked.includes(i)
                  ? "border-[var(--primary)]/20 bg-[var(--primary)]/5"
                  : "border-transparent hover:bg-[var(--bg-primary)]"
                }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all
                ${checked.includes(i) ? "bg-[var(--primary)] text-white" : "border border-[var(--border-color)] text-[var(--text-secondary)]"}`}
                style={{
                  background: checked.includes(i)
                    ? "var(--primary)"
                    : "var(--bg-primary)",
                }}
              >
                {checked.includes(i) ? "✓" : i + 1}
              </div>
              <p
                className={`text-sm leading-relaxed ${checked.includes(i) ? "line-through opacity-50" : ""}`}
                style={{ color: "var(--text-primary)" }}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Side info */}
      <div className="flex flex-col gap-3">
        {/* Muscles mini */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-wider mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            🎯 Muscles
          </p>
          <div className="flex flex-wrap gap-1.5">
            {primaryMuscles.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold capitalize"
                style={{
                  background: "var(--primary)15",
                  color: "var(--primary)",
                }}
              >
                {m}
              </span>
            ))}
            {secondaryMuscles.map((m) => (
              <span
                key={m}
                className="px-2 py-0.5 rounded-lg text-[11px] font-semibold capitalize"
                style={{
                  background: "var(--bg-primary)",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Equipment mini */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[11px] font-black uppercase tracking-wider mb-3"
            style={{ color: "var(--text-secondary)" }}
          >
            🔧 Equipment
          </p>
          {equipment ? (
            <p
              className="text-sm font-semibold capitalize"
              style={{ color: "var(--text-primary)" }}
            >
              {equipment}
            </p>
          ) : (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--text-secondary)" }}
            >
              Bodyweight
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
