"use client";

import React from "react";
import { 
  Trophy, Medal, Star, Target, Lock, Zap, Flame, Crown, 
  Droplets, ClipboardCheck, Loader2, Dumbbell, ShieldCheck, Timer, 
  Waves, Rocket, Award, Gem, Heart, Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import PlanAccessModal from "@/components/modals/PlanAccessModal";
import { PlanId } from "@/lib/plans";

interface AchievementItem {
  id: string;
  unlockedAt: string;
}

interface Achievement {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Legend";
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: "profile_complete", title: "Identity Confirmed", desc: "Profile setup complete", icon: ClipboardCheck, level: "Beginner" },
  { id: "first_workout", title: "First Step", desc: "First workout logged", icon: Zap, level: "Beginner" },
  { id: "streak_7", title: "7 Days Streak", desc: "One week of discipline", icon: Flame, level: "Beginner" },
  { id: "streak_30", title: "Habit Former", desc: "30 days consistent", icon: Activity, level: "Intermediate" },
  { id: "streak_50", title: "Half-Century", desc: "50 days milestone", icon: Award, level: "Intermediate" },
  { id: "streak_75", title: "Hard 75", desc: "75 days of grind", icon: ShieldCheck, level: "Advanced" },
  { id: "streak_100", title: "Centurion", desc: "100 days of power", icon: Trophy, level: "Advanced" },
  { id: "streak_150", title: "Legacy Builder", desc: "150 days strong", icon: Rocket, level: "Advanced" },
  { id: "streak_180", title: "Half-Year", desc: "180 days transformation", icon: Gem, level: "Expert" },
  { id: "streak_365", title: "1 Year Immortal", desc: "365 days of glory", icon: Star, level: "Expert" },
  { id: "streak_730", title: "Two-Year Titan", desc: "730 days of excellence", icon: Medal, level: "Expert" },
  { id: "streak_1825", title: "5 Year Legend", desc: "Half a decade of fitness", icon: Crown, level: "Legend" },
  { id: "challenge_starter", title: "Challenger", desc: "Started a 7x4 challenge", icon: Target, level: "Beginner" },
  { id: "upper_warrior", title: "Upper Warrior", desc: "Week 1 Upper Body done", icon: Dumbbell, level: "Intermediate" },
  { id: "lower_warrior", title: "Leg Legend", desc: "Week 1 Lower Body done", icon: Heart, level: "Intermediate" },
  { id: "challenge_king", title: "Challenge King", desc: "Finished 28-day challenge", icon: Crown, level: "Expert" },
  { id: "early_bird", title: "Early Bird", desc: "Workout before 9 AM", icon: Timer, level: "Intermediate" },
  { id: "water_master_8", title: "Hydration God", desc: "8+ glasses of water", icon: Waves, level: "Intermediate" },
  { id: "calorie_tracker", title: "Nutritionist", desc: "First meal logged", icon: Droplets, level: "Beginner" },
  { id: "total_25", title: "Elite Athlete", desc: "25 total sessions done", icon: Medal, level: "Advanced" },
];

export default function AchievementsPage() {
  const { data: session } = useSession();

  // Fetch user data to check plan
  const { data: dbUser } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  const userPlan = (dbUser?.plan as PlanId) || "free";

  const { data: unlocked = [], isLoading } = useQuery<AchievementItem[]>({
    queryKey: ["user-achievements"],
    queryFn: async () => {
      const res = await axios.get("/api/user/achievements");
      return res.data;
    },
  });

  const sortedAchievements = [...ALL_ACHIEVEMENTS].sort((a, b) => {
    const isAUnlocked = unlocked.some((u) => u.id === a.id);
    const isBUnlocked = unlocked.some((u) => u.id === b.id);
    if (isAUnlocked && !isBUnlocked) return -1;
    if (!isAUnlocked && isBUnlocked) return 1;
    return 0;
  });

  if (isLoading) return (
    <div className="flex justify-center items-center py-40 text-[var(--primary)]">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  if (userPlan === "free") {
    return (
      <PlanAccessModal
        currentPlan={userPlan}
        requiredPlan="pro"
        isOpen={true}
        onClose={() => {}}
      />
    );
  }

  return (
    <>
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--bg-secondary)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--primary-light)] text-[var(--primary-dark)] rounded-xl">
              <Trophy size={32} />
            </div>
            <div>
              <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
                HALL OF FAME
              </h1>
              <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
                {unlocked.length} of {ALL_ACHIEVEMENTS.length} Badges Unlocked
              </p>
            </div>
          </div>
          <div className="w-full md:w-64 h-3 bg-[var(--bg-primary)] rounded-full border border-[var(--border-color)] overflow-hidden">
            <div
              className="h-full bg-[var(--primary)] transition-all duration-1000"
              style={{
                width: `${(unlocked.length / ALL_ACHIEVEMENTS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {sortedAchievements.map((badge) => {
            const unlockData = unlocked.find((u) => u.id === badge.id);
            const isUnlocked = !!unlockData;
            const Icon = badge.icon;

            return (
              <div
                key={badge.id}
                className={`relative p-5 rounded-2xl border flex flex-col items-center text-center transition-all duration-500 ${
                  isUnlocked
                    ? "bg-[var(--bg-secondary)] border-[var(--primary)] shadow-md translate-y-[-2px]"
                    : "bg-[var(--bg-secondary)] opacity-60 border-[var(--border-color)] grayscale"
                }`}
              >
                <div
                  className={`mb-4 p-4 rounded-full ${
                    isUnlocked
                      ? "bg-[var(--primary-light)] text-[var(--primary-dark)]"
                      : "bg-[var(--bg-primary)] text-[var(--text-muted)] border-2 border-dashed border-[var(--border-color)]"
                  }`}
                >
                  {isUnlocked ? <Icon size={32} /> : <Lock size={32} />}
                </div>

                <div className="absolute top-3 right-3 px-2 py-0.5 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-full text-[7px] font-black uppercase tracking-tighter text-[var(--text-muted)]">
                  {badge.level}
                </div>

                <h3 className="text-sm font-black text-[var(--text-primary)] mb-1 uppercase leading-tight">
                  {badge.title}
                </h3>
                <p className="text-[10px] text-[var(--text-secondary)] font-medium leading-tight h-6 overflow-hidden">
                  {isUnlocked ? badge.desc : "Locked"}
                </p>

                <div className="mt-4 w-full pt-3 border-t border-[var(--border-color)]">
                  {isUnlocked ? (
                    <span className="text-[8px] text-[var(--primary)] font-black uppercase">
                      {new Date(unlockData.unlockedAt).toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-[8px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                      Locked
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}