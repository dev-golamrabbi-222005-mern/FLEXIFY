"use client";

import { BarChart2, Activity, Flame, Scale } from "lucide-react";
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
    <div className="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 space-y-6 md:space-y-8 bg-[var(--bg-primary)] min-h-screen">

      {/* Title */}
      <div className="flex items-center gap-3">
        <BarChart2 className="w-6 h-6 md:w-7 md:h-7 text-orange-500" />
        <h1 className="text-xl md:text-2xl font-bold">Statistics</h1>
      </div>

      {/* Summary Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

        {/* Card 1 */}

        <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-5 md:p-8
        transition-all duration-300 hover:-translate-y-2
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">

          <div className="flex items-center gap-3 mb-3">
            <Activity className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
            <h3 className="font-semibold text-sm md:text-base">
              Total Workouts
            </h3>
          </div>

          <p className="text-2xl md:text-3xl font-bold">128</p>
        </div>

        {/* Card 2 */}

        <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-5 md:p-8
        transition-all duration-300 hover:-translate-y-2
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">

          <div className="flex items-center gap-3 mb-3">
            <Flame className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
            <h3 className="font-semibold text-sm md:text-base">
              Calories Burned
            </h3>
          </div>

          <p className="text-2xl md:text-3xl font-bold">12,450 kcal</p>
        </div>

        {/* Card 3 */}

        <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-5 md:p-8
        transition-all duration-300 hover:-translate-y-2
        hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">

          <div className="flex items-center gap-3 mb-3">
            <Scale className="text-orange-500 w-5 h-5 md:w-6 md:h-6" />
            <h3 className="font-semibold text-sm md:text-base">
              Current Weight
            </h3>
          </div>

          <p className="text-2xl md:text-3xl font-bold">76 kg</p>
        </div>

      </div>

      {/* Charts */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* Workout Chart */}

        <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow">

          <h2 className="font-semibold mb-4 text-sm md:text-base">
            Weekly Workout Duration
          </h2>

          <div className="w-full h-[250px]">
            <Bar data={workoutData} options={{ maintainAspectRatio: false }} />
          </div>

        </div>

        {/* Weight Chart */}

        <div className="bg-[var(--card-bg)] p-4 md:p-6 rounded-2xl shadow">

          <h2 className="font-semibold mb-4 text-sm md:text-base">
            Weight Progress
          </h2>

          <div className="w-full h-[250px]">
            <Line data={weightData} options={{ maintainAspectRatio: false }} />
          </div>

        </div>

      </div>

    </div>
  );
}