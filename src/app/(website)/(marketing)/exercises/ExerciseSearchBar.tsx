"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface ExerciseSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export function ExerciseSearchBar({
  search,
  onSearchChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
}: ExerciseSearchBarProps) {
  return (
    <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center">
      <div className="relative flex-grow group">
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ boxShadow: "0 0 0 2px var(--primary)" }}
        />
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-200"
          size={18}
          style={{ color: "var(--text-secondary)" }}
        />
        <input
          name="search"
          type="text"
          placeholder="Search exercises…"
          className="w-full h-14 pl-11 pr-4 rounded-2xl text-sm font-medium outline-none transition-all duration-200"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <button
        onClick={onToggleFilters}
        className="relative flex items-center justify-center gap-2.5 h-14 px-6 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-200 shrink-0 cursor-pointer"
        style={{
          background: showFilters ? "var(--primary)" : "var(--bg-secondary)",
          border: `1px solid ${showFilters ? "var(--primary)" : "var(--border-color)"}`,
          color: showFilters ? "#fff" : "var(--text-primary)",
        }}
      >
        <SlidersHorizontal size={16} />
        Filters
        {activeFilterCount > 0 && (
          <span
            className="flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-black"
            style={{
              background: "rgba(255,255,255,0.25)",
              color: "#fff",
            }}
          >
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
