"use client";

import React from "react";
import { Dumbbell } from "lucide-react";

export default function WorkoutEmptyState() {
  return (
    <div className="text-center py-24 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-2xl mx-4">
      <div className="bg-[var(--primary)]/10 p-4 rounded-full mb-4">
        <Dumbbell className="w-10 h-10 text-[var(--primary)]" />
      </div>
      <p className="text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">
        No exercises found
      </p>
      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase mt-2">
        Try changing your search or filters
      </p>
    </div>
  );
}
