"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, RotateCcw, Dumbbell, Loader2 } from "lucide-react";
import { ExerciseRow } from "@/components/cards/ExerciseRowCard";
import { DetailsModal } from "@/components/user/DetailsModal";
import { SelectionDrawer } from "@/components/user/SelectionDrawer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const bodyParts = [
  "chest",
  "back",
  "shoulders",
  "quadriceps",
  "hamstrings",
  "glutes",
  "calves",
  "biceps",
  "triceps",
  "forearms",
  "abdominals",
  "traps",
  "adductors",
  "abductors",
];
const levels = ["beginner", "intermediate", "expert"];
const equipments = [
  "body only",
  "dumbbell",
  "barbell",
  "kettlebells",
  "cable",
  "machine",
  "bands",
];

export default function WorkoutBuilder() {
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [planName, setPlanName] = useState("");
  const [detailExercise, setDetailExercise] = useState(null);
  const {
    data: serverData,
    isLoading: loading,
    isFetching,
  } = useQuery({
    queryKey: [
      "workout-builder",
      search,
      selectedLevel,
      selectedEquipment,
      selectedBodyPart,
    ],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedLevel) params.append("level", selectedLevel);
      if (selectedEquipment) params.append("equipment", selectedEquipment);
      if (selectedBodyPart) params.append("bodyPart", selectedBodyPart);

      const res = await axios.get(
        `/api/exercises/builder?${params.toString()}`
      );
      return res.data;
    },
    staleTime: 5000,
  });

  const initialData = serverData?.type === "initial" ? serverData.data : [];
  const filteredData =
    serverData?.type === "filtered" ? serverData.exercises : [];
  const isFilterActive = !!(
    search ||
    selectedLevel ||
    selectedEquipment ||
    selectedBodyPart
  );

  const toggleExercise = (ex: any) => {
    setSelectedExercises((prev) =>
      prev.find((i) => i.id === ex.id)
        ? prev.filter((i) => i.id !== ex.id)
        : [...prev, ex]
    );
  };

  const handleSaveRoutine = (name: string) => {
    alert(`Routine "${name}" Saved Successfully!`);
    setSelectedExercises([]);
    setPlanName("");
  };


  return (
    <div className="w-full max-w-full overflow-x-hidden  py-8 pb-48 bg-[var(--bg-primary)] min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)]">
          Custom <span className="text-[var(--primary)]">Routine</span>
        </h1>
        <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
          Build your ultimate workout
        </p>
      </header>

      {/* Filter Section */}
      <div className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-md pb-6 space-y-6">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={20}
          />
          <input
            className="input-style !pl-12 !py-4 shadow-sm"
            placeholder="Search exercises (e.g. Bench Press)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {isFilterActive && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedLevel("");
                setSelectedEquipment("");
                setSelectedBodyPart("");
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--primary)] font-black text-[10px] uppercase bg-[var(--primary)]/10 px-3 py-1.5 rounded-lg hover:bg-[var(--primary)] hover:text-white transition-all"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="space-y-4">
          {/* Level Filter */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
              Level:
            </span>
            {levels.map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLevel(selectedLevel === l ? "" : l)}
                className={`whitespace-nowrap px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                  selectedLevel === l
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--primary)]/20"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--primary)]"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          {/* Equipment Filter  */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
              Gear:
            </span>
            {equipments.map((eq) => (
              <button
                key={eq}
                onClick={() =>
                  setSelectedEquipment(selectedEquipment === eq ? "" : eq)
                }
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center gap-2 ${
                  selectedEquipment === eq
                    ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-md shadow-[var(--primary)]/20"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--primary)]"
                }`}
              >
                {eq}
              </button>
            ))}
          </div>

          {/* Muscle Filter */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
              Muscle:
            </span>
            {bodyParts.map((p) => {
              const count =
                initialData.find((g: any) => g.part === p)?.count || 0;
              return (
                <button
                  key={p}
                  onClick={() =>
                    setSelectedBodyPart(selectedBodyPart === p ? "" : p)
                  }
                  className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center gap-2 ${
                    selectedBodyPart === p
                      ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                      : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)]"
                  }`}
                >
                  {p}{" "}
                  {!isFilterActive && (
                    <span className="bg-black/10 px-1 rounded ml-1 text-[9px]">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        {loading || isFetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin" />
          </div>
        ) : isFilterActive ? (
          <div>
            <p>Results Found: {filteredData.length}</p>
            {filteredData.map((ex: any) => (
              <ExerciseRow
                key={ex.id}
                exercise={ex}
                onSelect={toggleExercise}
                isSelected={selectedExercises.some((s) => s.id === ex.id)}
                onShowDetails={setDetailExercise}
              />
            ))}
          </div>
        ) : (
          initialData.map((group: any) => (
            <section key={group.part}>
              <h3>
                {group.part} ({group.count})
              </h3>
              {group.exercises.map((ex: any) => (
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  onSelect={toggleExercise}
                  isSelected={selectedExercises.some((s) => s.id === ex.id)}
                  onShowDetails={setDetailExercise}
                />
              ))}
              <button onClick={() => setSelectedBodyPart(group.part)}>
                View all →
              </button>
            </section>
          ))
        )}
      </div>

      <SelectionDrawer
        selectedExercises={selectedExercises}
        onRemove={toggleExercise}
        onSave={handleSaveRoutine}
        planName={planName}
        setPlanName={setPlanName}
      />

      <DetailsModal
        exercise={detailExercise}
        onClose={() => setDetailExercise(null)}
      />
    </div>
  );
}
