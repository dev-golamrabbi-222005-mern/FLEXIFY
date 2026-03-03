"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import CoachCard from "../cards/CoachCard";

const TopCoaches = () => {
const {
  data: coaches,
  isLoading,
  isError,
} = useQuery<Coach[]>({
  queryKey: ["top-coaches"],
  queryFn: async () => {
    const { data } = await axios.get<Coach[]>("/data.json");
    return data;
  },
});

  // Sort a copy of the data to avoid mutating the original state
 const topCoaches = coaches
   ? [...coaches]
       .sort((a, b) => b.experienceYears - a.experienceYears)
       .slice(0, 3)
   : [];

  const rankStyles = [
    "bg-yellow-400 text-black border-2 border-yellow-500", // 🥇 1st
    "bg-gray-300 text-black border-2 border-gray-400", // 🥈 2nd
    "bg-amber-700 text-white border-2 border-amber-800", // 🥉 3rd
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
      <div className="text-center py-16 text-red-500 font-bold">
        Failed to load Top Coaches.
      </div>
    );

  return (
    <section className="py-8 md:py-12 max-w-7xl px-6 mx-auto relative overflow-hidden">
      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-bold text-center uppercase tracking-tight mb-10"
      >
        Top <span className="text-[var(--primary)]">Experienced Coaches</span>
      </motion.h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {topCoaches.map((coach, index) => (
          <motion.div
            key={coach._id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -10 }} // Subtle lift on hover instead of just scale
            className="relative"
          >
            {/* 🏆 Rank Badge - Made responsive with dynamic positioning and size */}
            <div
              className={`absolute -top-4 -right-2 z-10 
                w-12 h-12 md:w-16 md:h-16 
                flex items-center justify-center 
                text-2xl md:text-4xl 
                rounded-full shadow-xl transform
                ${rankStyles[index]}`}
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
