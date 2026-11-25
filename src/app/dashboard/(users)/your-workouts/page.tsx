"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Loader2, Dumbbell } from "lucide-react";
import WorkoutQuickStats from "@/components/dashboard/workouts/WorkoutQuickStats";
import SuggestedPlansGrid from "@/components/dashboard/workouts/SuggestedPlansGrid";
import CustomRoutinesGrid from "@/components/dashboard/workouts/CustomRoutinesGrid";

interface SuggestedPlans {
  [level: string]: any[];
}

interface Routine {
  _id: string;
  planName: string;
  exercises: any[];
  createdAt: string;
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export default function YourWorkoutsPage() {
  const { data: suggestedPlans, isLoading: isSuggestedLoading } = useQuery<SuggestedPlans>({
    queryKey: ["suggested-routines"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/suggested");
      return res.data;
    },
  });

  const { data: myRoutines, isLoading: isMyRoutinesLoading } = useQuery<Routine[]>({
    queryKey: ["my-custom-routines"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/show");
      return res.data.data;
    },
  });

  const isLoading = isSuggestedLoading || isMyRoutinesLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
        <p className="text-[11px] font-black uppercase tracking-widest animate-pulse text-[var(--text-muted)]">
          Loading your workouts...
        </p>
      </div>
    );
  }

  const suggestedEntries = suggestedPlans ? Object.entries(suggestedPlans) : [];
  const customCount = myRoutines?.length ?? 0;

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      <title>Your Workouts | Dashboard - Flexify</title>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-1 text-[var(--primary)]">— Your Training</p>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              Your Workouts
            </h1>
          </div>
          <div
            className="w-15 h-15 rounded-2xl flex items-center justify-center"
            style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <Dumbbell size={20} className="text-[var(--primary)]" />
          </div>
        </div>
        <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
          Ready to achieve your goals today?
        </p>
      </motion.div>

      <WorkoutQuickStats suggestedCount={suggestedEntries.length} customCount={customCount} />

      <SuggestedPlansGrid suggestedEntries={suggestedEntries} />

      <CustomRoutinesGrid myRoutines={myRoutines} />
    </div>
  );
}
