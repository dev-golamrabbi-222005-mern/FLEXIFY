"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, RotateCcw,Loader2, Dumbbell } from "lucide-react";
import { ExerciseRow } from "@/components/cards/ExerciseRowCard";
import { DetailsModal } from "@/components/user/DetailsModal";
import { SelectionDrawer } from "@/components/user/SelectionDrawer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FilterSection } from "@/components/user/FilterSection";
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [planName, setPlanName] = useState("");
  const [detailExercise, setDetailExercise] = useState(null);
  const [initialGroups, setInitialGroups] = useState<any[]>([]);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    {}
  );
  const [allExercises, setAllExercises] = useState<any[]>([]);
  useEffect(() => {
    setAllExercises([]);
    setVisibleCounts({});
  }, [search, selectedLevel, selectedEquipment]);
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
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });
  useEffect(() => {
    if (!serverData) return;
    if (serverData.type === "filtered") {
      setAllExercises(serverData.exercises);
    } else if (serverData.type === "initial") {
      setInitialGroups(serverData.data);
    }
  }, [serverData]);
  const isFilterActive = !!(search || selectedLevel || selectedEquipment);
  const initialData = serverData?.type === "initial" ? serverData.data : [];

  const groupedFilteredData = useMemo(() => {
    if (!isFilterActive) return [];
    const groups: Record<string, any[]> = {};
    allExercises.forEach((ex) => {
      const part =
        ex.bodyPart || (ex.primaryMuscles && ex.primaryMuscles[0]) || "Other";
      const normalizedPart = part.toLowerCase();
      if (!groups[normalizedPart]) {
        groups[normalizedPart] = [];
      }
      groups[normalizedPart].push(ex);
    });
    return Object.entries(groups).map(([part, exercises]) => ({
      part,
      exercises,
    }));
  }, [allExercises, isFilterActive]);
  const toggleExercise = (ex: any) => {
    setSelectedExercises((prev) =>
      prev.find((i) => i.id === ex.id)
        ? prev.filter((i) => i.id !== ex.id)
        : [...prev, ex]
    );
  };
  const handleLoadMore = (part: string) => {
    const partKey = part.toLowerCase();
    setVisibleCounts((prev) => ({
      ...prev,
      [partKey]: (prev[partKey] || 5) + 10,
    }));
  };

  const handleSaveRoutine = async (userData: { planName: string; userName: string; userEmail: string }) => {
    if (selectedExercises.length === 0) {
      alert("Please select at least one exercise!");
      return;
    }
   
    try {
    const routineData = {
      planName: userData.planName,
      exercises: selectedExercises,
      createdAt: new Date(),
    };
    
    const response = await axios.post("/api/routines/save", routineData);

    if (response.data.success) {
      alert(`Awesome! Your plan "${userData.planName}" is saved.`);
      setSelectedExercises([]);
      setPlanName("");
    }
  } catch (error: any) {
    console.error("Save Error:", error);
    alert(error.response?.data?.message || "Failed to save routine.");
  }
};
  const displayData = isFilterActive ? groupedFilteredData : initialGroups;

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

        <FilterSection
          levels={levels}
          equipments={equipments}
          bodyParts={bodyParts}
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          selectedEquipment={selectedEquipment}
          setSelectedEquipment={setSelectedEquipment}
          selectedBodyPart={selectedBodyPart}
          setSelectedBodyPart={setSelectedBodyPart}
          stats={serverData?.stats}
          initialData={initialData}
          isFilterActive={isFilterActive}
        />
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-[var(--primary)]" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] animate-pulse">
              Loading Exercises...
            </p>
          </div>
        ) : displayData.length > 0 ? (
          <div className={`${isFetching ? "opacity-50 pointer-events-none" : ""} transition-opacity duration-300`}>
            {displayData.map((group: any) => (
              <section
                key={group.part}
                className="border-l-4 border-[var(--primary)] pl-4 mb-10"
              >
                <h3 className="text-xl font-black uppercase mb-4 text-[var(--text-primary)]">
                  {group.part}
                  <span className="ml-2 text-xs opacity-50">
                    ({isFilterActive ? group.exercises.length : group.count})
                  </span>
                </h3>

                <div className="space-y-3">
                  {group.exercises
                    .slice(0, visibleCounts[group.part.toLowerCase()] || 5)
                    .map((ex: any, idx: number) => (
                      <ExerciseRow
                        key={`${ex.id}-${idx}`}
                        exercise={ex}
                        onSelect={toggleExercise}
                        isSelected={selectedExercises.some((s) => s.id === ex.id)}
                        onShowDetails={setDetailExercise}
                      />
                    ))}
                </div>

                {(isFilterActive ? group.exercises.length : group.count) >
                  (visibleCounts[group.part.toLowerCase()] || 5) && (
                  <button
                    onClick={() => handleLoadMore(group.part)}
                    className="mt-4 flex items-center gap-2 text-[var(--primary)] font-black text-[10px] uppercase hover:tracking-widest transition-all"
                  >
                    {isFetching ? (
                      <Loader2 className="animate-spin" size={12} />
                    ) : (
                      <RotateCcw size={12} />
                    )}
                    Load More {group.part}
                  </button>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 flex flex-col items-center justify-center border-2 border-dashed border-[var(--border-color)] rounded-3xl mx-4">
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
        )}
      </div>

      <SelectionDrawer
        selectedExercises={selectedExercises}
        onRemove={toggleExercise}
        onSave={handleSaveRoutine}
        planName={planName}
        setPlanName={setPlanName}
        userSession={{
        name: session?.user?.name || "",
        email: session?.user?.email || ""
      }}
      />

      <DetailsModal
        exercise={detailExercise}
        onClose={() => setDetailExercise(null)}
      />
    </div>
  );
}
