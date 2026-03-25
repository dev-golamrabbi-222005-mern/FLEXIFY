"use client";

import { Dumbbell, Layers, Loader2 } from "lucide-react";
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
  CartesianGrid,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ইন্টারফেস ডিফাইন করা হয়েছে আপনার রিকোয়েস্ট অনুযায়ী
interface WorkoutStats {
  totalWorkouts: number;
  categoriesCount: number;
  categoryData: { name: string; value: number }[];
  workoutUsage: { month: string; workouts: number }[];
}

export default function WorkoutLibraryPage() {
  
  const { data: statsData, isLoading } = useQuery<WorkoutStats>({
    queryKey: ["workout-library-stats"],
    queryFn: async () => (await axios.get("/api/admin/workout-stats")).data,
  });

  const COLORS = ["#3b82f6", "#10b981", "#f97316", "#8b5cf6", "#ec4899"];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const cards = [
    {
      title: "Total Workouts",
      value: statsData?.totalWorkouts || 0,
      icon: Dumbbell,
      color: "from-indigo-500 to-blue-500",
    },
    {
      title: "Categories",
      value: statsData?.categoriesCount || 0,
      icon: Layers,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 mt-10 bg-[var(--bg-primary)] space-y-10 pb-20">
      
      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map((stat, index) => (
          <div key={index} className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className="flex justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white`}>
                <stat.icon size={22} />
              </div>
            </div>
            <h4 className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              {stat.title}
            </h4>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* ===== CHARTS ===== */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Category Pie Chart */}
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="font-bold mb-6 text-lg">Workout Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statsData?.categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                label={({ name, percent }) => 
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
              >
                {statsData?.categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Workout Usage Bar Chart */}
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="font-bold mb-6 text-lg">Workout Activity (Monthly Logs)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statsData?.workoutUsage}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
              <XAxis dataKey="month" fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
              <YAxis fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
              <Tooltip 
                 cursor={{fill: 'var(--bg-tertiary)', opacity: 0.4}}
                 contentStyle={{ background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }}
              />
              <Bar dataKey="workouts" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}