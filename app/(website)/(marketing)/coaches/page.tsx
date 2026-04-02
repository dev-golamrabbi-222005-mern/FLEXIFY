"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BecomeCoachCTA from "./BecomeCoachCTA";
import CoachCard from "@/components/cards/CoachCard";
import { ObjectId } from "mongodb";
import { Loader2, Search, SlidersHorizontal, X } from "lucide-react";

export type Coach = {
  _id: string; // frontend always uses string
  name: string;
  profileImage?: string;
  imageUrl?: string;
  location?: string;
  experienceYears?: number;
  trainingTypes?: string[];
  specialties?: string;
  pricing?: {
    monthly?: number;
    perSession?: number;
  };
};

const SPECIALTIES = ["Gymnishiam", "Yoga", "Cardio", "CrossFit", "Bodybuilding"];
const EXPERIENCE_LEVELS = ["0-2 Years", "3-5 Years", "5+ Years"];
const TRAINING_TYPES = ["Online", "1-on-1", "Group"];

// This type represents the raw MongoDB response
export type CoachDB = Omit<Coach, "_id"> & { _id: ObjectId };

const CoachesPage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    specialty: "",
    experience: "",
    trainingType: "",
  });

const { data: coaches, isLoading, isFetching, isError } = useQuery({
    queryKey: ["coaches", filters],
    queryFn: async () => {
      const { search, specialty, experience, trainingType } = filters;
      const { data } = await axios.get(
        `/api/coach?search=${search}&specialty=${specialty}&experience=${experience}&trainingType=${trainingType}`
      );
      return data;
    },
  });

 const resetFilters = () =>
    setFilters({ search: "", specialty: "", experience: "", trainingType: "" });

  const activeFilterCount = [filters.specialty, filters.experience, filters.trainingType].filter(Boolean).length;
  return (
    <div className="min-h-screen mx-auto my-6 md:my-8 lg:my-10 max-w-7xl px-4 md:px-6">
      <title>Coaches - Flexify</title>

      <h1 className="text-3xl mb-10 md:text-5xl font-bold text-[var(--text-primary)] text-center tracking-tighter">
        Our Expert <span className="text-[var(--primary)]">Coaches</span>
      </h1>
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
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2.5 h-14 px-6 rounded-2xl font-bold text-xs uppercase transition-all shrink-0"
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

      {/* ── Filter Panel ── */}
      <div
        className={`overflow-hidden transition-all duration-500 ${showFilters ? "max-h-[500px] mb-8 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div
          className="rounded-3xl p-6"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between mb-5">
            <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-secondary)]">
              Refine Coaches
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-[11px] font-black uppercase text-[var(--primary)]"
              >
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Specialty Filter */}
            <div>
              <p className="text-[10px] font-black uppercase mb-2.5 text-[var(--text-secondary)]">
                🎯 Specialty
              </p>
              <div className="flex flex-wrap gap-1.5">
                {SPECIALTIES.map((s) => (
                  <button
                    key={s}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        specialty: filters.specialty === s ? "" : s,
                      })
                    }
                    className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${filters.specialty === s ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Experience Filter */}
            <div>
              <p className="text-[10px] font-black uppercase mb-2.5 text-[var(--text-secondary)]">
                ⭐ Experience
              </p>
              <div className="flex flex-col gap-2">
                {EXPERIENCE_LEVELS.map((exp) => (
                  <button
                    key={exp}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        experience: filters.experience === exp ? "" : exp,
                      })
                    }
                    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filters.experience === exp ? "bg-[rgba(244,121,32,0.1)] text-[var(--primary)] border border-[var(--primary)]" : "bg-[var(--bg-primary)] border border-[var(--border-color)]"}`}
                  >
                    {exp}
                  </button>
                ))}
              </div>
            </div>

            {/* Training Type Filter */}
            <div>
              <p className="text-[10px] font-black uppercase mb-2.5 text-[var(--text-secondary)]">
                👟 Training Type
              </p>
              <div className="flex flex-col gap-2">
                {TRAINING_TYPES.map((t) => (
                  <button
                    key={t}
                    onClick={() =>
                      setFilters({
                        ...filters,
                        trainingType: filters.trainingType === t ? "" : t,
                      })
                    }
                    className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${filters.trainingType === t ? "bg-[rgba(244,121,32,0.1)] text-[var(--primary)] border border-[var(--primary)]" : "bg-[var(--bg-primary)] border border-[var(--border-color)]"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative min-h-[400px]">
        {(isLoading || isFetching) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20 bg-[var(--bg-primary)] bg-opacity-60 backdrop-blur-[2px] transition-all">
            <Loader2
              className="animate-spin text-[var(--primary)] mb-4"
              size={40}
            />
            <p className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">
              Updating Coaches...
            </p>
          </div>
        )}

        {isError ? (
          <div className="flex items-center justify-center py-20 font-bold text-red-500">
            Error loading coaches data.
          </div>
        ) : (
          <>
            {coaches?.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {coaches.map((coach: Coach) => (
                  <CoachCard key={coach._id} coach={coach} />
                ))}
              </div>
            ) : (
              !isLoading && (
                <div className="text-center py-20">
                  <p className="text-[var(--text-secondary)] font-medium">
                    No coaches found matching your criteria.
                  </p>
                </div>
              )
            )}
          </>
        )}
      </div>
      <BecomeCoachCTA />
    </div>
  );
};

export default CoachesPage;
