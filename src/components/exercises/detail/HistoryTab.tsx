"use client";

import React, { useState } from "react";
import { MOCK_HISTORY, HistorySession } from "./mockHistory";
import { HistoryVolumeChart } from "./HistoryVolumeChart";
import { HistorySessionCard } from "./HistorySessionCard";

export function HistoryTab() {
  const [open, setOpen] = useState<number>(0);
  const vol = (e: HistorySession) =>
    e.sets.reduce((s, x) => s + x.reps * x.weight, 0);
  const best = Math.max(
    ...MOCK_HISTORY.flatMap((h) => h.sets.map((s) => s.weight)),
  );

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sessions", val: MOCK_HISTORY.length, unit: "" },
          { label: "Best Weight", val: best, unit: " kg" },
          {
            label: "Avg Volume",
            val: Math.round(
              MOCK_HISTORY.reduce((s, h) => s + vol(h), 0) /
                MOCK_HISTORY.length,
            ),
            unit: " kg",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <p
              className="font-black text-xl"
              style={{ color: "var(--text-primary)" }}
            >
              {s.val}
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {s.unit}
              </span>
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <HistoryVolumeChart history={MOCK_HISTORY} vol={vol} />

      <div className="space-y-2">
        {MOCK_HISTORY.map((h, i) => (
          <HistorySessionCard
            key={i}
            session={h}
            index={i}
            isOpen={open === i}
            vol={vol}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>
    </div>
  );
}
