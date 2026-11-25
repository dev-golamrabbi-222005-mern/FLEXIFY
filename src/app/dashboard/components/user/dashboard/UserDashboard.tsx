"use client";

import React from "react";
import { DashboardCharts } from "./DashboardCharts";
import { GreetingHeader, TodayGoalCard } from "./DashboardCards";
import { WorkoutDetailModal } from "./WorkoutDetailModal";
import { SetGoalModal } from "./SetGoalModal";
import WeeklyStreakCard from "./WeeklyStreakCard";
import MonthlyStreakCalendar from "./MonthlyStreakCalendar";
import FlexifyAICopilot from "../../ai/FlexifyAICopilot";
import UserKpiGrid from "./UserKpiGrid";
import { useUserDashboard } from "./useUserDashboard";

export default function UserDashboard({ name }: { name: string }) {
  const {
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
  } = useUserDashboard();

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      <div className="flex justify-between items-center">
        <GreetingHeader name={name} />
        <TodayGoalCard
          planName={todayGoal?.planName}
          progress={todayGoal?.progress || 0}
          onSetGoal={() => setIsGoalModalOpen(true)}
        />
      </div>

      <FlexifyAICopilot />

      <UserKpiGrid
        nutritionData={nutritionData}
        userData={userData}
        streakData={streakData}
        recentLogs={recentLogs}
        weeklyData={weeklyData}
      />

      <DashboardCharts data={weeklyData} isLoading={isChartLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 lg:gap-10 items-stretch">
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
        routines={formattedRoutines as any}
        defaultPackages={defaultPackages}
      />
    </div>
  );
}
