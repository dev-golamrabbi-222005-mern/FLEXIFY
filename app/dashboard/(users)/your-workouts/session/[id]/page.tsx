"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Play, Clock, Save } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ExerciseCard from "@/components/user/ExerciseCard";
import RestTimer from "@/components/user/RestTimer";
import { Exercise, WorkoutResponse } from "@/components/user/workout";
import { toast } from "react-toastify";

export default function WorkoutSessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { data: routineData, isLoading } = useQuery<WorkoutResponse>({
    queryKey: ["session-routine", id],
    queryFn: async () => {
      const res = await axios.get(`/api/routines/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    const interval = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(interval);
  }, []);

useEffect(() => {
  if (routineData?.success && exercises.length === 0) {
    const initial = routineData.data.exercises.map((ex) => ({
      ...ex,
      sets: ex.sets && ex.sets.length > 0 
        ? ex.sets.map(s => ({ 
            ...s, 
            isCompleted: false,
            // Jodi backend theke 'previous' data ashe tobe seta boshbe, na thakle "-"
            previous: s.previous || "-" 
          })) 
        : [{ 
            id: crypto.randomUUID(), 
            weight: "", 
            reps: "", 
            seconds: "", 
            previous: "-", // Notun set-er jonno default "-"
            isCompleted: false 
          }],
    }));
    setExercises(initial);
  }
}, [routineData, exercises.length]);
  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

const handleSetComplete = (exIdx: number, setIdx: number, capturedTime?: string) => {
    setExercises((prev) => 
      prev.map((ex, i) => {
        if (i !== exIdx) return ex; 
        
        const updatedSets = ex.sets.map((set, j) => {
          if (j !== setIdx) return set; 
          
          const isNowCompleted = !set.isCompleted;
          
          if (isNowCompleted) {
            setShowRestTimer(false);
            setTimeout(() => setShowRestTimer(true), 50);
          }

          return { 
            ...set, 
            isCompleted: isNowCompleted, 
            seconds: capturedTime || set.seconds 
          };
        });

        return { ...ex, sets: updatedSets };
      })
    );
  };
  const handleFinishSession = async () => {
    const completedExercises = exercises
      .map((ex) => ({
        exerciseId: (ex._id || ex.id)?.toString(),
        name: ex.name,
        trackingType: ex.trackingType,
        sets: ex.sets.filter((s) => s.isCompleted), // শুধুমাত্র কমপ্লিট হওয়া সেট
      }))
      .filter((ex) => ex.sets.length > 0);

    if (completedExercises.length === 0) {
      toast.warning("Please complete at least one set before finishing!", {
      position: "top-center",
      autoClose: 3000,
    });
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        routineId: id,
        planName: routineData?.data?.planName,
        duration: secondsElapsed,
        exercises: completedExercises,
        date: new Date().toISOString(),
      };

      const res = await axios.post("/api/routines/finish", payload);

      if (res.data.success) {
        toast.success("Workout saved successfully! Keep it up.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save workout session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || (routineData && exercises.length === 0))
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );


  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pb-40 text-[var(--text-primary)]">
        <title>Your Session | Dashboard - Flexify</title>
      {/* Integrated Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-color)] px-4 py-4">
        <div className="max-w-full flex justify-between items-center">
          {/* Left: Routine Info */}
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-2 bg-[var(--primary)]/10 rounded-lg">
              <Play
                size={16}
                className="text-[var(--primary)] fill-[var(--primary)]"
              />
            </div>
            <h1 className="text-sm font-black uppercase tracking-tighter truncate max-w-[120px] sm:max-w-none">
              {routineData?.data?.planName}
            </h1>
          </div>

          {/* Center: Timer (The focus point) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5 text-[var(--primary)] mb-0.5">
              <Clock size={12} className="animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-[0.2em]">
                Duration
              </span>
            </div>
            <span className="text-sm font-black tabular-nums tracking-widest text-[var(--text-primary)]">
              {formatTime(secondsElapsed)}
            </span>
          </div>

          {/* Right: Action Button */}
          <button
            onClick={handleFinishSession}
            disabled={isSaving}
            className="..."
          >
            {isSaving ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            <span className="hidden sm:inline">
              {isSaving ? "Saving..." : "Finish"}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full  p-4 space-y-4 mt-2">
        {exercises.map((ex, idx) => (
          <ExerciseCard
            key={ex._id|| `ex-${idx}`}
            exercise={ex}
            exIdx={idx}
            setExercises={setExercises}
            onToggleComplete={handleSetComplete}
          />
        ))}
      </main>

      {showRestTimer && <RestTimer onClose={() => setShowRestTimer(false)} />}
    </div>
  );
}
