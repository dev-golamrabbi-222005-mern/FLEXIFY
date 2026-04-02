"use client";
import SectionTitle from "@/app/(website)/components/ui/section-title";
import { ReactNode, useEffect, useRef } from "react";
import { FaUsers, FaDumbbell, FaBullseye, FaUserTie } from "react-icons/fa";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
} from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// 🔹 Type
type StatItem = {
  id: number;
  value: number;
  suffix: string;
  label: string;
  icon: ReactNode;
};

// 🔹 Counter Component
function Counter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 3,
        ease: "easeOut",
      });
      return controls.stop;
    }
  }, [isInView, count, value]);

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

export default function StatsSection() {
  const {data: users} = useQuery({
    queryKey: ["users"],
    queryFn: async() => {
      const res = await axios.get(`/api/user?role=user`);
      return res.data;
    }
  });
  const {data: achievements} = useQuery({
    queryKey: ["achievements"],
    queryFn: async() => {
      const res = await axios.get(`/api/stats/goal-achieved`);
      return res.data;
    }
  });
  const {data: completedWorkouts} = useQuery({
    queryKey: ["completedWorkouts"],
    queryFn: async() => {
      const res = await axios.get(`/api/stats/workout-complete`);
      return res.data;
    }
  });
  const {data: coaches} = useQuery({
    queryKey: ["coaches"],
    queryFn: async() => {
      const res = await axios.get(`/api/coach`);
      return res.data;
    }
  });
  // 🔹 Data
  const stats: StatItem[] = [
    {
      id: 1,
      value: users?.length | 0,
      suffix: "K+",
      label: "Active Users",
      icon: <FaUsers />
    },
    {
      id: 2,
      value: completedWorkouts?.length | 0,
      suffix: "K+",
      label: "Workouts Completed",
      icon: <FaDumbbell />,
    },
    {
      id: 3,
      value: achievements?.length | 0,
      suffix: "K+",
      label: "Goals Achieved",
      icon: <FaBullseye />,
    },
    {
      id: 4,
      value: coaches?.length | 0,
      suffix: "+",
      label: "Expert Trainers",
      icon: <FaUserTie />,
    },
  ];
  return (
    <section className="relative overflow-hidden py-8 md:py-12 lg:py-16">
      <div className="relative">
        <SectionTitle
          title="Flexify Impact"
          subtitle="Building healthier lifestyles through smart fitness tracking"
        />

        {/* 🔹 Stats Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
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
              <div className="flex justify-center mb-5">
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

              {/* Value with Counter */}
              <h3
                className="
                  text-3xl md:text-4xl font-extrabold
                  text-[var(--text-primary)]
                  transition-colors duration-300
                  group-hover:text-white
                "
              >
                <Counter value={stat.value} suffix={stat.suffix} />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
