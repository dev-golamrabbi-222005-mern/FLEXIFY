
import { ReactNode } from "react";
import {
  FaUsers,
  FaDumbbell,
  FaBullseye,
  FaUserTie,
} from "react-icons/fa";

// 🔹 Type definition
type StatItem = {
  id: number;
  value: string;
  label: string;
  icon: ReactNode;
};

// 🔹 Data
const stats: StatItem[] = [
  {
    id: 1,
    value: "10K+",
    label: "Active Users",
    icon: <FaUsers />,
  },
  {
    id: 2,
    value: "25K+",
    label: "Workouts Completed",
    icon: <FaDumbbell />,
  },
  {
    id: 3,
    value: "8K+",
    label: "Goals Achieved",
    icon: <FaBullseye />,
  },
  {
    id: 4,
    value: "120+",
    label: "Expert Trainers",
    icon: <FaUserTie />,
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-20 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      
      {/* Background blur effects */}
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-green-500/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-emerald-400/20 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        
        {/* Heading */}
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white">
            Flexify <span className="text-green-400">Impact</span>
          </h2>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto">
            Building healthier lifestyles through smart fitness tracking
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center
              hover:border-green-400/50 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]
              transition-all duration-300 hover:-translate-y-2"
            >
              <div className="flex justify-center mb-5">
                <div className="text-green-400 text-4xl group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
              </div>

              <h3 className="text-4xl font-extrabold text-white">
                {stat.value}
              </h3>
              <p className="text-gray-400 mt-2 text-sm tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
