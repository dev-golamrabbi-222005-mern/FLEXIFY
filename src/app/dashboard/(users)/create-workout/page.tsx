"use client";

import React, { useState, useMemo } from "react";
import { Loader2 } from "lucide-react";
import { DetailsModal } from "@/components/user/DetailsModal";
import { SelectionDrawer } from "@/components/user/SelectionDrawer";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FilterSection } from "@/components/user/FilterSection";
import { Exercise } from "@/components/user/workout";
import { toast } from "react-toastify";
import PlanAccessModal from "@/components/modals/PlanAccessModal";
import { PlanId } from "@/lib/plans";
import WorkoutBuilderHeader from "@/components/dashboard/builder/WorkoutBuilderHeader";
import ExerciseGroupSection from "@/components/dashboard/builder/ExerciseGroupSection";
import WorkoutEmptyState from "@/components/dashboard/builder/WorkoutEmptyState";

import { BODY_PARTS, LEVELS, EQUIPMENTS } from "@/components/dashboard/builder/builderConstants";

interface ExerciseGroup {
  part: string;
  exercises: Exercise[];
  count?: number;
}

export default function WorkoutBuilder() {
  const { data: session } = useSession();
  const [search, setSearch] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState("");
  const [selectedBodyPart, setSelectedBodyPart] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<Exercise[]>([]);
  const [planName, setPlanName] = useState("");
  const [detailExercise, setDetailExercise] = useState<Exercise | null>(null);
  const [visibleCounts, setVisibleCounts] = useState<Record<string, number>>({});

  const { data: dbUser } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  const userPlan = (dbUser?.plan as PlanId) || "free";
  const resetVisibleCounts = () => setVisibleCounts({});
  const clearFilters = () => {
    setSearch("");
    setSelectedLevel("");
    setSelectedEquipment("");
    setSelectedBodyPart("");
    setVisibleCounts({});
  };

  const { data: serverData, isLoading: loading, isFetching } = useQuery({
    queryKey: ["workout-builder", search, selectedLevel, selectedEquipment, selectedBodyPart],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedLevel) params.append("level", selectedLevel);
      if (selectedEquipment) params.append("equipment", selectedEquipment);
      if (selectedBodyPart) params.append("bodyPart", selectedBodyPart);
      const res = await axios.get(`/api/exercises/builder?${params.toString()}`);
      return res.data;
    },
    placeholderData: (prev) => prev,
    staleTime: 5000,
  });

  const isFilterActive = !!(search || selectedLevel || selectedEquipment || selectedBodyPart);
  const allExercises = serverData?.type === "filtered" ? (serverData.exercises as Exercise[]) : [];
  const initialGroups = serverData?.type === "initial" ? (serverData.data as ExerciseGroup[]) : [];
  const initialData = serverData?.type === "initial" ? serverData.data : [];

  const groupedFilteredData = useMemo(() => {
    if (!isFilterActive) return [];
    const groups: Record<string, Exercise[]> = {};
    allExercises.forEach((ex) => {
      const part = ex.bodyPart || (ex.primaryMuscles && ex.primaryMuscles[0]) || "Other";
      const normalizedPart = part.toLowerCase();
      if (!groups[normalizedPart]) groups[normalizedPart] = [];
      groups[normalizedPart].push(ex);
    });
    return Object.entries(groups).map(([part, exercises]) => ({ part, exercises }));
  }, [allExercises, isFilterActive]);

  const toggleExercise = (ex: Exercise) => {
    setSelectedExercises((prev) =>
      prev.find((i) => i.id === ex.id) ? prev.filter((i) => i.id !== ex.id) : [...prev, ex]
    );
  };

  const handleLoadMore = (part: string) => {
    const partKey = part.toLowerCase();
    setVisibleCounts((prev) => ({ ...prev, [partKey]: (prev[partKey] || 5) + 10 }));
  };

  const handleSaveRoutine = async (userData: { planName: string; userName: string; userEmail: string }) => {
    if (selectedExercises.length === 0) {
      toast("Please select at least one exercise!");
      return;
    }
    try {
      const routineData = { planName: userData.planName, exercises: selectedExercises, createdAt: new Date() };
      const response = await axios.post("/api/routines/save", routineData);
      if (response.data.success) {
        toast(`Awesome! Your plan "${userData.planName}" is saved.`);
        setSelectedExercises([]);
        setPlanName("");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) toast(error.response?.data?.message || "Failed to save routine.");
      else toast("An unexpected error occurred.");
    }
  };

  const displayData = (isFilterActive ? groupedFilteredData : initialGroups) as ExerciseGroup[];

  return (
    <>
      <PlanAccessModal currentPlan={userPlan} requiredPlan="pro" isOpen={userPlan === "free"} onClose={() => {}} />
      <div className="max-w-full min-h-screen overflow-x-hidden">
        <title>Create Workout | Dashboard - Flexify</title>
        <WorkoutBuilderHeader
          search={search}
          onSearchChange={(v) => { setSearch(v); resetVisibleCounts(); }}
          isFilterActive={isFilterActive}
          onClearFilters={clearFilters}
        />

        <div className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-md pb-6 space-y-6">
          <FilterSection
            levels={LEVELS}
            equipments={EQUIPMENTS}
            bodyParts={BODY_PARTS}
            selectedLevel={selectedLevel}
            setSelectedLevel={(v) => { setSelectedLevel(v); resetVisibleCounts(); }}
            selectedEquipment={selectedEquipment}
            setSelectedEquipment={(v) => { setSelectedEquipment(v); resetVisibleCounts(); }}
            selectedBodyPart={selectedBodyPart}
            setSelectedBodyPart={(v) => { setSelectedBodyPart(v); resetVisibleCounts(); }}
            stats={serverData?.stats}
            initialData={initialData}
            isFilterActive={isFilterActive}
          />
        </div>

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
              {displayData.map((group: ExerciseGroup) => (
                <ExerciseGroupSection
                  key={group.part}
                  group={group}
                  isFilterActive={isFilterActive}
                  visibleCount={visibleCounts[group.part.toLowerCase()] || 5}
                  selectedExercises={selectedExercises}
                  isFetching={isFetching}
                  onToggleExercise={toggleExercise}
                  onShowDetails={setDetailExercise}
                  onLoadMore={handleLoadMore}
                />
              ))}
            </div>
          ) : (
            <WorkoutEmptyState />
          )}
        </div>

        <SelectionDrawer
          selectedExercises={selectedExercises}
          onRemove={toggleExercise}
          onSave={handleSaveRoutine}
          planName={planName}
          setPlanName={setPlanName}
          userSession={{ name: (session?.user?.name as string) || "", email: (session?.user?.email as string) || "" }}
        />
        <DetailsModal exercise={detailExercise} onClose={() => setDetailExercise(null)} />
      </div>
    </>
  );
}
