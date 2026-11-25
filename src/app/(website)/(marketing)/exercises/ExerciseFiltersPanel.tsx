"use client";

import React from "react";
import { X } from "lucide-react";
import { MUSCLES, LEVELS, EQUIPMENTS } from "./exerciseConstants";
import { ExerciseSearchBar } from "./ExerciseSearchBar";

interface FiltersState {
  search: string;
  muscle: string;
  level: string;
  equipment: string;
}

interface ExerciseFiltersPanelProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FiltersState;
  setFilters: React.Dispatch<React.SetStateAction<FiltersState>>;
  resetFilters: () => void;
}

export function ExerciseFiltersPanel({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  resetFilters,
}: ExerciseFiltersPanelProps) {
  const activeFilterCount = [
    filters.muscle,
    filters.level,
    filters.equipment,
  ].filter(Boolean).length;

  return (
    <>
      <ExerciseSearchBar
        search={filters.search}
        onSearchChange={(val) => setFilters((p) => ({ ...p, search: val }))}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFilterCount={activeFilterCount}
      />

      <div
        className="overflow-hidden transition-all duration-500"
        style={{
          maxHeight: showFilters ? 500 : 0,
          opacity: showFilters ? 1 : 0,
          marginBottom: showFilters ? 32 : 0,
        }}
      >
        <div
          className="rounded-3xl p-6 relative"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p
              className="text-[10px] font-black uppercase tracking-[0.2em]"
              style={{ color: "var(--text-secondary)" }}
            >
              Refine Results
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-opacity hover:opacity-70 cursor-pointer"
                style={{ color: "var(--primary)" }}
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-2.5"
                style={{ color: "var(--text-secondary)" }}
              >
                🎯 Target Muscle
              </p>
              <div className="flex flex-wrap gap-1.5">
                {MUSCLES.map((m) => {
                  const active = filters.muscle === m;
                  return (
                    <button
                      key={m}
                      onClick={() =>
                        setFilters((p) => ({ ...p, muscle: active ? "" : m }))
                      }
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-150 cursor-pointer"
                      style={{
                        background: active ? "var(--primary)" : "var(--bg-primary)",
                        border: `1px solid ${active ? "var(--primary)" : "var(--border-color)"}`,
                        color: active ? "#fff" : "var(--text-secondary)",
                      }}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-2.5"
                style={{ color: "var(--text-secondary)" }}
              >
                ⚡ Difficulty
              </p>
              <div className="flex flex-col gap-2">
                {LEVELS.map((l) => {
                  const active = filters.level === l;
                  const dot =
                    l === "Beginner"
                      ? "#22c55e"
                      : l === "Intermediate"
                        ? "var(--primary)"
                        : "#ef4444";
                  return (
                    <button
                      key={l}
                      onClick={() =>
                        setFilters((p) => ({ ...p, level: active ? "" : l }))
                      }
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150 cursor-pointer"
                      style={{
                        background: active ? `${dot}15` : "var(--bg-primary)",
                        border: `1px solid ${active ? `${dot}40` : "var(--border-color)"}`,
                        color: active ? dot : "var(--text-primary)",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: dot }}
                      />
                      {l}
                      {active && (
                        <span className="ml-auto text-[10px] font-black">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-2.5"
                style={{ color: "var(--text-secondary)" }}
              >
                🔧 Equipment
              </p>
              <div className="flex flex-col gap-2">
                {EQUIPMENTS.map((eq) => {
                  const active = filters.equipment === eq;
                  return (
                    <button
                      key={eq}
                      onClick={() =>
                        setFilters((p) => ({ ...p, equipment: active ? "" : eq }))
                      }
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150 cursor-pointer"
                      style={{
                        background: active ? "rgba(244,121,32,0.08)" : "var(--bg-primary)",
                        border: `1px solid ${active ? "rgba(244,121,32,0.3)" : "var(--border-color)"}`,
                        color: active ? "var(--primary)" : "var(--text-primary)",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-all"
                        style={{
                          background: active ? "var(--primary)" : "var(--border-color)",
                        }}
                      />
                      {eq}
                      {active && (
                        <span className="ml-auto text-[10px] font-black" style={{ color: "var(--primary)" }}>
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
