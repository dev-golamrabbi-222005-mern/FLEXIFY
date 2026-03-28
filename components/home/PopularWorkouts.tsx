"use client";

import { motion } from "framer-motion";
import { FaFire, FaClock } from "react-icons/fa";
import SectionTitle from "@/app/(website)/components/ui/section-title";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaDumbbell } from "react-icons/fa6";
import { LucideBicepsFlexed } from "lucide-react";
import Link from "next/link";

interface Workout {
  _id?: string;
  id: string;
  name: string;
  force: string | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

export default function PopularWorkouts() {
  const {data: workouts = []} = useQuery({
    queryKey: ["workouts"],
    queryFn: async () => {
      const res = await axios.get("/api/exercises");
      return res.data.exercises.slice(0, 4);
    }
  });
  return (
    <section className="pb-8 md:pb-12 px-6 bg-[var(--bg-primary)]">
      <div className="mx-auto max-w-7xl">

        {/* ✅ BMI Style Section Title */}
        <SectionTitle
          title="Popular Workouts"
        />

        {/* Workout Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {workouts.map((workout: Workout, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative overflow-hidden border shadow-xl group rounded-2xl bg-white/5 backdrop-blur-lg border-white/10"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={workout.images?.[0] 
                      ? workout.images?.[0].startsWith('http') 
                        ? workout.images?.[0] 
                        : `/exercises/${workout.images?.[0].startsWith('/') ? workout.images?.[0].slice(1) : workout.images?.[0]}`
                      : "/placeholder-exercise.jpg"
                    }
                  alt={workout.name}
                  className="object-cover w-full h-full transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/40"></div>

                {/* Level Badge */}
                <span className="absolute top-4 left-4 bg-(--primary) text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {workout.level}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="mb-4 text-xl font-bold">
                  {workout.name}
                </h3>

                <div className="flex items-center justify-between text-sm text-zinc-400">
                  <div className="flex items-center gap-2">
                    <FaDumbbell className="text-(--primary)" />
                    {workout.equipment}
                  </div>

                  <div className="flex items-center gap-2">
                    <LucideBicepsFlexed className="text-(--primary)" />
                    {workout.force}
                  </div>
                </div>

                <Link href={`/exercises/${workout._id}`} className="mt-6 w-full block py-3 rounded-lg bg-(--primary) text-white text-center font-semibold hover:bg-(--primary-dark) transition duration-300 shadow-lg">
                  Start Workout
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}