
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
import { useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { ObjectId } from "mongodb";

// const workoutPlans = [
//   { id: "1", name: "Push/Pull/Legs Split", clients: 8, exercises: 24, duration: "6 weeks", status: "Active" },
//   { id: "2", name: "Full Body Beginner", clients: 5, exercises: 18, duration: "4 weeks", status: "Active" },
//   { id: "3", name: "Cardio HIIT Program", clients: 4, exercises: 15, duration: "8 weeks", status: "Active" },
//   { id: "4", name: "Strength Foundation", clients: 3, exercises: 20, duration: "12 weeks", status: "Draft" },
//   { id: "5", name: "Yoga & Mobility", clients: 2, exercises: 12, duration: "Ongoing", status: "Active" },
// ];

export default function CoachWorkouts() {
  const {data: workoutPlans = [], refetch} = useQuery({
    queryKey: ["workout_plans"],
    queryFn: async() => {
      const res = await axios.get("/api/coach/workout-plans");
      return res.data;
    }
  });

  const deleteWorkoutPlan = async(id: ObjectId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`/api/coach/workout-plans/${id}`);
        refetch();
        Swal.fire({
          title: "Deleted!",
          text: "Workout plan has been deleted",
          icon: "success"
        });
      }
    });
  }

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
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
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
          {workoutPlans.map((plan, i) => (
            <motion.div
              key={plan._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-glass group flex flex-col justify-between hover:scale-[1.02] transition"
            >
              {/* Top */}
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

              {/* Stats */}
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

              {/* Duration */}
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

              {/* Actions */}
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