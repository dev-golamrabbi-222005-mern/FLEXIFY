"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Target, Weight } from "lucide-react";
import { WorkoutLog } from "@/types/workout";

interface Props {
  workout: WorkoutLog | null;
  onClose: () => void;
}

export const WorkoutDetailModal = ({ workout, onClose }: Props) => {
  return (
    <AnimatePresence>
      {workout && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--primary)] text-white">
              <div>
                <h2 className="text-lg font-black">{workout.planName}</h2>
                <p className="text-xs opacity-80">{new Date(workout.createdAt).toDateString()}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto space-y-6 bg-[var(--bg-secondary)]">
              {workout.exercises.map((ex, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="text-sm font-black text-[var(--primary)] flex items-center gap-2 uppercase tracking-wide">
                    <Target size={14} /> {ex.exerciseName}
                  </h4>
                  <div className="grid gap-2">
                    {ex.sets.map((set, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                        <span className="text-[10px] font-black text-[var(--text-secondary)] uppercase">Set {sIdx + 1}</span>
                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-1.5">
                            <Weight size={12} className="text-[var(--primary)]" />
                            <span className="text-xs font-bold text-[var(--text-primary)]">{set.weight}kg</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Target size={12} className="text-[var(--primary)]" />
                            <span className="text-xs font-bold text-[var(--text-primary)]">{set.reps} reps</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                            <Clock size={12} />
                            <span className="text-[10px] font-medium">{set.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};