"use client";

import React from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { ExerciseRow } from "@/components/cards/ExerciseRowCard";
import { Exercise } from "@/components/user/workout";

interface ExerciseGroup {
  part: string;
  exercises: Exercise[];
  count?: number;
}

interface ExerciseGroupSectionProps {
  group: ExerciseGroup;
  isFilterActive: boolean;
  visibleCount: number;
  selectedExercises: Exercise[];
  isFetching: boolean;
  onToggleExercise: (ex: Exercise) => void;
  onShowDetails: (ex: Exercise) => void;
  onLoadMore: (part: string) => void;
}

export default function ExerciseGroupSection({
  group,
  isFilterActive,
  visibleCount,
  selectedExercises,
  isFetching,
  onToggleExercise,
  onShowDetails,
  onLoadMore,
}: ExerciseGroupSectionProps) {
  const totalCount = isFilterActive ? group.exercises.length : (group.count ?? 0);
  const showLoadMore = totalCount > visibleCount;

  return (
    <section className="border-l-4 border-[var(--primary)] pl-4 mb-10">
      <h3 className="text-xl font-black uppercase mb-4 text-[var(--text-primary)]">
        {group.part}
        <span className="ml-2 text-xs opacity-50">
          ({isFilterActive ? group.exercises.length : group.count})
        </span>
      </h3>

      <div className="space-y-3">
        {group.exercises.slice(0, visibleCount).map((ex: Exercise, idx: number) => (
          <ExerciseRow
            key={`${ex.id}-${idx}`}
            exercise={ex}
            onSelect={onToggleExercise}
            isSelected={selectedExercises.some((s) => s.id === ex.id)}
            onShowDetails={onShowDetails}
          />
        ))}
      </div>

      {showLoadMore && (
        <button
          onClick={() => onLoadMore(group.part)}
          className="mt-4 flex items-center gap-2 text-[var(--primary)] font-black text-[10px] uppercase hover:tracking-widest transition-all"
        >
          {isFetching ? <Loader2 className="animate-spin" size={12} /> : <RotateCcw size={12} />}
          Load More {group.part}
        </button>
      )}
    </section>
  );
}
