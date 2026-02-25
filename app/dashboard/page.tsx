"use client";

import {Home, Flag, Calendar, Trophy, BarChart2, Settings} from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  return (
    <div className="bg-[var(--bg-primary)] flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[var(--card-bg)] rounded-2xl p-4 shadow-lg flex flex-col justify-between">
        {/* Top */}
        <div>
          {/* Profile */}
          <div className="text-center pb-4">
            <div className="relative w-fit mx-auto">
              <img
                src="https://i.postimg.cc/FzTr6D42/JUBAYER_Photo.jpg"
                className="w-16 h-16 rounded-full object-cover mx-auto"
              />
              <span className="absolute -right-8 top-1 text-xs text-pink-400 cursor-pointer">
                EDIT
              </span>
            </div>

            <h3 className="mt-2 font-semibold">Jubayer Hossain</h3>
            <p className="text-xs text-[var(--text-secondary)]">Male, 28 years</p>
          </div>

          {/* Height Weight */}
          <div className="flex border border-gray-300/50 rounded-xl overflow-hidden mb-6">
            <div className="w-1/2 text-center py-3 border-r border-gray-300/50">
              <p className="text-xs text-orange-500 font-semibold">HEIGHT</p>
              <p className="font-bold">
                185 <span className="text-sm text-gray-400">cm</span>
              </p>
            </div>

            <div className="w-1/2 text-center py-3">
              <p className="text-xs text-orange-500 font-semibold">WEIGHT</p>
              <p className="font-bold">
                176 <span className="text-sm text-gray-400">kg</span>
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="mt-4 space-y-4 text-[var(--text-primary)]">
            <Link href="/dashboard" className="flex items-center gap-3 text-blue-400 font-medium">
              <Home size={18} /> Home
            </Link>

            <Link href="/goals" className="flex items-center gap-3">
              <Flag size={18} /> My goals
            </Link>

            <Link href="/schedule" className="flex items-center gap-3">
              <Calendar size={18} /> Schedule
            </Link>

            <Link href="/achievements" className="flex items-center gap-3">
              <Trophy size={18} /> Achievements
            </Link>

            <Link href="/statistics" className="flex items-center gap-3">
              <BarChart2 size={18} /> Statistics
            </Link>

            <Link href="/settings" className="flex items-center gap-3">
              <Settings size={18} /> Settings
            </Link>
          </nav>
        </div>

        {/* Bottom Card */}
        <div className="bg-[var(--primary)] text-[var(--text-primary)] text-center p-4 rounded-xl text-sm mt-6">
          <h4 className="font-semibold">CONGRATULATIONS!</h4>
          <p>You have unlocked the “Expert” level.</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Build Muscles</h1>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6">
          <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
            <h3>Exercises</h3>
            <p className="text-3xl font-bold mt-2">10</p>
            <span>1h 50m</span>
          </div>

          <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
            <h3>Meals</h3>
            <p className="text-3xl font-bold mt-2">6</p>
            <span>1600 Cal</span>
          </div>

          <div className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]">
            <h3>Sleep</h3>
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
