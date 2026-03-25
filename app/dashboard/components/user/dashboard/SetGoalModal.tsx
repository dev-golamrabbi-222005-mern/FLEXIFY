"use client";

import React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { X, ChevronRight, Zap, ListChecks } from "lucide-react";
import { DefaultPackagesResponse } from "@/components/user/workout";

// 1. Define the Exercise Interface
// This replaces 'any[]' and ensures each exercise has the right shape
interface Exercise {
  _id?: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: string;
  image?: string;
}

// 2. Define the Routine Interface using the Exercise interface
interface Routine {
  _id: string;
  planName: string;
  name?: string;
  exercises: Exercise[]; // Strict typing here
}

interface SetGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (planName: string, totalExercises: number) => void;
  routines: Array<{
    planName: string;
    exercises: Exercise[];
  }>;
  defaultPackages: DefaultPackagesResponse | null;
}

// 3. Typed Framer Motion helper
const fadeUpModal: HTMLMotionProps<"div"> = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 },
};

export const SetGoalModal = ({
  isOpen,
  onClose,
  onSelect,
  routines,
  defaultPackages,
}: SetGoalModalProps) => {
  const levels = ["beginner", "intermediate", "advanced"] as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            {...fadeUpModal}
            className="w-full max-w-md bg-[var(--bg-secondary)] rounded-3xl border border-[var(--border-color)] overflow-hidden shadow-2xl"
          >
            <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="text-lg font-black text-[var(--text-primary)]">
                Set Today's Goal
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-[var(--bg-primary)] rounded-full text-[var(--text-secondary)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 max-h-[70vh] overflow-y-auto space-y-6">
              {/* Custom Routines Section */}
              <div>
                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3">
                  Your Custom Routines
                </p>
                <div className="grid gap-2">
                  {routines && routines.length > 0 ? (
                    routines.map((r, index) => {
                      const displayName = r.planName || "Untitled Routine";
                      const count = r.exercises?.length || 0;

                      return (
                        <button
                          key={index}
                          onClick={() => onSelect(displayName, count)}
                          className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                              <ListChecks size={16} />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-[var(--text-primary)]">
                                {displayName}
                              </p>
                              <p className="text-[10px] text-[var(--text-secondary)]">
                                {count} Exercises
                              </p>
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-[var(--text-secondary)]"
                          />
                        </button>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 border border-dashed border-[var(--border-color)] rounded-2xl">
                      <p className="text-[10px] text-[var(--text-secondary)] italic opacity-60">
                        No custom routines found.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Suggested Packages Section */}
              <div>
                <p className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest mb-3">
                  Suggested Plans
                </p>
                <div className="grid gap-2">
                  {levels.map((level) => {
                    const pkg = defaultPackages?.[level] || [];
                    const label = `${level.charAt(0).toUpperCase() + level.slice(1)} Plan`;
                    return (
                      <button
                        key={level}
                        onClick={() => onSelect(label, pkg.length)}
                        className="flex items-center justify-between p-4 rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-[var(--primary)] transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)]">
                            <Zap size={16} />
                          </div>
                          <div className="text-left">
                            <p className="text-sm font-bold text-[var(--text-primary)] capitalize">
                              {level} Plan
                            </p>
                            <p className="text-[10px] text-[var(--text-secondary)]">
                              {pkg.length} Exercises
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-[var(--text-secondary)]"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
