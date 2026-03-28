"use client";

import {
  Plus,
  Edit,
  Trash2,
  Copy,
  Users,
  Dumbbell,
  Calendar,
  MoreVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// 1. Define the interface for a Workout Plan
interface WorkoutPlan {
  _id: string;
  name: string;
  clients: number;
  exercises: number;
  duration: string;
  status: "Active" | "Draft" | "Archived";
}

export default function CoachWorkouts() {
  // 2. Apply the interface to useQuery
  const { data: workoutPlans = [], refetch } = useQuery<WorkoutPlan[]>({
    queryKey: ["workout_plans"],
    queryFn: async () => {
      const res = await axios.get("/api/coach/workout-plans");
      return res.data;
    },
  });

  const deleteWorkoutPlan = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/coach/workout-plans/${id}`);
        refetch();
        toast.success("Workout plan has been deleted");
      } catch (error) {
        toast.error("Failed to delete the plan");
      }
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8" style={{ background: "var(--bg-primary)" }}>
       <title>Workouts | Dashboard - Flexify</title>
      <div className="mx-auto space-y-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1
              className="text-2xl font-extrabold md:text-3xl"
              style={{ color: "var(--text-primary)" }}
            >
              Workout Programs
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
              Design, track, and scale your coaching impact.
            </p>
          </div>

          <button className="flex items-center gap-2 btn-primary">
            <Plus size={18} />
            Create Plan
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {workoutPlans.map((plan: WorkoutPlan, i: number) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-glass group flex flex-col justify-between hover:scale-[1.02] transition"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.name}
                  </h3>

                  <span
                    className="inline-block px-2 py-1 mt-1 text-xs font-semibold rounded-full"
                    style={{
                      background:
                        plan.status === "Active"
                          ? "rgba(16,185,129,0.15)"
                          : "rgba(148,163,184,0.15)",
                      color:
                        plan.status === "Active"
                          ? "var(--primary)"
                          : "var(--text-muted)",
                    }}
                  >
                    {plan.status}
                  </span>
                </div>

                <button
                  className="p-2 transition rounded-lg hover:bg-gray-200/20"
                  style={{ color: "var(--text-muted)" }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div
                  className="p-3 border rounded-xl"
                  style={{
                    borderColor: "var(--border-color)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Users size={14} />
                    Clients
                  </div>
                  <p
                    className="mt-1 text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.clients}
                  </p>
                </div>

                <div
                  className="p-3 border rounded-xl"
                  style={{
                    borderColor: "var(--border-color)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  <div
                    className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <Dumbbell size={14} />
                    Exercises
                  </div>
                  <p
                    className="mt-1 text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.exercises}
                  </p>
                </div>
              </div>

              {/* Duration Section */}
              <div
                className="flex items-center gap-2 mb-5 text-sm"
                style={{ color: "var(--text-secondary)" }}
              >
                <Calendar size={16} style={{ color: "var(--primary)" }} />
                Duration:
                <span
                  className="font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {plan.duration}
                </span>
              </div>

              {/* Actions Section */}
              <div
                className="flex gap-2 pt-4 border-t"
                style={{ borderColor: "var(--border-color)" }}
              >
                <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
                  <Edit size={14} /> Edit
                </button>

                <button className="flex items-center justify-center flex-1 gap-1 text-xs btn-secondary">
                  <Copy size={14} /> Copy
                </button>

                <button
                  onClick={() => deleteWorkoutPlan(plan._id)}
                  className="p-2 transition rounded-xl hover:bg-red-500/10"
                  style={{ color: "var(--danger)" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
