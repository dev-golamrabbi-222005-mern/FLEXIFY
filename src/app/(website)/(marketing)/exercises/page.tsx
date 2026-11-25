"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { ExerciseFiltersPanel } from "./ExerciseFiltersPanel";
import { ExerciseGridList } from "./ExerciseGridList";

export default function ExercisesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    muscle: "",
    level: "",
    equipment: "",
  });

  const debouncedSearch = useDebounce(filters.search, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [
        "exercises",
        debouncedSearch,
        filters.muscle,
        filters.level,
        filters.equipment,
      ],
      queryFn: async ({ pageParam = 1 }) => {
        const { muscle, level, equipment } = filters;
        const res = await axios.get(
          `/api/exercises?page=${pageParam}&limit=12&search=${encodeURIComponent(
            debouncedSearch
          )}&muscle=${encodeURIComponent(muscle)}&level=${encodeURIComponent(
            level
          )}&equipment=${encodeURIComponent(equipment)}`
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
      staleTime: 1000 * 60 * 5,
      placeholderData: (prev) => prev,
    });

  const resetFilters = () =>
    setFilters({ search: "", muscle: "", level: "", equipment: "" });

  return (
    <div className="min-h-screen mx-auto my-8 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6">
      <title>Exercises - Flexify</title>
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tighter">
          Workouts <span className="text-[var(--primary)]">Vault</span>
        </h1>
      </div>

      <ExerciseFiltersPanel
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        resetFilters={resetFilters}
      />

      {!isLoading && (
        <p className="mb-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Results:{" "}
          <span className="text-[var(--primary)]">
            {data?.pages[0]?.total || 0}
          </span>
        </p>
      )}

      <ExerciseGridList
        isLoading={isLoading}
        pages={data?.pages}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        onFetchNextPage={() => fetchNextPage()}
      />
    </div>
  );
}
