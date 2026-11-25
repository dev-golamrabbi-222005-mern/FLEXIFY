"use client";

import React, { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { EQUIPMENT_META, RELATED_EQUIPMENT } from "./equipmentData";
import { EquipmentChecklist } from "./EquipmentChecklist";

export function EquipmentTab({ equipment }: { equipment: string | null }) {
  const [checked, setChecked] = useState<string[]>([]);
  const key = equipment?.toLowerCase().trim() ?? "body only";
  const meta = EQUIPMENT_META[key] ?? {
    icon: "🏋️",
    desc: "Standard gym equipment",
  };
  const related = RELATED_EQUIPMENT[key] ?? [];
  const isBodyweight = !equipment || key === "body only";

  const toggle = (item: string) =>
    setChecked((p) =>
      p.includes(item) ? p.filter((x) => x !== item) : [...p, item],
    );

  const isAllReady = checked.length === related.length && related.length > 0;

  return (
    <div className="space-y-4">
      {/* Primary equipment card */}
      <div
        className="rounded-2xl p-5"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Primary Equipment
        </p>

        {isBodyweight ? (
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{ background: "#dcfce7", border: "1px solid #bbf7d0" }}
          >
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl bg-white/60">
              🤸
            </div>
            <div>
              <p className="font-black text-base" style={{ color: "#15803d" }}>
                Bodyweight Only
              </p>
              <p className="text-xs mt-0.5" style={{ color: "#16a34a" }}>
                No equipment required
              </p>
            </div>
          </div>
        ) : (
          <div
            className="flex items-center gap-4 p-4 rounded-2xl"
            style={{
              background: "rgba(244,121,32,0.06)",
              border: "1px solid rgba(244,121,32,0.2)",
            }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(244,121,32,0.12)" }}
            >
              {meta.icon}
            </div>
            <div>
              <p
                className="font-black text-base capitalize"
                style={{ color: "var(--text-primary)" }}
              >
                {equipment}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: "var(--text-secondary)" }}
              >
                {meta.desc}
              </p>
            </div>
            <div
              className="ml-auto px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
              style={{
                background: "rgba(244,121,32,0.1)",
                color: "var(--primary)",
              }}
            >
              Required
            </div>
          </div>
        )}
      </div>

      <EquipmentChecklist
        related={related}
        checked={checked}
        onToggle={toggle}
      />

      {/* Readiness banner */}
      <div
        className="flex items-center gap-3 p-4 rounded-2xl"
        style={{
          background: isAllReady ? "#dcfce7" : "var(--bg-secondary)",
          border: `1px solid ${isAllReady ? "#bbf7d0" : "var(--border-color)"}`,
        }}
      >
        <CheckCircle2
          size={18}
          style={{
            color: isAllReady ? "#16a34a" : "var(--border-color)",
            flexShrink: 0,
          }}
        />
        <p
          className="text-sm font-semibold"
          style={{
            color: isAllReady ? "#16a34a" : "var(--text-secondary)",
          }}
        >
          {isAllReady
            ? "All set! You're fully equipped and ready to train."
            : "Check off each item as you gather your equipment."}
        </p>
      </div>
    </div>
  );
}
