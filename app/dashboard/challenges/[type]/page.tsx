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

  // ── UI state ───────────────────────────────────────────────────────────────
  const [screen, setScreen] = useState<Screen>("plan");
  const [levelModalOpen, setLevelModalOpen] = useState(false); // starts false — we check DB first
  const [level, setLevel] = useState<Level | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);

  // ── Data ───────────────────────────────────────────────────────────────────
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [exercises, setExercises] = useState<ChallengeExercise[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [sessionResult, setSessionResult] = useState<{
    durationSecs: number;
    caloriesBurned: number;
  } | null>(null);

  // ── Loading ────────────────────────────────────────────────────────────────
  const [initialising, setInitialising] = useState(true); // checking DB on mount
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingExs, setLoadingExs] = useState(false);

  // ── On mount: check if user already has a progress record ─────────────────
  useEffect(() => {
    if (type !== "upper-body" && type !== "lower-body") return;

    const init = async () => {
      try {
        // 1. Check existing progress in DB
        const res = await fetch(`/api/challenges/progress?type=${type}`);
        const data = await res.json();

        if (data.progress?.level) {
          // Returning user — restore level + completed days, skip modal
          const savedLevel = data.progress.level as Level;
          const savedDays: number[] = (data.progress.completedDays ?? []).map(
            (d: { day: number }) => d.day,
          );

          setLevel(savedLevel);
          setCompletedDays(savedDays);

          // Fetch plan silently
          const planRes = await fetch(`/api/challenges/plan?type=${type}`);
          const planData = await planRes.json();
          setPlan(planData.plan ?? []);
        } else {
          // Check localStorage fallback (for guests / unauthenticated)
          const cached =
            typeof window !== "undefined"
              ? (localStorage.getItem(
                  `challenge_level_${type}`,
                ) as Level | null)
              : null;

          if (cached) {
            setLevel(cached);
            const planRes = await fetch(`/api/challenges/plan?type=${type}`);
            const planData = await planRes.json();
            setPlan(planData.plan ?? []);
          } else {
            // First time — show modal
            setLevelModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Init error:", err);
        // Fallback: show modal
        setLevelModalOpen(true);
      } finally {
        setInitialising(false);
      }
    };

    init();
  }, [type]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Level selected (first time only) ──────────────────────────────────────
  const handleLevelSelect = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setLevelModalOpen(false);
    setLoadingPlan(true);

    // Cache in localStorage for guests
    if (typeof window !== "undefined") {
      localStorage.setItem(`challenge_level_${type}`, selectedLevel);
    }

    try {
      // Persist level to DB (creates empty progress record)
      await fetch("/api/challenges/progress/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, level: selectedLevel }),
      });

      // Fetch plan
      const res = await fetch(`/api/challenges/plan?type=${type}`);
      const data = await res.json();
      setPlan(data.plan ?? []);
    } catch (err) {
      console.error("Failed to initialise challenge:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  // ── Day selected ──────────────────────────────────────────────────────────
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
      console.error("Failed to load exercises:", err);
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
    if (selectedDay && !completedDays.includes(selectedDay.day)) {
      setCompletedDays((prev) => [...prev, selectedDay.day]);
    }
  };

  // ── Next day ──────────────────────────────────────────────────────────────
  const handleNextDay = () => {
    if (!selectedDay) return;
    const nextDay = plan.find((d) => d.day === selectedDay.day + 1);
    if (nextDay) {
      handleSelectDay(nextDay);
    } else {
      router.push(`/?challenge=complete&type=${type}`);
    }
  };

  // ── Invalid type guard ─────────────────────────────────────────────────────
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

  const isLoading = initialising || loadingPlan || loadingExs;

  return (
    <div
      className="min-h-screen"
      style={{
        background: "var(--bg-primary)",
      }}
    >
      {/* ── Level Select Modal — only shown if no saved level found ── */}
      <LevelSelectModal
        open={levelModalOpen}
        challengeTitle={CHALLENGE_TITLES[type]}
        onSelect={handleLevelSelect}
        onClose={() => router.back()}
      />

      {/* ── Loading ── */}
      {isLoading && (
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
            {initialising
              ? "Loading your progress..."
              : loadingPlan
                ? "Building your plan..."
                : "Loading exercises..."}
          </p>
        </div>
      )}

      {/* ── Plan Grid ── */}
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

      {/* ── Day Exercise Preview ── */}
      {!loadingExs && screen === "day-preview" && selectedDay && (
        <>
          {exercises.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
              <p className="text-5xl">😕</p>
              <p
                className="font-black text-base"
                style={{ color: "var(--text-primary)" }}
              >
                No exercises found for Day {selectedDay.day}
              </p>
              <p
                className="text-sm max-w-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                The database may not have exercises matching this tag yet.
              </p>
              <button
                onClick={() => setScreen("plan")}
                className="mt-2 px-6 py-3 rounded-2xl font-black text-sm text-white"
                style={{ background: "var(--primary)" }}
              >
                ← Back to Plan
              </button>
            </div>
          ) : (
            <DayExerciseList
              dayPlan={selectedDay}
              exercises={exercises}
              onStart={() => setScreen("session")}
              onBack={() => setScreen("plan")}
            />
          )}
        </>
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
