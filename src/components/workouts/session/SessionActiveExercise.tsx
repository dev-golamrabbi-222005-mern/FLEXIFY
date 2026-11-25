"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Info, Plus, Zap } from "lucide-react";
import { SessionExercise } from "./types";
import { SetInputRow } from "./SetInputRow";

export function SessionActiveExercise({
  current,
  completedSets,
  totalSets,
  elapsed,
  onOpenInfo,
  onToggleSet,
  onChangeSet,
  onAddSet,
}: {
  current: SessionExercise;
  completedSets: number;
  totalSets: number;
  elapsed: number;
  onOpenInfo: () => void;
  onToggleSet: (si: number) => void;
  onChangeSet: (si: number, f: string, v: string) => void;
  onAddSet: () => void;
}) {
  const [imgIdx, setImgIdx] = useState(0);
  const [imgErr, setImgErr] = useState(false);
  const imgSrc =
    !imgErr && current.images?.[imgIdx]
      ? `/exercises/${current.images[imgIdx]}`
      : null;

  return (
    <div className="space-y-4">
      <div
        className="rounded-3xl p-4 text-center relative overflow-hidden"
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
            {String(completedSets + 1)}
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
              style={{ fontSize: 44, lineHeight: 1, color: "var(--text-primary)" }}
            >
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              min
            </p>
          </div>
          <span className="font-black text-3xl pb-4 text-[var(--border-color)]">:</span>
          <div className="text-center">
            <p
              className="font-black tabular-nums"
              style={{ fontSize: 44, lineHeight: 1, color: "var(--primary)" }}
            >
              {String(elapsed % 60).padStart(2, "0")}
            </p>
            <p className="text-[10px] font-black uppercase tracking-wider text-[var(--text-secondary)]">
              sec
            </p>
          </div>
        </div>
      </div>

      <div className="relative rounded-2xl overflow-hidden aspect-[16/9]">
        {imgSrc ? (
          <>
            <Image
              src={imgSrc}
              alt={current.name}
              fill
              className="object-cover"
              onError={() => {
                if (imgIdx < (current.images?.length ?? 0) - 1) setImgIdx((i) => i + 1);
                else setImgErr(true);
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-black/70 to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[var(--bg-secondary)]">
            <span className="text-5xl">🏋️</span>
            <p className="text-xs font-bold text-[var(--text-secondary)]">{current.name}</p>
          </div>
        )}
        <button
          onClick={onOpenInfo}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-white bg-black/55 backdrop-blur-sm hover:scale-110 transition-transform"
        >
          <Info size={16} />
        </button>
      </div>

      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="grid text-[9px] font-black uppercase tracking-widest px-4 py-2.5 border-b"
          style={{
            gridTemplateColumns: "28px 1fr 1fr 36px",
            color: "var(--text-secondary)",
            gap: "0.5rem",
            borderColor: "var(--border-color)",
          }}
        >
          <span className="text-center">SET</span>
          <span className="text-center">
            {current.trackingType === "TIME" ? "TIME (s)" : "WEIGHT (kg)"}
          </span>
          {current.trackingType !== "TIME" && <span className="text-center">REPS</span>}
          <span className="text-center">✓</span>
        </div>
        <div className="p-3 space-y-2">
          {current.sets.map((set, si) => (
            <SetInputRow
              key={set.id ?? si}
              set={set}
              setIdx={si}
              trackingType={current.trackingType}
              onToggle={onToggleSet}
              onChange={onChangeSet}
            />
          ))}
          <button
            onClick={onAddSet}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black border-dashed border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--primary)]/10"
          >
            <Plus size={12} /> Add Set
          </button>
        </div>
      </div>
    </div>
  );
}
