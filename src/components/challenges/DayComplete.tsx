"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RotateCcw, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DayPlan, ChallengeType, Level } from "@/lib/challengeUtils";
import { LoginWarningModal } from "./LoginWarningModal";
import { MonthCalendar } from "./MonthCalendar";
import { DayCompleteHero } from "./DayCompleteHero";
import { DayCompleteStats } from "./DayCompleteStats";

interface Props {
  dayPlan: DayPlan;
  type: ChallengeType;
  level: Level;
  durationSecs: number;
  caloriesBurned: number;
  exercisesDone: number;
  completedDays: number[];
  onDoAgain: () => void;
  onNextDay: () => void;
}

export function DayComplete({
  dayPlan,
  type,
  level,
  durationSecs,
  caloriesBurned,
  exercisesDone,
  completedDays,
  onDoAgain,
  onNextDay,
}: Props) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  const saveProgress = async () => {
    if (!session || saved) return;
    try {
      await fetch("/api/challenges/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          level,
          day: dayPlan.day,
          week: dayPlan.week,
          tag: dayPlan.tag,
          durationSecs,
          caloriesBurned,
          exercisesDone,
        }),
      });
      setSaved(true);
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  useEffect(() => {
    if (!session) {
      const t = setTimeout(() => setLoginModalOpen(true), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => saveProgress(), 0);
    return () => clearTimeout(t);
  }, [session]);

  const handleLogin = () => {
    router.push(`/login?redirect=/dashboard/challenges/${type}`);
  };

  const allCompleted = [...new Set([...completedDays, dayPlan.day])];

  return (
    <div className="space-y-4">
      <DayCompleteHero
        dayPlan={dayPlan}
        completedDaysCount={allCompleted.length}
        saved={saved}
      />

      <DayCompleteStats
        caloriesBurned={caloriesBurned}
        durationSecs={durationSecs}
        exercisesDone={exercisesDone}
      />

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <MonthCalendar completedDays={allCompleted} dayPlan={dayPlan} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={onDoAgain}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all cursor-pointer"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        >
          <RotateCcw size={15} /> Do Again
        </button>
        <motion.button
          onClick={onNextDay}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white cursor-pointer"
          style={{
            background: "var(--primary)",
            boxShadow: "0 6px 24px rgba(244,121,32,0.35)",
          }}
        >
          Day {Math.min(dayPlan.day + 1, 28)} <ChevronRight size={15} />
        </motion.button>
      </motion.div>

      <LoginWarningModal
        open={loginModalOpen}
        onLogin={handleLogin}
        onCancel={() => setLoginModalOpen(false)}
      />
    </div>
  );
}
