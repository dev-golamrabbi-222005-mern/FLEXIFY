// app/dashboard/challenges/[type]/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { ChallengeType, Level, DayPlan } from "@/lib/challengeUtils";
import { ChallengeExercise } from "@/components/challenges/DayExerciseList";
import { LevelSelectModal } from "@/components/challenges/LevelSelectModal";
import { WeekPlanGrid } from "@/components/challenges/WeekPlanGrid";
import { DayExerciseList } from "@/components/challenges/DayExerciseList";
import { WorkoutSession } from "@/components/challenges/WorkoutSession";
import { DayComplete } from "@/components/challenges/DayComplete";

type Screen = "plan" | "day-preview" | "session" | "complete";

const CHALLENGE_TITLES: Record<ChallengeType, string> = {
  "upper-body": "Upper Body 7×4 Challenge",
  "lower-body": "Lower Body 7×4 Challenge",
};

export default function ChallengePage() {
  const { type } = useParams() as { type: ChallengeType };
  const router = useRouter();

  // ── UI state ──────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("plan");
  const [levelModalOpen, setLevelModalOpen] = useState(true);
  const [level, setLevel] = useState<Level | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  // ── Data ──────────────────────────────────────────────────────────────────
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [exercises, setExercises] = useState<ChallengeExercise[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [sessionResult, setSessionResult] = useState<{
    durationSecs: number;
    caloriesBurned: number;
  } | null>(null);

  // ── Loading ───────────────────────────────────────────────────────────────
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingExs, setLoadingExs] = useState(false);

  // Validate type
  if (type !== "upper-body" && type !== "lower-body") {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">❌</p>
        <p className="font-bold" style={{ color: "var(--text-primary)" }}>
          Invalid challenge type
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--primary)" }}
        >
          Go Home
        </button>
      </div>
    );
  }

  // ── Fetch plan when level is selected ─────────────────────────────────────
  const handleLevelSelect = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setLevelModalOpen(false);
    setLoadingPlan(true);

    try {
      const res = await fetch(`/api/challenges/plan?type=${type}`);
      const data = await res.json();
      setPlan(data.plan);
    } catch (err) {
      console.error("Failed to load plan", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  // ── Fetch exercises when a day is selected ─────────────────────────────────
  const handleSelectDay = async (dayPlan: DayPlan) => {
    setSelectedDay(dayPlan);
    setLoadingExs(true);
    setScreen("day-preview");

    try {
      const res = await fetch(
        `/api/challenges/exercises?type=${type}&level=${level}&day=${dayPlan.day}`,
      );
      const data = await res.json();
      setExercises(data.exercises ?? []);
    } catch (err) {
      console.error("Failed to load exercises", err);
    } finally {
      setLoadingExs(false);
    }
  };

  // ── Session complete ───────────────────────────────────────────────────────
  const handleSessionComplete = (result: {
    durationSecs: number;
    caloriesBurned: number;
  }) => {
    setSessionResult(result);
    setScreen("complete");
    // Optimistically add to completedDays
    if (selectedDay && !completedDays.includes(selectedDay.day)) {
      setCompletedDays((prev) => [...prev, selectedDay.day]);
    }
  };

  // ── Navigate to next day ──────────────────────────────────────────────────
  const handleNextDay = () => {
    if (!selectedDay) return;
    const nextDayNum = selectedDay.day + 1;
    const nextDay = plan.find((d) => d.day === nextDayNum);
    if (nextDay) {
      handleSelectDay(nextDay);
    } else {
      // Challenge complete!
      router.push(`/?challenge=complete&type=${type}`);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-8 md:px-6"
      style={{
        fontFamily: "'Sora', sans-serif",
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Level Select Modal ── */}
      <LevelSelectModal
        open={levelModalOpen}
        challengeTitle={CHALLENGE_TITLES[type]}
        onSelect={handleLevelSelect}
        onClose={() => router.back()}
      />

      {/* ── Loading ── */}
      {(loadingPlan || loadingExs) && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2
            size={36}
            className="animate-spin"
            style={{ color: "var(--primary)" }}
          />
          <p
            className="text-[11px] font-black uppercase tracking-widest animate-pulse"
            style={{ color: "var(--text-secondary)" }}
          >
            {loadingPlan ? "Building your plan..." : "Loading exercises..."}
          </p>
        </div>
      )}

      {/* ── Plan Grid ── */}
      {!loadingPlan &&
        !loadingExs &&
        screen === "plan" &&
        plan.length > 0 &&
        level && (
          <WeekPlanGrid
            type={type}
            level={level}
            plan={plan}
            completedDays={completedDays}
            onSelectDay={handleSelectDay}
            onBack={() => router.back()}
          />
        )}

      {/* ── Day Exercise Preview ── */}
      {!loadingExs && screen === "day-preview" && selectedDay && (
        <DayExerciseList
          dayPlan={selectedDay}
          exercises={exercises}
          onStart={() => setScreen("session")}
          onBack={() => setScreen("plan")}
        />
      )}

      {/* ── Active Session ── */}
      {screen === "session" && selectedDay && (
        <WorkoutSession
          dayPlan={selectedDay}
          exercises={exercises}
          onComplete={handleSessionComplete}
          onQuit={() => setScreen("day-preview")}
        />
      )}

      {/* ── Day Complete ── */}
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
