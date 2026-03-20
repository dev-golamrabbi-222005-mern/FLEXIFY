"use client";

import { useState } from "react";
import { Dumbbell, Layers, Edit, Trash } from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

export default function WorkoutLibraryPage() {
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      name: "Push Ups",
      category: "Strength",
      level: "Beginner",
    },
    {
      id: 2,
      name: "Squats",
      category: "Strength",
      level: "Intermediate",
    },
    {
      id: 3,
      name: "Jump Rope",
      category: "Cardio",
      level: "Beginner",
    },
  ]);

  const deleteWorkout = (id: number) => {
    setWorkouts(workouts.filter((w) => w.id !== id));
  };

  const stats = [
    {
      title: "Global Workouts",
      value: workouts.length,
      icon: Dumbbell,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Categories",
      value: "5",
      icon: Layers,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const categoryData = [
    { name: "Strength", value: 40 },
    { name: "Cardio", value: 30 },
    { name: "Flexibility", value: 20 },
    { name: "HIIT", value: 10 },
  ];

  const workoutUsage = [
    { month: "Jan", workouts: 120 },
    { month: "Feb", workouts: 180 },
    { month: "Mar", workouts: 260 },
    { month: "Apr", workouts: 220 },
    { month: "May", workouts: 300 },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6"];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 bg-[var(--bg-primary)] space-y-10">
      {/* ===== STATS ===== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={index}
              className="bg-[var(--card-bg)] p-6 rounded-2xl shadow"
            >
              <div className="flex justify-between mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}
                >
                  <Icon size={22} />
                </div>
              </div>

              <h4 className="text-sm text-[var(--text-secondary)]">
                {stat.title}
              </h4>

              <p className="text-2xl font-bold mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* ===== CHARTS ===== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Category Chart */}

        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">Workout Categories</h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Usage */}

        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
          <h3 className="font-semibold mb-4">Workout Usage</h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={workoutUsage}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="workouts" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== WORKOUT TABLE ===== */}
      <section className="space-y-6">
  <h2 className="text-xl font-bold mb-4">Global Workouts</h2>

  <div className="card-glass overflow-hidden">
    {/* HEADER */}
    <div className="grid grid-cols-4 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
      <div>Name</div>
      <div>Category</div>
      <div>Level</div>
      <div className="text-right">Actions</div>
    </div>

    {/* ROWS */}
    <div className="divide-y divide-[var(--border-color)]">
      {workouts.map((workout) => (
        <div
          key={workout.id}
          className="grid grid-cols-4 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition"
        >
          <div className="font-medium">{workout.name}</div>
          <div>
            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-600">
              {workout.category}
            </span>
          </div>
          <div>{workout.level}</div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2">
            <button className="px-3 py-1 text-xs rounded-md bg-blue-500/20 text-blue-500 hover:bg-blue-500/30 flex items-center gap-1">
              <Edit size={14} /> Edit
            </button>

            <button
              onClick={() => deleteWorkout(workout.id)}
              className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1"
            >
              <Trash size={14} /> Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
    </div>
  );
}
