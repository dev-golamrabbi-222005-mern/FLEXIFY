"use client";

import { motion } from "framer-motion";
import { FaFire, FaClock } from "react-icons/fa";
import SectionTitle from "@/app/Components/ui/section-title";

const workouts = [
  {
    title: "Full Body Strength",
    level: "Advanced",
    duration: "45 min",
    calories: "450 kcal",
    image:
      "https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=1000&q=80",
  },
  {
    title: "HIIT Fat Burner",
    level: "Intermediate",
    duration: "30 min",
    calories: "380 kcal",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=1000&q=80",
  },
  {
    title: "Core Crusher",
    level: "Beginner",
    duration: "25 min",
    calories: "250 kcal",
    image:
      "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?w=1000&q=80",
  },
  {
    title: "Upper Body Power",
    level: "Advanced",
    duration: "40 min",
    calories: "420 kcal",
    image:
      "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=1000&q=80",
  },
];

export default function PopularWorkouts() {
  return (
    <section className="pb-20 px-6 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto">

        {/* ✅ BMI Style Section Title */}
        <SectionTitle
          title="Popular Workouts"
        />

        {/* Workout Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
          {workouts.map((workout, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative group rounded-2xl overflow-hidden bg-white/5 backdrop-blur-lg border border-white/10 shadow-xl"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={workout.image}
                  alt={workout.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Level Badge */}
                <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {workout.level}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  {workout.title}
                </h3>

                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <FaClock className="text-orange-500" />
                    {workout.duration}
                  </div>

                  <div className="flex items-center gap-2">
                    <FaFire className="text-orange-500" />
                    {workout.calories}
                  </div>
                </div>

                <button className="mt-6 w-full py-3 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition duration-300 shadow-lg">
                  Start Workout
                </button>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}