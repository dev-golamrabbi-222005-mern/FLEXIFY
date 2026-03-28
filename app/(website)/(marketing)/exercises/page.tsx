"use client";
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import ExerciseCard from "@/components/cards/ExerciseCard";
import SkeletonCard from "@/components/cards/SkeletonCard";
import { title } from "process";

const MUSCLES = [
  "Abdominals",
  "Hamstrings",
  "Biceps",
  "Shoulders",
  "Chest",
  "Quads",
  "Triceps",
];
const LEVELS = ["Beginner", "Intermediate", "Expert"];
const EQUIPMENTS = [
  "Body only",
  "Dumbbell",
  "Barbell",
  "Machine",
  "Kettlebells",
];

const ExercisesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    muscle: "",
    level: "",
    equipment: "",
  });
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["exercises", filters],
      queryFn: async ({ pageParam = 1 }) => {
        const { search, muscle, level, equipment } = filters;
        const res = await axios.get(
          `/api/exercises?page=${pageParam}&limit=12&search=${search}&muscle=${muscle}&level=${level}&equipment=${equipment}`,
        );
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.currentPage < lastPage.totalPages
          ? lastPage.currentPage + 1
          : undefined,
    });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const resetFilters = () =>
    setFilters({ search: "", muscle: "", level: "", equipment: "" });
  
  const activeFilterCount = [
    filters.muscle,
    filters.level,
    filters.equipment,
  ].filter(Boolean).length;
  
  return (
    <div className="min-h-screen px-6 mx-auto mt-8 mb-10 md:mt-12 max-w-7xl">
    <title>Exercises - Flexify</title>
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-[var(--text-primary)] tracking-tighter">
          Workouts <span className="text-[var(--primary)]">Vault</span>
        </h1>
      </div>

      {/* ── Search + Filter Toggle ── */}
      <div className="flex flex-col gap-3 mb-4 md:flex-row md:items-center">
        {/* Search bar */}
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
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>

        {/* Filter toggle button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="relative flex items-center justify-center gap-2.5 h-14 px-6 rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-200 shrink-0"
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
                background: showFilters
                  ? "rgba(255,255,255,0.25)"
                  : "var(--primary)",
                color: showFilters ? "#fff" : "#fff",
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ── Filter Panel ── */}
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
          {/* Top row label + reset */}
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
                className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider transition-opacity hover:opacity-70"
                style={{ color: "var(--primary)" }}
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          {/* Three filter groups */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Muscle */}
            <div>
              <p
                className="text-[10px] font-black uppercase tracking-widest mb-2.5"
                style={{ color: "var(--text-secondary)" }}
              >
                🎯 Target Muscle
              </p>
              {/* Pill chips */}
              <div className="flex flex-wrap gap-1.5">
                {MUSCLES.map((m) => {
                  const active = filters.muscle === m;
                  return (
                    <button
                      key={m}
                      onClick={() =>
                        setFilters((p) => ({ ...p, muscle: active ? "" : m }))
                      }
                      className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-150"
                      style={{
                        background: active
                          ? "var(--primary)"
                          : "var(--bg-primary)",
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

            {/* Level */}
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
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150"
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
                        <span className="ml-auto text-[10px] font-black">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Equipment */}
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
                        setFilters((p) => ({
                          ...p,
                          equipment: active ? "" : eq,
                        }))
                      }
                      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150"
                      style={{
                        background: active
                          ? "rgba(244,121,32,0.08)"
                          : "var(--bg-primary)",
                        border: `1px solid ${active ? "rgba(244,121,32,0.3)" : "var(--border-color)"}`,
                        color: active
                          ? "var(--primary)"
                          : "var(--text-primary)",
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0 transition-all"
                        style={{
                          background: active
                            ? "var(--primary)"
                            : "var(--border-color)",
                        }}
                      />
                      {eq}
                      {active && (
                        <span
                          className="ml-auto text-[10px] font-black"
                          style={{ color: "var(--primary)" }}
                        >
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Hidden selects for handleFilterChange compatibility (keep the name-based API working) */}
          <select
            name="muscle"
            value={filters.muscle}
            onChange={handleFilterChange}
            className="sr-only"
            aria-hidden="true"
          >
            <option value="" />
            {MUSCLES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <select
            name="level"
            value={filters.level}
            onChange={handleFilterChange}
            className="sr-only"
            aria-hidden="true"
          >
            <option value="" />
            {LEVELS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            name="equipment"
            value={filters.equipment}
            onChange={handleFilterChange}
            className="sr-only"
            aria-hidden="true"
          >
            <option value="" />
            {EQUIPMENTS.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!isLoading && (
        <p className="mb-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Results:{" "}
          <span className="text-[var(--primary)]">
            {data?.pages[0]?.total || 0}
          </span>
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {data?.pages.map((page) =>
              page.exercises.map((ex: any) => (
                <ExerciseCard key={ex._id} exercise={ex} />
              )),
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
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="text-xs font-black tracking-widest uppercase transition-transform btn-primary active:scale-95 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Discovering..." : "Discover More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;
