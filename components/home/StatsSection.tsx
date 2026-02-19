


import SectionTitle from "@/app/Components/ui/section-title";
import { ReactNode } from "react";
import {
  FaUsers,
  FaDumbbell,
  FaBullseye,
  FaUserTie,
} from "react-icons/fa";

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
    <section
      className="
        relative overflow-hidden
        py-16 md:py-20
        bg-[var(--bg-primary)]
      "
    >
      {/* 🔹 Ambient glow (same theme as pricing) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[var(--primary)]/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[var(--primary)]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* 🔹 Heading */}
        {/* <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--text-primary)]">
            Flexify <span className="text-[var(--primary)]">Impact</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-[var(--text-secondary)]">
            Building healthier lifestyles through smart fitness tracking
          </p>
        </div> */}
       <SectionTitle
       
       title="Flexify Impact" subtitle="Building healthier lifestyles through smart fitness tracking">
        

       </SectionTitle>
        {/* 🔹 Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="
                group rounded-3xl
                bg-(--card-bg)
                border border-white/10
                p-6 md:p-8
                text-center
                transition-all duration-300
                hover:-translate-y-2
                hover:border-(--primary)/50
                hover:shadow-[0_0_30px_var(--border-highlight)]
              "
            >
              <div className="mb-5 flex justify-center">
                <div
                  className="
                    text-4xl
                    text-(--primary)
                    transition-transform duration-300
                    group-hover:scale-110
                  "
                >
                  {stat.icon}
                </div>
              </div>

              <h3 className="text-3xl md:text-4xl font-extrabold text-[var(--text-primary)]">
                {stat.value}
              </h3>
              <p className="mt-2 text-xs md:text-sm uppercase tracking-wide text-[var(--text-secondary)]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
