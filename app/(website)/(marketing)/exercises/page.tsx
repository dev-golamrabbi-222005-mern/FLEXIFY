"use client";
import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";
import SkeletonCard from "@/components/cards/SkeletonCard";

const MUSCLES = ["Abdominals", "Hamstrings", "Biceps", "Shoulders", "Chest", "Quads", "Triceps"];
const LEVELS = ["Beginner", "Intermediate", "Expert"];
const EQUIPMENTS = ["Body only", "Dumbbell", "Barbell", "Machine", "Kettlebells"];


const ExercisesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ search: "", muscle: "", level: "", equipment: "" });

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["exercises", filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { search, muscle, level, equipment } = filters;
      const res = await axios.get(
        `/api/exercises?page=${pageParam}&limit=12&search=${search}&muscle=${muscle}&level=${level}&equipment=${equipment}`
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.currentPage < lastPage.totalPages ? lastPage.currentPage + 1 : undefined,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetFilters = () => setFilters({ search: "", muscle: "", level: "", equipment: "" });

  return (
    <div className="min-h-screen my-8 px-6 max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-[var(--text-primary)] uppercase tracking-tighter">
          Workouts <span className="text-[var(--primary)]">Vault</span>
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={20} />
          <input 
            name="search" 
            type="text" 
            placeholder="Search exercise name..." 
            className="input-style !pl-12 h-14" 
            value={filters.search}
            onChange={handleFilterChange} 
          />
        </div>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl font-bold uppercase text-xs tracking-widest hover:border-[var(--primary)] transition-all shadow-sm"
        >
          <Filter size={18} /> {showFilters ? "Hide" : "Filters"}
          {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? "max-h-[500px] opacity-100 mb-10" : "max-h-0 opacity-0"}`}>
        <div className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-6 relative shadow-sm">
          <div className="space-y-2">
            <label>Target Muscle</label>
            <select name="muscle" className="input-style" value={filters.muscle} onChange={handleFilterChange}>
              <option value="">All Muscles</option>
              {MUSCLES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label>Difficulty</label>
            <select name="level" className="input-style" value={filters.level} onChange={handleFilterChange}>
              <option value="">All Levels</option>
              {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label>Equipment</label>
            <select name="equipment" className="input-style" value={filters.equipment} onChange={handleFilterChange}>
              <option value="">All Equipment</option>
              {EQUIPMENTS.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
          <button onClick={resetFilters} className="sm:col-span-3 text-[10px] font-bold uppercase text-[var(--primary)] hover:underline flex items-center justify-center gap-1 mt-2">
            <X size={12} /> Reset All
          </button>
        </div>
      </div>

      {!isLoading && (
        <p className="mb-6 text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
          Results: <span className="text-[var(--primary)]">{data?.pages[0]?.total || 0}</span>
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading ? (
         
          Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            {data?.pages.map(page => 
              page.exercises.map((ex: any) => (
                <div key={ex._id} className="p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl hover:border-[var(--primary)] transition-all shadow-sm group">
                  <h3 className="font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-1">{ex.name}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-[9px] bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border-color)] text-[var(--primary)] font-bold uppercase">{ex.level}</span>
                    <span className="text-[9px] bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border-color)] text-[var(--text-secondary)] font-bold uppercase">{ex.equipment}</span>
                  </div>
                </div>
              ))
            )}
            {/* Show extra skeleton cards when loading next page */}
            {isFetchingNextPage && Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`next-${i}`} />)}
          </>
        )}
      </div>

      {hasNextPage && (
        <div className="mt-16 text-center">
          <button 
            onClick={() => fetchNextPage()} 
            disabled={isFetchingNextPage}
            className="btn-primary font-black uppercase tracking-widest text-xs transition-transform active:scale-95 disabled:opacity-50"
          >
            {isFetchingNextPage ? "Discovering..." : "Discover More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExercisesPage;