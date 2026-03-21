"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Target, Dumbbell, Flame, Droplets, Plus, Loader2, PlusCircle } from "lucide-react";
import GoalCreateModal from "../../components/user/goal/GoalCreateModal";
import { UserGoal, GoalType } from "@/types/user";
import { motion } from "framer-motion";

const ICON_MAP: Record<GoalType, React.ElementType> = {
  WEIGHT_LOSS: Flame,
  MUSCLE_GAIN: Dumbbell,
  WATER_INTAKE: Droplets,
  WORKOUT_DAYS: Target,
};

export default function MyGoals() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const { data: goals = [], isLoading } = useQuery<UserGoal[]>({
    queryKey: ["user-goals"],
    queryFn: async () => {
      const res = await axios.get("/api/user/goals");
      return res.data;
    },
  });

  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4 pb-20">
      {/* Header with Add Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-[var(--text-primary)] tracking-tight">MY GOALS</h1>
          <p className="text-[var(--text-secondary)] font-medium">Track and achieve your fitness milestones</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[var(--primary)] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-orange-500/20"
        >
          <Plus size={20} />
          Set New Goal
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
          <p className="text-[var(--text-secondary)] animate-pulse">Loading your goals...</p>
        </div>
      ) : goals.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)]/50"
        >
          <div className="bg-orange-500/10 p-6 rounded-full mb-6">
            <Target className="text-orange-500" size={50} />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Goals Set Yet</h2>
          <p className="text-[var(--text-secondary)] mb-8 text-center max-w-xs">
            You haven't created any fitness goals. Start by setting your first one!
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 text-[var(--primary)] font-bold hover:underline"
          >
            <PlusCircle size={20} />
            Create your first goal
          </button>
        </motion.div>
      ) : (
        /* Goals Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {goals.map((goal) => {
            const Icon = ICON_MAP[goal.type];
            const progress = Math.min(Math.round((goal.currentValue / goal.targetValue) * 100), 100);

            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                key={goal._id} 
                className="group bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-7 transition-all hover:shadow-xl hover:border-orange-500/30"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3 rounded-2xl bg-orange-500/10">
                    <Icon className="text-orange-500" size={24} />
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Target</p>
                    <p className="text-sm font-black text-[var(--text-primary)]">{goal.targetValue} {goal.unit}</p>
                  </div>
                </div>
                
                <h3 className="font-bold text-lg text-[var(--text-primary)] mb-4 line-clamp-1">{goal.title}</h3>
                
                {/* Progress Bar UI */}
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[var(--text-secondary)]">{progress}% Complete</span>
                    <span className="text-[var(--text-primary)]">{goal.currentValue}/{goal.targetValue}</span>
                  </div>
                  <div className="w-full h-3 bg-[var(--bg-primary)] rounded-full overflow-hidden border border-[var(--border-color)]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <GoalCreateModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}