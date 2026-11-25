"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BecomeCoachCTA from "./BecomeCoachCTA";
import { CoachFiltersPanel, CoachFiltersState } from "./CoachFiltersPanel";
import { CoachGridList } from "./CoachGridList";
import { Coach } from "./coachFilterConstants";

export type { Coach };

export default function CoachesPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<CoachFiltersState>({
    search: "",
    specialty: "",
    experience: "",
    trainingType: "",
  });
  const [sort, setSort] = useState<string>("");

  const {
    data: coaches,
    isLoading,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["coaches", filters, sort],
    queryFn: async () => {
      const { search, specialty, experience, trainingType } = filters;
      const { data } = await axios.get(
        `/api/coach?search=${search}&specialty=${specialty}&experience=${experience}&trainingType=${trainingType}&sort=${sort}`
      );
      return data;
    },
  });

  const resetFilters = () =>
    setFilters({ search: "", specialty: "", experience: "", trainingType: "" });

  return (
    <div className="min-h-screen mx-auto my-8 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6">
      <title>Coaches - Flexify</title>

      <h1 className="text-3xl mb-10 md:text-5xl font-bold text-[var(--text-primary)] text-center tracking-tighter">
        Our Expert <span className="text-[var(--primary)]">Coaches</span>
      </h1>

      <CoachFiltersPanel
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        sort={sort}
        setSort={setSort}
        resetFilters={resetFilters}
      />

      <CoachGridList
        coaches={coaches}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
      />

      <BecomeCoachCTA />
    </div>
  );
}
