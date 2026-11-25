"use client";

import { useState, useEffect } from "react";
import { ChallengeType, Level, DayPlan } from "@/lib/challengeUtils";
import { ChallengeExercise } from "@/components/challenges/DayExerciseList";

export function useChallengeState(type: ChallengeType) {
  const [levelModalOpen, setLevelModalOpen] = useState(false);
  const [level, setLevel] = useState<Level | null>(null);
  const [selectedDay, setSelectedDay] = useState<DayPlan | null>(null);
  const [plan, setPlan] = useState<DayPlan[]>([]);
  const [exercises, setExercises] = useState<ChallengeExercise[]>([]);
  const [completedDays, setCompletedDays] = useState<number[]>([]);
  const [initialising, setInitialising] = useState(true);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingExs, setLoadingExs] = useState(false);

  useEffect(() => {
    if (type !== "upper-body" && type !== "lower-body") return;

    const init = async () => {
      try {
        const res = await fetch(`/api/challenges/progress?type=${type}`);
        const data = await res.json();

        if (data.progress?.level) {
          const savedLevel = data.progress.level as Level;
          const savedDays: number[] = (data.progress.completedDays ?? []).map(
            (d: { day: number }) => d.day
          );
          setLevel(savedLevel);
          setCompletedDays(savedDays);

          const planRes = await fetch(`/api/challenges/plan?type=${type}`);
          const planData = await planRes.json();
          setPlan(planData.plan ?? []);
        } else {
          const cached =
            typeof window !== "undefined"
              ? (localStorage.getItem(`challenge_level_${type}`) as Level | null)
              : null;

          if (cached) {
            setLevel(cached);
            const planRes = await fetch(`/api/challenges/plan?type=${type}`);
            const planData = await planRes.json();
            setPlan(planData.plan ?? []);
          } else {
            setLevelModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Init error:", err);
        setLevelModalOpen(true);
      } finally {
        setInitialising(false);
      }
    };

    init();
  }, [type]);

  const handleLevelSelect = async (selectedLevel: Level) => {
    setLevel(selectedLevel);
    setLevelModalOpen(false);
    setLoadingPlan(true);

    if (typeof window !== "undefined") {
      localStorage.setItem(`challenge_level_${type}`, selectedLevel);
    }

    try {
      await fetch("/api/challenges/progress/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, level: selectedLevel }),
      });

      const res = await fetch(`/api/challenges/plan?type=${type}`);
      const data = await res.json();
      setPlan(data.plan ?? []);
    } catch (err) {
      console.error("Failed to initialise challenge:", err);
    } finally {
      setLoadingPlan(false);
    }
  };

  const loadDayExercises = async (dayPlan: DayPlan) => {
    setSelectedDay(dayPlan);
    setLoadingExs(true);
    try {
      const res = await fetch(
        `/api/challenges/exercises?type=${type}&level=${level}&day=${dayPlan.day}`
      );
      const data = await res.json();
      setExercises(data.exercises ?? []);
    } catch (err) {
      console.error("Failed to load exercises:", err);
    } finally {
      setLoadingExs(false);
    }
  };

  return {
    level,
    plan,
    exercises,
    completedDays,
    setCompletedDays,
    selectedDay,
    setSelectedDay,
    levelModalOpen,
    setLevelModalOpen,
    initialising,
    loadingPlan,
    loadingExs,
    handleLevelSelect,
    loadDayExercises,
  };
}
