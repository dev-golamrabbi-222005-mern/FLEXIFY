"use client";

import React from "react";
import { Search } from "lucide-react";

interface WorkoutBuilderHeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
  isFilterActive: boolean;
  onClearFilters: () => void;
}

export default function WorkoutBuilderHeader({
  search,
  onSearchChange,
  isFilterActive,
  onClearFilters,
}: WorkoutBuilderHeaderProps) {
  return (
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          Custom <span className="text-[var(--primary)]">Routine</span>
        </h1>
        <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">Build your ultimate workout</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={20} />
        <input
          className="input-style !pl-12 !pr-32 !py-4 shadow-sm"
          placeholder="Search exercises..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {isFilterActive && (
          <button
            onClick={onClearFilters}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary)] font-black text-[10px] uppercase bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all"
          >
            Clear All
          </button>
        )}
      </div>
    </header>
  );
}
