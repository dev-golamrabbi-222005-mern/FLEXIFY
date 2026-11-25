"use client";

import React from "react";
import { Search, SlidersHorizontal } from "lucide-react";

interface CoachSearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
  activeFilterCount: number;
}

export function CoachSearchBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  showFilters,
  onToggleFilters,
  activeFilterCount,
}: CoachSearchBarProps) {
  return (
    <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center">
      <div className="relative flex-grow group">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2"
          size={18}
          color="var(--text-secondary)"
        />
        <input
          type="text"
          placeholder="Search coaches by name or location..."
          className="w-full h-14 pl-11 pr-4 rounded-2xl outline-none transition-all"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="px-4 py-2 h-14 rounded-xl text-sm font-semibold outline-none cursor-pointer"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <option value="">Sort By</option>
          <option value="price_low">Price: Low → High</option>
          <option value="price_high">Price: High → Low</option>
          <option value="experience_high">Experience: High → Low</option>
          <option value="experience_low">Experience: Low → High</option>
        </select>
      </div>

      <button
        onClick={onToggleFilters}
        className="flex items-center justify-center gap-2.5 h-14 px-6 rounded-2xl font-bold text-xs uppercase transition-all shrink-0 cursor-pointer"
        style={{
          background: showFilters ? "var(--primary)" : "var(--bg-secondary)",
          color: showFilters ? "#fff" : "var(--text-primary)",
          border: `1px solid ${showFilters ? "var(--primary)" : "var(--border-color)"}`,
        }}
      >
        <SlidersHorizontal size={16} />
        Filters {activeFilterCount > 0 && <span>({activeFilterCount})</span>}
      </button>
    </div>
  );
}
