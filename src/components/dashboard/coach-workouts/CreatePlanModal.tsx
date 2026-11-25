"use client";

import { motion } from "framer-motion";
import { Dumbbell, Calendar, Users, X } from "lucide-react";
import React from "react";
import { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";

export interface PlanFormData {
  coachId: string;
  exerciseName: string;
  clientEmail: string;
  clientName: string;
  date: string;
  time: string;
  assignedBy: string;
}

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: UseFormRegister<PlanFormData>;
  handleSubmit: UseFormHandleSubmit<PlanFormData>;
  onSubmit: (data: PlanFormData) => void;
  coachUsers: { name: string; userEmail: string }[];
  exercises: { name: string }[];
  setClientName: (name: string) => void;
}

export default function CreatePlanModal({
  isOpen,
  onClose,
  register,
  handleSubmit,
  onSubmit,
  coachUsers,
  exercises,
  setClientName,
}: CreatePlanModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-lg p-8 border shadow-2xl bg-[var(--bg-primary)] rounded-3xl border-white/50 backdrop-saturate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Dumbbell size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Create Workout Plan</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-gray-100" aria-label="Close modal">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar size={16} className="text-blue-500" /> Date
              </label>
              <input {...register("date")} type="date" className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar size={16} className="text-blue-500" /> Time
              </label>
              <input {...register("time")} type="time" className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Users size={16} className="text-green-500" /> Client Name
            </label>
            <select
              {...register("clientEmail")}
              onChange={(e) => setClientName(e.target.options[e.target.selectedIndex].outerText)}
              className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
            >
              <option value="">Select client</option>
              {coachUsers.map((user) => (
                <option key={user.userEmail} value={user.userEmail}>{user.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Dumbbell size={16} className="text-purple-500" /> Exercise Name
            </label>
            <select {...register("exerciseName")} className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none">
              <option value="">Select exercise</option>
              {exercises.map((exercise) => (
                <option key={exercise.name} value={exercise.name}>{exercise.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button type="submit" className="px-6 py-2.5 bg-[var(--primary)] text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl">
              Save Plan
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
