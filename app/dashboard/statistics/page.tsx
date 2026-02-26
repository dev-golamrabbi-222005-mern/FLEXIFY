"use client";

import {
  BarChart2,
  Activity,
  Flame,
  Scale,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

export default function StatisticsPage() {
  // Weekly workout data
  const workoutData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Workout Duration (mins)",
        data: [60, 45, 75, 50, 90, 40, 70],
        backgroundColor: "rgba(249, 115, 22, 0.6)",
        borderRadius: 8,
      },
    ],
  };

  // Weight progress data
  const weightData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weight (kg)",
        data: [82, 80, 78, 76],
        borderColor: "rgba(249, 115, 22, 1)",
        backgroundColor: "rgba(249, 115, 22, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8 bg-[var(--bg-primary)] min-h-screen max-w-7xl mx-auto">
      {/* Title */}
      <div className="flex items-center gap-3">
        <BarChart2 className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold">Statistics</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
          <div className="flex items-center gap-3 mb-3">
            <Activity className="text-orange-500" />
            <h3 className="font-semibold">Total Workouts</h3>
          </div>
          <p className="text-3xl font-bold">128</p>
        </div>

        <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
          <div className="flex items-center gap-3 mb-3">
            <Flame className="text-orange-500" />
            <h3 className="font-semibold">Calories Burned</h3>
          </div>
          <p className="text-3xl font-bold">12,450 kcal</p>
        </div>

        <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
          <div className="flex items-center gap-3 mb-3">
            <Scale className="text-orange-500" />
            <h3 className="font-semibold">Current Weight</h3>
          </div>
          <p className="text-3xl font-bold">76 kg</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Weekly Workout Duration</h2>
          <Bar data={workoutData} />
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
          <h2 className="font-semibold mb-4">Weight Progress</h2>
          <Line data={weightData} />
        </div>
      </div>
    </div>
  );
}