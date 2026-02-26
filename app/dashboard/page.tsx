"use client";

import {Home, Flag, Calendar, Trophy, BarChart2, Settings, Dumbbell, Salad, Moon} from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="bg-[var(--bg-primary)] flex min-h-screen max-w-7xl mx-auto">

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Build Muscles</h1>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
            <div className="flex items-center gap-4 font-bold">
              <Dumbbell size={32} className="mb-2 text-orange-500"/>
            <h3>Exercises</h3>
            </div>
            <p className="text-3xl font-bold mt-2">10</p>
            <span>1h 50m</span>
          </div>

          <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
            <div className="flex items-center gap-4 font-bold">
              <Salad size={32} className="mb-2 text-orange-500" />
              <h3>Meals</h3>
            </div>
            <p className="text-3xl font-bold mt-2">6</p>
            <span>1600 Cal</span>
          </div>

          <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
            <div className="flex items-center gap-4 font-bold">
              <Moon size={32} className="mb-2 text-orange-500" />
              <h3>Sleep</h3>
            </div>
            <p className="text-3xl font-bold mt-2">8h</p>
          </div>
        </div>

        {/* Chart Placeholder */}
        <div className="bg-[var(--card-bg)] mt-8 p-6 rounded-xl shadow">
          <h3 className="font-semibold mb-4 text-[var(--text-primary)]">
            Statistics
          </h3>

          <div className="h-48 flex items-center justify-center text-[var(--text-secondary)]">
            Chart Here (Recharts)
          </div>
        </div>
      </main>
    </div>
  );
};
export default Dashboard;
