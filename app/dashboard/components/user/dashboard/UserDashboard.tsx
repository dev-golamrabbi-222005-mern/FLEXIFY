"use client";

import React, { useMemo, useState } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Dumbbell,
  Salad,
  Moon,
  Flame,
  Droplets,
  Trophy,
  Loader2,
} from "lucide-react";

import { DashboardCharts } from "./DashboardCharts";
import {
  GreetingHeader,
  StatCard,
  StatCardProps,
  TodayGoalCard,
} from "./DashboardCards";
import { WorkoutDetailModal } from "./WorkoutDetailModal";
import { SetGoalModal } from "./SetGoalModal";
import {
  WorkoutLog,
  WeeklyStat,
  UserRoutine,
  DefaultPackagesResponse,
  TodayGoal,
} from "@/components/user/workout";
import WeeklyStreakCard from "./WeeklyStreakCard";
import MonthlyStreakCalendar from "./MonthlyStreakCalendar";
import { UserProfileResponse } from "@/types/user";
import { useSession } from "next-auth/react";
import { MealSection } from "@/types/food";

/**
 * ✅ Fixed Interface
 */
interface RoutineWithPlanName extends UserRoutine {
  planName: string;
}

const fadeUp = (delay = 0): HTMLMotionProps<"div"> => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

export default function UserDashboard({ name }: { name: string }) {
  const { data: session } = useSession();
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(
    null,
  );
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  const apiDate = new Date().toISOString().split("T")[0];
  const readableToday = new Date().toDateString();

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

  /**
   * ✅ FIXED: Safe casting + normalization
   */
  const formattedRoutines = useMemo<RoutineWithPlanName[]>(() => {
    return routines.map((r) => {
      const raw = r as unknown as Record<string, unknown>;

      let nameToUse = "Untitled Routine";
      if (typeof raw.planName === "string") {
        nameToUse = raw.planName;
      } else if (typeof raw.name === "string") {
        nameToUse = raw.name;
      }

      return {
        ...r,
        planName: nameToUse,
        // ✅ normalize exercises (fix type conflict)
        exercises: Array.isArray(r.exercises)
          ? r.exercises.map((ex) =>
              typeof ex === "string"
                ? { name: ex } // minimal structure
                : ex,
            )
          : [],
      } as unknown as RoutineWithPlanName;
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

  const { data: recentLogs = [], isLoading: isRecentLoading } = useQuery<
    WorkoutLog[]
  >({
    queryKey: ["recent-workouts"],
    queryFn: async () => {
      const res = await axios.get("/api/user/exercises-history/recent");
      return res.data.data || [];
    },
  });

  const { data: weeklyData = [], isLoading: isChartLoading } = useQuery<
    WeeklyStat[]
  >({
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

  const { data: defaultPackages = null } =
    useQuery<DefaultPackagesResponse | null>({
      queryKey: ["default-packages"],
      queryFn: async () => {
        const res = await axios.get("/api/routines/suggested");
        return res.data;
      },
    });

  const handleSetGoal = async (planName: string, totalExercises: number) => {
    try {
      await axios.post("/api/user/stats/today-goal", {
        planName,
        totalExercises,
      });
      setIsGoalModalOpen(false);
      refetchGoal();
    } catch (err) {
      console.error(err);
    }
  };

  const totalEatenCalories = useMemo(() => {
    if (!nutritionData?.meals) return 0;
    const mealSections = Object.values(nutritionData.meals) as MealSection[];

    return mealSections.reduce((total, section) => {
      return (
        total +
        (section.entries?.reduce(
          (sum, entry) => sum + entry.foodItem.calories * entry.quantity,
          0,
        ) || 0)
      );
    }, 0);
  }, [nutritionData]);

  const todayLogs = recentLogs.filter(
    (log) => new Date(log.createdAt).toDateString() === readableToday,
  );

  const totalExercisesCount = todayLogs.reduce(
    (acc, curr) => acc + (curr.exercises?.length || 0),
    0,
  );

  const totalMinutes =
    todayLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60;

  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "short",
  });

  const todayChartData = weeklyData.find((d) => d.day === todayName);

  const stats: StatCardProps[] = [
    {
      icon: Dumbbell,
      label: "Exercises",
      value: totalExercisesCount,
      sub:
        totalMinutes >= 60
          ? `${Math.floor(totalMinutes / 60)}h ${Math.round(
              totalMinutes % 60,
            )}m`
          : `${Math.round(totalMinutes)}m`,
      iconColor: "#f47920",
      iconBg: "#fff3e0",
      delay: 0.1,
    },
    {
      icon: Salad,
      label: "Calories",
      value: Math.round(totalEatenCalories).toLocaleString(),
      sub: "kcal eaten",
      iconColor: "#27ae60",
      iconBg: "#dcfce7",
      delay: 0.16,
    },
    {
      icon: Flame,
      label: "Burned",
      value: todayChartData?.calories || 0,
      sub: "kcal burned",
      iconColor: "#e74c3c",
      iconBg: "#fee2e2",
      delay: 0.22,
    },
    {
      icon: Moon,
      label: "Sleep",
      value: userData?.fitness_profile?.sleepHours
        ? `${userData.fitness_profile.sleepHours}h`
        : "8h",
      sub: "Every night",
      iconColor: "#7c5cbf",
      iconBg: "#ede9fe",
      delay: 0.28,
    },
    {
      icon: Droplets,
      label: "Water",
      value: `${nutritionData?.waterIntake || 0} / ${
        userData?.calculatedGoals?.waterGoal || 8
      }`,
      sub: "glasses",
      iconColor: "#4b9eff",
      iconBg: "#dbeeff",
      delay: 0.34,
    },
    {
      icon: Trophy,
      label: "Total Streak",
      value: `${streakData?.totalStreak || 0} Days`,
      sub: "Keep going!",
      iconColor: "#e67e22",
      iconBg: "#fff3e0",
      delay: 0.16,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      <GreetingHeader name={name} />

      <TodayGoalCard
        planName={todayGoal?.planName}
        progress={todayGoal?.progress || 0}
        onSetGoal={() => setIsGoalModalOpen(true)}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      <DashboardCharts data={weeklyData} isLoading={isChartLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-stretch">
        <div className="lg:col-span-3 min-h-[300px]">
          <MonthlyStreakCalendar workoutLogs={allWorkoutLogs} />
        </div>
        <div className="lg:col-span-2 min-h-[300px]">
          <WeeklyStreakCard streak={streakData} />
        </div>
      </div>

      <WorkoutDetailModal
        workout={selectedWorkout}
        onClose={() => setSelectedWorkout(null)}
      />

      <SetGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSelect={handleSetGoal}
        routines={formattedRoutines}
        defaultPackages={defaultPackages}
      />
    </div>
  );
}
