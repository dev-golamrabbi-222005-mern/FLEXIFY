"use client";

import React from "react";
import { 
  Trophy, Medal, Star, Target, Lock, CheckCircle2, 
  Zap, Flame, Crown, LucideIcon, Droplets, Utensils, ClipboardCheck 
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
}

const iconMap: Record<string, LucideIcon> = {
  Trophy, Medal, Target, Star, Zap, Flame, Crown, Droplets, Utensils, ClipboardCheck
};

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "profile_complete", title: "Identity Confirmed", desc: "Completed your fitness profile.", icon: "ClipboardCheck", level: "Beginner" },
  { id: "first_workout", title: "First Step", desc: "Completed your first workout session.", icon: "Zap", level: "Beginner" },
  { id: "calorie_tracker", title: "Nutritionist", desc: "Logged your first meal in daily logs.", icon: "Utensils", level: "Beginner" },
  { id: "water_master_1", title: "Hydration Hero", desc: "Reached your daily water intake goal.", icon: "Droplets", level: "Intermediate" },
  { id: "streak_7", title: "Unstoppable", desc: "Maintained a 7-day workout streak.", icon: "Flame", level: "Intermediate" },
  { id: "total_25", title: "Dedicated Athlete", desc: "Completed 25 total workout sessions.", icon: "Medal", level: "Advanced" },
  { id: "goal_reached", title: "Goal Crusher", desc: "Successfully reached a fitness goal.", icon: "Target", level: "Expert" },
  { id: "streak_30", title: "Iron Will", desc: "30 days of consistent training.", icon: "Crown", level: "Expert" },
];

export default function AchievementsPage() {
  const { data: unlocked = [], isLoading } = useQuery<UnlockedAchievement[]>({
    queryKey: ["user-achievements"],
    queryFn: async () => {
      const res = await axios.get("/api/user/achievements");
      return res.data;
    },
  });

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short", day: "2-digit", year: "numeric",
    }).format(new Date(dateString));
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-40 text-[var(--primary)]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[var(--primary)]"></div>
    </div>
  );

  return (
    <div className="mt-10 max-w-full mx-auto px-4 pb-20 font-sans">
      <title>Achievements | Dashboard - Flexify</title>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6 bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-5">
          <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500">
            <Trophy size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Achievements</h1>
            <p className="text-[var(--text-secondary)] font-medium mt-2">
              Unlocked <span className="text-[var(--primary)]">{unlocked.length}</span> of {ALL_ACHIEVEMENTS.length} Badges
            </p>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ALL_ACHIEVEMENTS.map((item) => {
          const unlockInfo = unlocked.find((u) => u.id === item.id);
          const isUnlocked = !!unlockInfo;
          const Icon = iconMap[item.icon] || Star;

          return (
            <div
              key={item.id}
              className={`relative p-8 rounded-2xl border transition-all duration-500 flex flex-col group ${
                isUnlocked 
                ? "bg-[var(--bg-secondary)] border-[var(--primary)] shadow-xl shadow-[var(--primary)]/5" 
                : "bg-[var(--bg-secondary)]/40 border-[var(--border-color)] opacity-50 grayscale"
              }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-transform duration-500 group-hover:scale-110 ${
                  isUnlocked ? "bg-orange-500/10 text-orange-500" : "bg-gray-500/10 text-gray-400"
                }`}>
                  {isUnlocked ? <Icon size={28} /> : <Lock size={28} />}
                </div>
                {isUnlocked && (
                  <span className="flex items-center gap-1 text-[var(--primary)] font-black text-[9px] uppercase bg-[var(--primary-light)]/20 px-3 py-1 rounded-2xl">
                    <CheckCircle2 size={10} /> Earned
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold mb-2 tracking-tight leading-tight">{item.title}</h2>
              <p className="text-xs text-[var(--text-secondary)] mb-8 font-medium leading-relaxed">
                {item.desc}
              </p>

              <div className="flex items-center justify-between pt-5 border-t border-[var(--border-color)]/50 mt-auto">
                <span className={`text-[9px] font-black px-2.5 py-1 rounded-2xl uppercase tracking-wider ${
                  item.level === "Beginner" ? "bg-green-500/10 text-green-500" :
                  item.level === "Intermediate" ? "bg-yellow-500/10 text-yellow-500" :
                  item.level === "Advanced" ? "bg-blue-500/10 text-blue-500" :
                  "bg-purple-500/10 text-purple-500"
                }`}>
                  {item.level}
                </span>

                {isUnlocked && unlockInfo.unlockedAt && (
                  <span className="text-[10px] text-[var(--text-muted)] font-bold italic">
                    {formatDate(unlockInfo.unlockedAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}