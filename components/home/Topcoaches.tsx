"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import CoachCard from "../cards/CoachCard"; 

type Coach = {
  _id: string;
  name: string;
  imageUrl?: string;
  location?: string;
  experienceYears?: number; 
  trainingTypes?: string[];
  specialties?: string; 
  pricing?: {
    monthly: number;
    perSession: number;
  };
};

const TopCoaches = () => {
  const {
    data: coaches,
    isLoading,
    isError,
  } = useQuery<Coach[]>({
    queryKey: ["top-coaches"],
    queryFn: async () => {
      const { data } = await axios.get<Coach[]>("/api/coach");
      return data;
    },
  });

const topCoaches = coaches
  ? [...coaches]
      .filter((c) => c.experienceYears !== undefined)
      .sort((a, b) => b.experienceYears! - a.experienceYears!)
      .slice(0, 3)
  : [];

  console.log(topCoaches);

  const rankStyles = [
    "bg-yellow-400 text-black border-2 border-yellow-500", // 🥇
    "bg-gray-300 text-black border-2 border-gray-400", // 🥈
    "bg-amber-700 text-white border-2 border-amber-800", // 🥉
  ];

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px] text-lg font-bold text-[var(--primary)]">
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading Top Coaches...
        </motion.span>
      </div>
    );

  if (isError)
    return (
      <div className="py-16 font-bold text-center text-red-500">
        Failed to load Top Coaches.
      </div>
    );

  return (
    <section className="relative py-8 md:py-12 lg:py-16 overflow-hidden">
      {/* Title */}
      <div className="flex flex-col gap-3 mb-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl font-bold tracking-tight text-center uppercase md:text-4xl"
        >
          Top <span className="text-[var(--primary)]">Experienced Coaches</span>
        </motion.h2>
        <span className="h-1 w-14 mx-auto rounded-full bg-(--primary)" />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 md:gap-10">
        {topCoaches.map((coach: Coach, index: number) => (
          <motion.div
            key={coach._id} // now safe
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }}
            className="relative"
          >
            <div
              className={`absolute -top-4 -right-2 z-10 w-12 h-12 md:w-16 md:h-16 flex items-center justify-center text-2xl md:text-4xl rounded-full shadow-xl transform ${rankStyles[index]}`}
            >
              {index === 0 && "🥇"}
              {index === 1 && "🥈"}
              {index === 2 && "🥉"}
            </div>

            <CoachCard coach={coach} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TopCoaches;
