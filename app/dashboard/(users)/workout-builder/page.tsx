"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Search, RotateCcw, Dumbbell, Loader2 } from "lucide-react";
import { ExerciseRow } from "@/components/cards/ExerciseRowCard";
import { DetailsModal } from "@/components/user/DetailsModal";
import { SelectionDrawer } from "@/components/user/SelectionDrawer";

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
const BACK_SUB_MUSCLES = ["back", "lats", "middle back", "lower back"];

export default function WorkoutBuilder() {
  const [exercisesData, setExercisesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>(
    bodyParts.reduce((acc, part) => ({ ...acc, [part]: 5 }), {})
  );
  const [planName, setPlanName] = useState("");
  const [detailExercise, setDetailExercise] = useState(null);

  useEffect(() => {
    fetch("/exercises.json")
      .then((res) => res.json())
      .then((data) => {
        setExercisesData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error:", err);
        setLoading(false);
      });
  }, []);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
   bodyParts.forEach((part) => {
      const filteredForMuscle = exercisesData.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = selectedLevel ? ex.level === selectedLevel : true;
        const matchesEquip = selectedEquipment ? ex.equipment === selectedEquipment : true;
        
        let matchesPart = false;
        if (part === "back") {
          matchesPart = BACK_SUB_MUSCLES.some((m) => ex.primaryMuscles.includes(m));
        } else {
          matchesPart = ex.primaryMuscles.includes(part);
        }
        
        return matchesSearch && matchesLevel && matchesEquip && matchesPart;
      });
      counts[part] = filteredForMuscle.length;
    });

    equipments.forEach((eq) => {
      const filteredForEquip = exercisesData.filter((ex) => {
        const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
        const matchesLevel = selectedLevel ? ex.level === selectedLevel : true;
        const matchesPart = selectedBodyPart 
          ? (selectedBodyPart === "back" 
              ? BACK_SUB_MUSCLES.some(m => ex.primaryMuscles.includes(m)) 
              : ex.primaryMuscles.includes(selectedBodyPart))
          : true;

        return matchesSearch && matchesLevel && matchesPart && ex.equipment === eq;
      });
      counts[eq] = filteredForEquip.length;
    });

    return counts;
  }, [exercisesData, search, selectedLevel, selectedEquipment, selectedBodyPart]);

  const filteredData = useMemo(() => {
    return exercisesData.filter((ex) => {
      const matchesSearch = ex.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesLevel = selectedLevel ? ex.level === selectedLevel : true;
      const matchesEquip = selectedEquipment
        ? ex.equipment === selectedEquipment
        : true;
      let matchesPart = true;
      if (selectedBodyPart) {
        if (selectedBodyPart === "back") {
          matchesPart = BACK_SUB_MUSCLES.some((m) =>
            ex.primaryMuscles.includes(m)
          );
        } else {
          matchesPart = ex.primaryMuscles.includes(selectedBodyPart);
        }
      }
      return matchesSearch && matchesLevel && matchesEquip && matchesPart;
    });
  }, [
    search,
    selectedLevel,
    selectedEquipment,
    selectedBodyPart,
    exercisesData,
  ]);

  const isFilterActive =
    search || selectedLevel || selectedEquipment || selectedBodyPart;

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

  const loadMore = (part: string) => {
    setVisibleCounts((prev) => ({ ...prev, [part]: prev[part] + 5 }));
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );

  return (
    <div className="w-full max-w-full overflow-x-hidden px-4 py-8 pb-48 bg-[var(--bg-primary)] min-h-screen">
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
                {eq}{" "}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                    selectedEquipment === eq
                      ? "bg-white/20"
                      : "bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {stats[eq] || 0}
                </span>
              </button>
            ))}
          </div>

          {/* Muscle Filter */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar items-center py-1">
            <span className="text-[10px] font-black uppercase text-[var(--text-muted)] tracking-wider">
              Muscle:
            </span>
            {bodyParts.map((p) => (
              <button
                key={p}
                onClick={() =>
                  setSelectedBodyPart(selectedBodyPart === p ? "" : p)
                }
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border flex items-center gap-2 ${
                  selectedBodyPart === p
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-[var(--bg-secondary)] text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--primary)]"
                }`}
              >
                {p}{" "}
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-md ${
                    selectedBodyPart === p
                      ? "bg-white/20"
                      : "bg-[var(--bg-tertiary)]"
                  }`}
                >
                  {stats[p] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mt-8">
        {isFilterActive ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[11px] font-black uppercase text-[var(--primary)] tracking-[0.15em]">
                Results Found: {filteredData.length}
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {filteredData.slice(0, 50).map((ex) => (
                <ExerciseRow
                  key={ex.id}
                  exercise={ex}
                  onSelect={toggleExercise}
                  isSelected={selectedExercises.some((s) => s.id === ex.id)}
                  onShowDetails={setDetailExercise}
                />
              ))}
            </div>
          </div>
        ) : (
          bodyParts.map((part) => {
            const exercisesInPart = exercisesData.filter((ex) => {
              if (part === "back")
                return BACK_SUB_MUSCLES.some((m) =>
                  ex.primaryMuscles.includes(m)
                );
              return ex.primaryMuscles.includes(part);
            });
            if (exercisesInPart.length === 0) return null;
            return (
              <section key={part} className="mb-12">
                <h3 className="font-black uppercase text-sm tracking-[0.2em] flex items-center gap-3 mb-5 text-[var(--text-primary)] border-b border-[var(--border-color)] pb-3">
                  <span className="p-1.5 bg-[var(--primary)]/10 rounded-lg">
                    <Dumbbell size={16} className="text-[var(--primary)]" />
                  </span>
                  {part}{" "}
                  <span className="text-[var(--text-muted)] text-xs font-medium">
                    ({exercisesInPart.length})
                  </span>
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {exercisesInPart.slice(0, visibleCounts[part]).map((ex) => (
                    <ExerciseRow
                      key={ex.id}
                      exercise={ex}
                      onSelect={toggleExercise}
                      isSelected={selectedExercises.some((s) => s.id === ex.id)}
                      onShowDetails={setDetailExercise}
                    />
                  ))}
                </div>
                {visibleCounts[part] < exercisesInPart.length && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => loadMore(part)}
                      className="btn-secondary !py-2 !px-6 !text-[10px] !rounded-full flex items-center gap-2 uppercase tracking-widest active:scale-95 transition-all"
                    >
                      <RotateCcw size={14} /> Load More
                    </button>
                  </div>
                )}
              </section>
            );
          })
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
