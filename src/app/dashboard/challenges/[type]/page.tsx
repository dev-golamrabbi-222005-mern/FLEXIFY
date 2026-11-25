"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ChallengeType, DayPlan } from "@/lib/challengeUtils";
import { LevelSelectModal } from "@/components/challenges/LevelSelectModal";
import { WeekPlanGrid } from "@/components/challenges/WeekPlanGrid";
import { DayExerciseList } from "@/components/challenges/DayExerciseList";
import { WorkoutSession } from "@/components/challenges/WorkoutSession";
import { DayComplete } from "@/components/challenges/DayComplete";
import { useChallengeState } from "./useChallengeState";

type Screen = "plan" | "day-preview" | "session" | "complete";

const CHALLENGE_TITLES: Record<ChallengeType, string> = {
  "upper-body": "Upper Body 7×4 Challenge",
  "lower-body": "Lower Body 7×4 Challenge",
};

export default function ChallengePage() {
  const { type } = useParams() as { type: ChallengeType };
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("plan");
  const [sessionResult, setSessionResult] = useState<{
    durationSecs: number;
    caloriesBurned: number;
  } | null>(null);

  const {
    level,
    plan,
    exercises,
    completedDays,
    setCompletedDays,
    selectedDay,
    levelModalOpen,
    initialising,
    loadingPlan,
    loadingExs,
    handleLevelSelect,
    loadDayExercises,
  } = useChallengeState(type);

  if (type !== "upper-body" && type !== "lower-body") {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">❌</p>
        <p className="font-bold text-[var(--text-primary)]">Invalid challenge type</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white bg-[var(--primary)] cursor-pointer"
        >
          Go Home
        </button>
      </div>
    );
  }

  const handleSelectDay = async (dayPlan: DayPlan) => {
    await loadDayExercises(dayPlan);
    setScreen("day-preview");
  };

  const handleSessionComplete = (result: {
    durationSecs: number;
    caloriesBurned: number;
  }) => {
    setSessionResult(result);
    setScreen("complete");
    if (selectedDay && !completedDays.includes(selectedDay.day)) {
      setCompletedDays((prev) => [...prev, selectedDay.day]);
    }
  };

  const handleNextDay = () => {
    if (!selectedDay) return;
    const nextDay = plan.find((d) => d.day === selectedDay.day + 1);
    if (nextDay) {
      handleSelectDay(nextDay);
    } else {
      router.push(`/?challenge=complete&type=${type}`);
    }
  };

  const isLoading = initialising || loadingPlan || loadingExs;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <LevelSelectModal
        open={levelModalOpen}
        challengeTitle={CHALLENGE_TITLES[type]}
        onSelect={handleLevelSelect}
        onClose={() => router.back()}
      />

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 size={36} className="animate-spin text-[var(--primary)]" />
          <p className="text-[11px] font-black uppercase tracking-widest animate-pulse text-[var(--text-secondary)]">
            {initialising
              ? "Loading your progress..."
              : loadingPlan
                ? "Building your plan..."
                : "Loading exercises..."}
          </p>
        </div>
      )}

      {!isLoading && screen === "plan" && plan.length > 0 && level && (
        <WeekPlanGrid
          type={type}
          level={level}
          plan={plan}
          completedDays={completedDays}
          onSelectDay={handleSelectDay}
          onBack={() => router.back()}
        />
      )}

      {!loadingExs && screen === "day-preview" && selectedDay && (
        <DayExerciseList
          dayPlan={selectedDay}
          exercises={exercises}
          onStart={() => setScreen("session")}
          onBack={() => setScreen("plan")}
        />
      )}

      {screen === "session" && selectedDay && (
        <WorkoutSession
          dayPlan={selectedDay}
          exercises={exercises}
          onComplete={handleSessionComplete}
          onQuit={() => setScreen("day-preview")}
        />
      )}

      {screen === "complete" && selectedDay && sessionResult && level && (
        <DayComplete
          dayPlan={selectedDay}
          type={type}
          level={level}
          durationSecs={sessionResult.durationSecs}
          caloriesBurned={sessionResult.caloriesBurned}
          exercisesDone={exercises.length}
          completedDays={completedDays}
          onDoAgain={() => setScreen("session")}
          onNextDay={handleNextDay}
        />
      )}
    </div>
  );
}
