
"use client";

import { Plus, Edit, Trash2, Copy, Users, Dumbbell, Calendar, MoreVertical } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

const workoutPlans = [
  { id: "1", name: "Push/Pull/Legs Split", clients: 8, exercises: 24, duration: "6 weeks", status: "Active" },
  { id: "2", name: "Full Body Beginner", clients: 5, exercises: 18, duration: "4 weeks", status: "Active" },
  { id: "3", name: "Cardio HIIT Program", clients: 4, exercises: 15, duration: "8 weeks", status: "Active" },
  { id: "4", name: "Strength Foundation", clients: 3, exercises: 20, duration: "12 weeks", status: "Draft" },
  { id: "5", name: "Yoga & Mobility", clients: 2, exercises: 12, duration: "Ongoing", status: "Active" },
];

export default function CoachWorkouts() {
  const [plans] = useState(workoutPlans);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 p-4 md:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Workout Programs
            </h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-1">
              Design, track, and scale your coaching impact.
            </p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
            <Plus className="w-5 h-5" />
            <span>Create Plan</span>
          </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-500/50 transition-all duration-300"
            >
              {/* Status Badge */}
              <div className="flex items-start justify-between mb-5">
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {plan.name}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    plan.status === "Active" 
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" 
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}>
                    {plan.status}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 mb-1">
                    <Users className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-tight">Clients</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{plan.clients}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400 mb-1">
                    <Dumbbell className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-tight">Exercises</span>
                  </div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{plan.exercises}</p>
                </div>
              </div>

              {/* Duration Row */}
              <div className="flex items-center gap-2 mb-6 text-sm text-slate-600 dark:text-zinc-400">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Duration: <span className="font-semibold text-slate-900 dark:text-zinc-200">{plan.duration}</span></span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors">
                  <Edit className="w-3.5 h-3.5" /> Edit
                </button>
                <button className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-slate-700 dark:text-zinc-300 hover:text-indigo-600 dark:hover:text-indigo-400 text-xs font-bold transition-colors">
                  <Copy className="w-3.5 h-3.5" /> Duplicate
                </button>
                <button className="inline-flex items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-zinc-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}