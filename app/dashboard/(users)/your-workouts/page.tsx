"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, Dumbbell, History } from "lucide-react";
import { WorkoutCard } from "@/components/cards/SuggestedWorkoutCard";

interface Exercise {
  id: string;
  name: string;
}

interface Routine {
  _id: string;
  planName: string;
  exercises: Exercise[];
  createdAt: string;
}

interface SuggestedPlans {
  [level: string]: Exercise[];
}

export default function YourWorkoutsPage() {
  // Suggested Plans Fetching
  const { data: suggestedPlans, isLoading: isSuggestedLoading } = useQuery<SuggestedPlans>({
    queryKey: ["suggested-routines"],
    queryFn: async () => {
      const res = await axios.get("/api/routines/suggested");
      return res.data;
    },
  });

  // Custom Routines Fetching
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        <p className="text-xs font-black uppercase tracking-widest opacity-50 text-[var(--text-muted)]">
          Loading Your Workouts...
        </p>
      </div>
    );
  }
console.log(suggestedPlans, myRoutines);

  return (
    <div className="max-w-full space-y-12 min-h-screen">
        <title>Your Workutes | Dashboard - Flexify</title>
      <header>
        <h1 className="text-4xl font-black uppercase tracking-tighter text-[var(--text-primary)]">
          Your <span className="text-[var(--primary)]">Workouts</span>
        </h1>
        <p className="text-[11px] font-bold text-[var(--text-muted)] uppercase tracking-[0.2em]">
          Ready to achieve your goals today?
        </p>
      </header>

      {/* Suggested Plans */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <Dumbbell className="text-[var(--primary)]" size={24} />
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">Suggested Plans</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {suggestedPlans && Object.entries(suggestedPlans).map(([level, exercises]) => (
            <WorkoutCard 
              key={level} 
              title={level} 
              exercises={exercises} 
              type="suggested" 
            />
            
          ))}
        </div>
      </section>

      {/* Custom Routines */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <History className="text-[var(--primary)]" size={24} />
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">My Custom Routines</h2>
        </div>
        
        {myRoutines && myRoutines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {myRoutines.map((routine) => (
              <WorkoutCard
                key={routine._id} 
                id={routine._id}
                title={routine.planName} 
                exercises={routine.exercises} 
                createdAt={routine.createdAt}
                type="custom" 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed border-[var(--border-color)] rounded-3xl bg-[var(--bg-secondary)]/20">
            <p className="text-xs font-bold uppercase text-[var(--text-muted)] opacity-40 tracking-[0.3em]">
              No custom routines created yet
            </p>
          </div>
        )}
      </section>
    </div>
  );
}