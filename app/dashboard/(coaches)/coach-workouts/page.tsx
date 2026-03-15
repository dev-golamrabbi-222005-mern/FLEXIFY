
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
    <div className="min-h-screen p-4 md:p-8" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl md:text-3xl font-extrabold"
              style={{ color: "var(--text-primary)" }}
            >
              Workout Programs
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--text-muted)" }}
            >
              Design, track, and scale your coaching impact.
            </p>
          </div>

          <button className="btn-primary flex items-center gap-2">
            <Plus size={18} />
            Create Plan
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card-glass group flex flex-col justify-between hover:scale-[1.02] transition"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="font-bold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.name}
                  </h3>

                  <span
                    className="text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block"
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
                  className="p-2 rounded-lg hover:bg-gray-200/20 transition"
                  style={{ color: "var(--text-muted)" }}
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div
                  className="p-3 rounded-xl border"
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
                    className="text-lg font-bold mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.clients}
                  </p>
                </div>

                <div
                  className="p-3 rounded-xl border"
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
                    className="text-lg font-bold mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.exercises}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div
                className="flex items-center gap-2 text-sm mb-5"
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
                <button className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs">
                  <Edit size={14} /> Edit
                </button>

                <button className="flex-1 btn-secondary flex items-center justify-center gap-1 text-xs">
                  <Copy size={14} /> Copy
                </button>

                <button
                  className="p-2 rounded-xl hover:bg-red-500/10 transition"
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