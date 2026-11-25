"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GoalFormData {
  title: string;
  type: "WEIGHT_LOSS" | "MUSCLE_GAIN" | "WATER_INTAKE" | "WORKOUT_DAYS";
  targetValue: number;
  unit: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function GoalCreateModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<GoalFormData>();

  // Mutation to save the goal
  const mutation = useMutation({
    mutationFn: (newGoal: GoalFormData) =>
      axios.post("/api/user/goals", newGoal),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-goals"] });
      reset();
      onClose();
    },
  });

  const onSubmit = (data: GoalFormData) => {
    mutation.mutate(data);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-md rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Set New Goal
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Goal Title */}
              <div>
                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1 block">
                  Goal Title
                </label>
                <input
                  {...register("title", { required: "Title is required" })}
                  placeholder="e.g. Summer Shredding"
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]"
                />
              </div>

              {/* Goal Type */}
              <div>
                <label className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1 block">
                  Goal Type
                </label>
                <select
                  {...register("type", { required: true })}
                  className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]"
                >
                  <option value="WEIGHT_LOSS">Weight Loss</option>
                  <option value="MUSCLE_GAIN">Muscle Gain</option>
                  <option value="WATER_INTAKE">Daily Water Intake</option>
                  <option value="WORKOUT_DAYS">Monthly Workout Days</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Target Value */}
                <div>
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1 block">
                    Target Value
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    {...register("targetValue", {
                      required: true,
                      min: 1,
                      valueAsNumber: true,
                    })}
                    placeholder="5"
                    className="..."
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="text-xs font-bold uppercase text-[var(--text-secondary)] mb-1 block">
                    Unit
                  </label>
                  <input
                    {...register("unit", { required: true })}
                    placeholder="kg, L, days"
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>

              <button
                disabled={mutation.isPending}
                type="submit"
                className="w-full bg-[var(--primary)] text-white font-bold py-4 rounded-2xl mt-4 hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  "Create Goal"
                )}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
