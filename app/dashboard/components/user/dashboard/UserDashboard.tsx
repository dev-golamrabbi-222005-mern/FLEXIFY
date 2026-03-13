"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Dumbbell, Salad, Moon, Flame, Droplets, Trophy, Loader2 } from "lucide-react";

import { DashboardCharts } from "./DashboardCharts";
import { GreetingHeader, StatCard, StatCardProps, TodayGoalCard } from "./DashboardCards";
import { WorkoutDetailModal } from "./WorkoutDetailModal";
import { SetGoalModal } from "./SetGoalModal";
import { WorkoutLog, WeeklyStat, UserRoutine, DefaultPackagesResponse, TodayGoal } from "@/components/user/workout";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
});

export default function UserDashboard({ name }: { name: string }) {
  const [selectedWorkout, setSelectedWorkout] = useState<WorkoutLog | null>(null);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);

  // Queries
  const { data: recentLogs = [], isLoading: isRecentLoading } = useQuery<WorkoutLog[]>({
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
    }
  });

  const { data: todayGoal, refetch: refetchGoal } = useQuery<TodayGoal | null>({
    queryKey: ["today-goal"],
    queryFn: async () => {
      const res = await axios.get("/api/user/stats/today-goal");
      return res.data.data;
    }
  });

  const { data: routines = [] } = useQuery<UserRoutine[]>({
    queryKey: ["user-routines"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/show");
      return res.data.data || [];
    }
  });

  const { data: defaultPackages = null } = useQuery<DefaultPackagesResponse | null>({
    queryKey: ["default-packages"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/suggested");
      return res.data;
    }
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

  // Calculations
  const todayStr = new Date().toDateString();
  const todayLogs = recentLogs.filter(log => new Date(log.createdAt).toDateString() === todayStr);
  const totalExercisesCount = todayLogs.reduce((acc, curr) => acc + (curr.exercises?.length || 0), 0);
  const totalMinutes = todayLogs.reduce((acc, curr) => acc + (curr.duration || 0), 0) / 60;
  
  const durationText = totalMinutes >= 60 
    ? `${Math.floor(totalMinutes / 60)}h ${Math.round(totalMinutes % 60)}m` 
    : `${Math.round(totalMinutes)}m`;

  const todayName = new Date().toLocaleDateString("en-US", { weekday: "short" });
  const todayChartData = weeklyData.find((d) => d.day === todayName);

  const stats: StatCardProps[] = [
    { icon: Dumbbell, label: "Exercises", value: totalExercisesCount, sub: durationText, iconColor: "#f47920", iconBg: "#fff3e0", delay: 0.1 },
    { icon: Salad, label: "Calories", value: "1,600", sub: "kcal eaten", iconColor: "#27ae60", iconBg: "#dcfce7", delay: 0.16 },
    { icon: Flame, label: "Burned", value: todayChartData?.calories || 0, sub: "kcal burned", iconColor: "#e74c3c", iconBg: "#fee2e2", delay: 0.22 },
    { icon: Moon, label: "Sleep", value: "8h 20m", sub: "Last night", iconColor: "#7c5cbf", iconBg: "#ede9fe", delay: 0.28 },
    { icon: Droplets, label: "Water", value: "6 / 8", sub: "glasses", iconColor: "#4b9eff", iconBg: "#dbeeff", delay: 0.34 },
    { icon: Trophy, label: "Streak", value: "14 days", sub: "Keep it up!", iconColor: "#f0a500", iconBg: "#fef3c7", delay: 0.4 },
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
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>

      <DashboardCharts data={weeklyData} isLoading={isChartLoading} />

      <motion.div {...fadeUp(0.3)} className="p-5 rounded-3xl border border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <h3 className="text-base font-black text-[var(--text-primary)] mb-4 uppercase tracking-tighter">
          Recent Workout Packages
        </h3>
        <div className="space-y-3">
          {isRecentLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin text-[var(--primary)]" /></div>
          ) : (
            recentLogs.map((w) => (
              <div 
                key={w._id} 
                onClick={() => setSelectedWorkout(w)} 
                className="flex items-center justify-between p-3 rounded-2xl border border-[var(--border-color)] hover:border-[var(--primary)] cursor-pointer group bg-[var(--bg-primary)]/40 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center group-hover:rotate-6 transition-transform">
                    <Dumbbell size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{w.planName}</p>
                    <p className="text-[10px] text-[var(--text-secondary)]">
                      {new Date(w.createdAt).toLocaleDateString()} · {Math.floor(w.duration / 60)} mins
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-[var(--primary)]">{Math.floor((w.duration / 60) * 6)} kcal</p>
                  <p className="text-[10px] font-bold uppercase">{w.exercises?.length || 0} Exercises</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <WorkoutDetailModal workout={selectedWorkout} onClose={() => setSelectedWorkout(null)} />
      
      <SetGoalModal 
        isOpen={isGoalModalOpen} 
        onClose={() => setIsGoalModalOpen(false)} 
        onSelect={handleSetGoal} 
        routines={routines} 
        defaultPackages={defaultPackages} 
      />
    </div>
  );
}