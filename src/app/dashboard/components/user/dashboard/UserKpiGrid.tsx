"use client";

import { useMemo } from "react";
import { Dumbbell, Salad, Flame, Moon, Droplets, Trophy } from "lucide-react";
import { StatCard, StatCardProps } from "./DashboardCards";
import { MealSection } from "@/types/food";
import { UserProfileResponse } from "@/types/user";
import { WorkoutLog, WeeklyStat } from "@/components/user/workout";

interface UserKpiGridProps {
  nutritionData: any;
  userData?: UserProfileResponse;
  streakData: any;
  recentLogs: WorkoutLog[];
  weeklyData: WeeklyStat[];
}

export default function UserKpiGrid({
  nutritionData,
  userData,
  streakData,
  recentLogs,
  weeklyData,
}: UserKpiGridProps) {
  const readableToday = new Date().toDateString();
  const todayLogs = recentLogs.filter((log) => new Date(log.createdAt).toDateString() === readableToday);

  const totalExercisesCount = todayLogs.reduce((acc, curr) => acc + (curr.exercises?.length || 0), 0);
  const totalMinutes = todayLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60;
  const todayName = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayChartData = weeklyData.find((d) => d.day === todayName);

  const totalEatenCalories = useMemo(() => {
    if (!nutritionData?.meals) return 0;
    const mealSections = Object.values(nutritionData.meals) as MealSection[];
    return mealSections.reduce((total, section) => {
      return (
        total +
        (section.entries?.reduce((sum, entry) => sum + entry.foodItem.calories * entry.quantity, 0) || 0)
      );
    }, 0);
  }, [nutritionData]);

  const profile = userData?.fitnessProfile || userData?.fitness_profile;

  const stats: StatCardProps[] = [
    {
      icon: Dumbbell,
      label: "Exercises",
      value: totalExercisesCount,
      sub: totalMinutes >= 60 ? `${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m` : `${Math.round(totalMinutes)}m`,
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
      value: profile?.sleepHours ? `${profile.sleepHours}h` : "8h",
      sub: "Every night",
      iconColor: "#7c5cbf",
      iconBg: "#ede9fe",
      delay: 0.28,
    },
    {
      icon: Droplets,
      label: "Water",
      value: `${nutritionData?.waterIntake || 0} / ${
        userData?.calculatedGoals?.waterGoal || (profile?.waterIntake ? profile.waterIntake * 4 : 8)
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
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-6 lg:gap-6">
      {stats.map((s) => (
        <StatCard key={s.label} {...s} />
      ))}
    </div>
  );
}
