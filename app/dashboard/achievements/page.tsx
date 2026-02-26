"use client";

import { Trophy, Medal, Star, Target } from "lucide-react";

const achievements = [
  {
    title: "First Workout Completed",
    description: "Completed your first training session.",
    icon: Trophy,
    level: "Beginner",
  },
  {
    title: "5 Days Streak",
    description: "Worked out 5 days continuously.",
    icon: Medal,
    level: "Intermediate",
  },
  {
    title: "Weight Loss -5kg",
    description: "Successfully lost 5kg body weight.",
    icon: Target,
    level: "Advanced",
  },
  {
    title: "Expert Level Unlocked",
    description: "Reached expert training milestone.",
    icon: Star,
    level: "Expert",
  },
];

export default function AchievementsPage() {
  return (
    <div className="mt-10 max-w-7xl mx-auto bg-[var(--bg-primary)] px-4">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="w-7 h-7 text-orange-500" />
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>

      {/* Achievement Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {achievements.map((item, index) => (
          <div
            key={index}
            className="group bg-[var(--card-bg)] border border-[var(--primary)] rounded-2xl p-8 text-left relative
                         transition-all duration-300
                         hover:-translate-y-2
                         hover:shadow-[0_20px_40px_rgba(0,0,0,0.25)] text-[var(--text-primary)]"
          >
            {/* Icon */}
            <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-orange-500/10 mb-4">
              <item.icon className="w-6 h-6 text-orange-500" />
            </div>

            {/* Content */}
            <h2 className="text-lg font-semibold mb-2">{item.title}</h2>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              {item.description}
            </p>

            {/* Level Badge */}
            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                item.level === "Beginner"
                  ? "bg-green-500/20 text-green-500"
                  : item.level === "Intermediate"
                  ? "bg-yellow-500/20 text-yellow-500"
                  : item.level === "Advanced"
                  ? "bg-blue-500/20 text-blue-500"
                  : "bg-purple-500/20 text-purple-500"
              }`}
            >
              {item.level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}