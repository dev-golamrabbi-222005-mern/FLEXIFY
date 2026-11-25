"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  WorkoutLog,
  WeeklyStat,
  UserRoutine,
  DefaultPackagesResponse,
  TodayGoal,
} from "@/components/user/workout";
import { UserProfileResponse } from "@/types/user";

export function useUserDashboard() {
  const { data: session } = useSession();
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const apiDate = new Date().toISOString().split("T")[0];

  const { data: nutritionData } = useQuery({
    queryKey: ["dailyLogs", apiDate],
    queryFn: async () => {
      const { data } = await axios.get(`/api/logs?date=${apiDate}`);
      return data;
    },
    enabled: !!session?.user,
  });

  const { data: userData } = useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/fitness-profile");
      return data;
    },
    enabled: !!session?.user,
  });

  const { data: routines = [] } = useQuery<UserRoutine[]>({
    queryKey: ["user-routines"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/show");
      return res.data.data || [];
    },
  });

  const formattedRoutines = useMemo(() => {
    return routines.map((r) => {
      const raw = r as unknown as Record<string, unknown>;
      let nameToUse = "Untitled Routine";
      if (typeof raw.planName === "string") nameToUse = raw.planName;
      else if (typeof raw.name === "string") nameToUse = raw.name;

      return {
        ...r,
        planName: nameToUse,
        exercises: Array.isArray(r.exercises)
          ? r.exercises.map((ex) => (typeof ex === "string" ? { name: ex } : ex))
          : [],
      };
    });
  }, [routines]);

  const { data: streakData } = useQuery({
    queryKey: ["weekly-streak"],
    queryFn: async () => {
      const res = await axios.get("/api/user/stats/streak");
      return res.data?.data;
    },
  });

  const { data: allWorkoutLogs = [] } = useQuery<WorkoutLog[]>({
    queryKey: ["all-workouts-calendar"],
    queryFn: async () => {
      const res = await axios.get("/api/user/exercises-history/all");
      return res.data.data || [];
    },
  });

  const { data: recentLogs = [] } = useQuery<WorkoutLog[]>({
    queryKey: ["recent-workouts"],
    queryFn: async () => {
      const res = await axios.get("/api/user/exercises-history/recent");
      return res.data.data || [];
    },
  });

  const { data: weeklyData = [], isLoading: isChartLoading } = useQuery<WeeklyStat[]>({
    queryKey: ["weekly-stats"],
    queryFn: async () => {
      const res = await axios.get("/api/user/stats/weekly");
      return res.data?.data || [];
    },
  });

  const { data: todayGoal, refetch: refetchGoal } = useQuery<TodayGoal | null>({
    queryKey: ["today-goal"],
    queryFn: async () => {
      const res = await axios.get("/api/user/stats/today-goal");
      return res.data.data;
    },
  });

  const { data: defaultPackages = null } = useQuery<DefaultPackagesResponse | null>({
    queryKey: ["default-packages"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/suggested");
      return res.data;
    },
  });

  const handleSetGoal = async (planName: string, totalExercises: number) => {
    try {
      await axios.post("/api/user/stats/today-goal", { planName, totalExercises });
      setIsGoalModalOpen(false);
      refetchGoal();
    } catch (err) {
      console.error(err);
    }
  };

  return {
    selectedWorkout,
    setSelectedWorkout,
    isGoalModalOpen,
    setIsGoalModalOpen,
    nutritionData,
    userData,
    formattedRoutines,
    streakData,
    allWorkoutLogs,
    recentLogs,
    weeklyData,
    isChartLoading,
    todayGoal,
    defaultPackages,
    handleSetGoal,
  };
}
