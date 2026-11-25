"use client";

import React from "react";
import { X } from "lucide-react";
import {
  SPECIALTIES,
  EXPERIENCE_LEVELS,
  TRAINING_TYPES,
} from "./coachFilterConstants";
import { CoachSearchBar } from "./CoachSearchBar";

export interface CoachFiltersState {
  search: string;
  specialty: string;
  experience: string;
  trainingType: string;
}

interface CoachFiltersPanelProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: CoachFiltersState;
  setFilters: React.Dispatch<React.SetStateAction<CoachFiltersState>>;
  sort: string;
  setSort: (s: string) => void;
  resetFilters: () => void;
}

export function CoachFiltersPanel({
  showFilters,
  setShowFilters,
  filters,
  setFilters,
  sort,
  setSort,
  resetFilters,
}: CoachFiltersPanelProps) {
  const activeFilterCount = [
    filters.specialty,
    filters.experience,
    filters.trainingType,
  ].filter(Boolean).length;

  return (
    <>
      <CoachSearchBar
        search={filters.search}
        onSearchChange={(val) => setFilters((p) => ({ ...p, search: val }))}
        sort={sort}
        onSortChange={setSort}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        activeFilterCount={activeFilterCount}
      />

      <div
        className={`overflow-hidden transition-all duration-500 ${
          showFilters ? "max-h-[500px] mb-8 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="rounded-3xl p-6"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Refine Coaches
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[var(--primary)] cursor-pointer"
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <p className="text-[10px] font-black uppercase mb-2.5 text-[var(--text-secondary)]">
                🎯 Specialty
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        specialty: filters.specialty === s ? "" : s,
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                      filters.specialty === s
                        ? "bg-[var(--primary)] text-white"
                        : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase mb-2.5 text-[var(--text-secondary)]">
                ⭐ Experience
              </p>
              <div className="flex flex-col gap-2">
                {EXPERIENCE_LEVELS.map((exp) => (
                  <button
                    key={exp}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        experience: filters.experience === exp ? "" : exp,
                      })
                    }
                    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      filters.experience === exp
                        ? "bg-[rgba(244,121,32,0.1)] text-[var(--primary)] border border-[var(--primary)]"
                        : "bg-[var(--bg-primary)] border border-[var(--border-color)]"
                    }`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-black uppercase mb-2.5 text-[var(--text-secondary)]">
                👟 Training Type
              </p>
              <div className="flex flex-col gap-2">
                {TRAINING_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        trainingType: filters.trainingType === t ? "" : t,
                      })
                    }
                    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      filters.trainingType === t
                        ? "bg-[rgba(244,121,32,0.1)] text-[var(--primary)] border border-[var(--primary)]"
                        : "bg-[var(--bg-primary)] border border-[var(--border-color)]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
