"use client";

import { Target, Dumbbell, Flame, Droplets, Goal } from "lucide-react";

export default function MyGoals() {
  const goals = [
    {
      title: "Lose Weight",
      value: "5kg",
      progress: 65,
      icon: Flame,
    },
    {
      title: "Build Muscle",
      value: "3kg",
      progress: 40,
      icon: Dumbbell,
    },
    {
      title: "Daily Water",
      value: "2.5L",
      progress: 80,
      icon: Droplets,
    },
    {
      title: "Workout Days",
      value: "20 / month",
      progress: 55,
      icon: Target,
    },
  ];

  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4">
      <div className="flex items-center gap-3 mb-6">
        <Goal />
      <h2 className="text-xl font-semibold text-[var(--text-primary)]">My Goals</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {goals.map((goal, i) => (
          <div
            key={i}
            className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]"
          >
            <div className="flex items-center justify-between mb-4">
              <goal.icon className="text-orange-500" size={26} />
              <span className="text-sm text-gray-400">{goal.value}</span>
            </div>

            <h3 className="font-medium mb-3">{goal.title}</h3>

            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-orange-500 h-full"
                style={{ width: `${goal.progress}%` }}
              />
            </div>

            <p className="text-xs mt-2 text-gray-400">
              {goal.progress}% Completed
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}