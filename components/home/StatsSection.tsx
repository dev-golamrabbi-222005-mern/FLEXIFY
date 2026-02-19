import SectionTitle from "@/app/Components/ui/section-title";
import { ReactNode } from "react";
import { FaUsers, FaDumbbell, FaBullseye, FaUserTie } from "react-icons/fa";

// 🔹 Type
type StatItem = {
  id: number;
  value: string;
  label: string;
  icon: ReactNode;
};

// 🔹 Data
const stats: StatItem[] = [
  { id: 1, value: "10K+", label: "Active Users", icon: <FaUsers /> },
  { id: 2, value: "25K+", label: "Workouts Completed", icon: <FaDumbbell /> },
  { id: 3, value: "8K+", label: "Goals Achieved", icon: <FaBullseye /> },
  { id: 4, value: "120+", label: "Expert Trainers", icon: <FaUserTie /> },
];

export default function StatsSection() {
  return (
    <section className="relative overflow-hidden pb-8 md:pb-12 bg-[var(--bg-primary)]">
      <div className="relative mx-auto max-w-7xl px-6">
        <SectionTitle
          title="Flexify Impact"
          subtitle="Building healthier lifestyles through smart fitness tracking"
        />

        {/* 🔹 Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="
                group rounded-3xl
                bg-[var(--card-bg)]
                border border-[var(--border-color)]
                p-6 md:p-8
                text-center
                transition-all duration-300
                hover:-translate-y-2
                hover:bg-[var(--primary)]
              "
            >
              {/* Icon */}
              <div className="mb-5 flex justify-center">
                <div
                  className="
                    text-4xl
                    text-[var(--primary)]
                    transition-all duration-300
                    group-hover:text-white
                    group-hover:scale-110
                  "
                >
                  {stat.icon}
                </div>
              </div>

              {/* Value */}
              <h3
                className="
                  text-3xl md:text-4xl font-extrabold
                  text-[var(--text-primary)]
                  transition-colors duration-300
                  group-hover:text-white
                "
              >
                {stat.value}
              </h3>

              {/* Label */}
              <p
                className="
                  mt-2 text-xs md:text-sm uppercase tracking-wide
                  text-[var(--text-secondary)]
                  transition-colors duration-300
                  group-hover:text-white/90
                "
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
