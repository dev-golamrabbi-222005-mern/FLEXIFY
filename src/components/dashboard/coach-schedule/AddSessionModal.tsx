"use client";

import { motion } from "framer-motion";
import { Calendar, X } from "lucide-react";
import React from "react";
import { UseFormRegister, UseFormHandleSubmit } from "react-hook-form";

export interface SessionFormData {
  day: string;
  month: string;
  year: string;
  time: string;
  client: string;
  clientEmail: string;
  type: string;
}

interface AddSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  register: UseFormRegister<SessionFormData>;
  handleSubmit: UseFormHandleSubmit<SessionFormData>;
  onSubmit: (data: SessionFormData) => void;
  trainees: { userEmail: string; name: string }[];
}

export default function AddSessionModal({
  isOpen,
  onClose,
  register,
  handleSubmit,
  onSubmit,
  trainees,
}: AddSessionModalProps) {
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
            <div className="p-2"><Calendar size={24} className="text-[var(--primary)]" /></div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Create Session</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors rounded-full hover:bg-gray-100" aria-label="Close modal">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label className="block mb-2 text-sm font-medium">Day</label>
            <select {...register("day")} className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none">
              {[...Array(31)].map((_, i) => (<option key={i} value={i + 1}>{i + 1}</option>))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Month</label>
            <select {...register("month")} className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none">
              {[...Array(12)].map((_, i) => (<option key={i} value={i + 1}>{i + 1}</option>))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Year</label>
            <select {...register("year")} className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none">
              {[...Array(11)].map((_, i) => (
                <option key={i} value={i + new Date().getFullYear()}>{i + new Date().getFullYear()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Time</label>
            <input type="time" {...register("time")} className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Client</label>
            <select {...register("clientEmail")} className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none">
              {trainees.map((t, i) => (<option key={i} value={t.userEmail}>{t.name}</option>))}
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Type</label>
            <input {...register("type")} type="text" className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none" />
          </div>
          <div className="md:col-span-2">
            <button type="submit" className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity">
              Add Session
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
