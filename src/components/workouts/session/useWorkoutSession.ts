"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { SessionExercise, WorkoutResponse } from "./types";

export function useWorkoutSession() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [exIdx, setExIdx] = useState(0);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);
  const [phase, setPhase] = useState<"exercise" | "rest">("exercise");
  const [restLeft, setRestLeft] = useState(0);
  const [totalRest, setTotalRest] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);

  const { data: routineData, isLoading } = useQuery<WorkoutResponse>({
    queryKey: ["session-routine", id],
    queryFn: async () => (await axios.get(`/api/routines/${id}`)).data,
    enabled: !!id,
  });

  useEffect(() => {
    if (routineData?.success && exercises.length === 0) {
      const initial = routineData.data.exercises.map((ex) => ({
        ...ex,
        sets:
          ex.sets && ex.sets.length > 0
            ? ex.sets.map((s) => ({ ...s, isCompleted: false, previous: s.previous || "-" }))
            : [{ id: crypto.randomUUID(), weight: "", reps: "", seconds: "", previous: "-", isCompleted: false }],
      }));
      setExercises(initial);
    }
  }, [routineData, exercises.length]);

  useEffect(() => {
    if (!running || phase === "rest") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running, phase]);

  useEffect(() => {
    if (phase !== "rest") return;
    if (restLeft <= 0) {
      setPhase("exercise");
      return;
    }
    const t = setTimeout(() => setRestLeft((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, restLeft]);

  const current = exercises[exIdx];
  const isLastExercise = exIdx >= exercises.length - 1;
  const completedSets = current?.sets?.filter((s) => s.isCompleted).length ?? 0;
  const totalSets = current?.sets?.length ?? 0;
  const allSetsDone = completedSets === totalSets && totalSets > 0;
  const currentSetNum = Math.min(completedSets + 1, totalSets);
  const progress = totalSets > 0 ? completedSets / totalSets : 0;

  const handleToggleSet = (setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) => {
                if (j !== setIdx) return s;
                const isNow = !s.isCompleted;
                if (isNow) {
                  setTotalRest(30);
                  setRestLeft(30);
                  setTimeout(() => setPhase("rest"), 50);
                }
                return { ...s, isCompleted: isNow };
              }),
            }
      )
    );
  };

  const handleChangeSet = (setIdx: number, field: string, val: string) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : { ...ex, sets: ex.sets.map((s, j) => (j === setIdx ? { ...s, [field]: val } : s)) }
      )
    );
  };

  const handleAddSet = () => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: [...ex.sets, { id: crypto.randomUUID(), weight: "", reps: "", seconds: "", previous: "-", isCompleted: false }],
            }
      )
    );
  };

  const handleFinish = async () => {
    const completed = exercises
      .map((ex) => ({
        exerciseId: (ex._id || ex.id)?.toString(),
        name: ex.name,
        trackingType: ex.trackingType,
        sets: ex.sets.filter((s) => s.isCompleted),
      }))
      .filter((ex) => ex.sets.length > 0);

    if (completed.length === 0) {
      toast.warning("Please complete at least one set before finishing!");
      return;
    }
    setIsSaving(true);
    try {
      const res = await axios.post("/api/routines/finish", {
        routineId: id,
        planName: routineData?.data?.planName,
        duration: elapsed,
        exercises: completed,
        date: new Date().toISOString(),
      });
      if (res.data.success) {
        toast.success("Workout saved! Keep it up 💪");
        router.push("/dashboard");
      }
    } catch {
      toast.error("Failed to save workout session.");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    id,
    router,
    exIdx,
    setExIdx,
    exercises,
    phase,
    setPhase,
    restLeft,
    setRestLeft,
    totalRest,
    elapsed,
    running,
    setRunning,
    isSaving,
    infoOpen,
    setInfoOpen,
    isLoading: isLoading || (Boolean(routineData) && exercises.length === 0),
    current,
    isLastExercise,
    completedSets,
    totalSets,
    allSetsDone,
    currentSetNum,
    progress,
    handleToggleSet,
    handleChangeSet,
    handleAddSet,
    handleFinish,
  };
}
