"use client";

import React from "react";
import ExerciseCard from "@/components/cards/ExerciseCard";
import SkeletonCard from "@/components/cards/SkeletonCard";
import { ExerciseItem } from "./exerciseConstants";

interface ExerciseGridListProps {
  isLoading: boolean;
  pages?: { exercises: ExerciseItem[]; total?: number }[];
  isFetchingNextPage: boolean;
  hasNextPage?: boolean;
  onFetchNextPage: () => void;
}

export function ExerciseGridList({
  isLoading,
  pages,
  isFetchingNextPage,
  hasNextPage,
  onFetchNextPage,
}: ExerciseGridListProps) {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {pages?.map((page) =>
              page.exercises.map((ex) => (
                <ExerciseCard key={ex._id} exercise={ex} />
              ))
            )}
            {isFetchingNextPage &&
              Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={`next-${i}`} />
              ))}
          </>
        )}
      </div>

      {hasNextPage && (
        <div className="mt-16 text-center">
          <button
            onClick={onFetchNextPage}
            disabled={isFetchingNextPage}
            className="text-xs font-black tracking-widest uppercase transition-transform btn-primary active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {isFetchingNextPage ? "Discovering..." : "Discover More"}
          </button>
        </div>
      )}
    </>
  );
}
