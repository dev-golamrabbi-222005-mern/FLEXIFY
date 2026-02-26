"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import CoachCard from "@/components/cards/CoachCard/page";

const TopCoaches = () => {
  const {
    data: coaches,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-coaches"],
    queryFn: async () => {
      const { data } = await axios.get("/data.json");
      return data;
    },
  });

  // 🔥 Experience অনুযায়ী Sort করে Top 3 বের করা
  const topCoaches = coaches
    ?.sort((a: any, b: any) => b.experienceYears - a.experienceYears)
    ?.slice(0, 3);

  const rankStyles = [
    "bg-yellow-400 text-black",  // 🥇 1st
    "bg-gray-300 text-black",    // 🥈 2nd
    "bg-amber-700 text-white",   // 🥉 3rd
  ];

  if (isLoading)
    return (
      <div className="text-center py-16 font-bold text-[var(--primary)]">
        Loading Top Coaches...
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-16 text-red-500 font-bold">
        Failed to load Top Coaches.
      </div>
    );

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[var(--primary)] opacity-10 blur-3xl rounded-full -z-10"></div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-5xl font-bold text-center uppercase tracking-tight mb-14"
      >
        Top <span className="text-[var(--primary)]">Experienced Coaches</span>
      </motion.h2>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {topCoaches?.map((coach: any, index: number) => (
          <motion.div
            key={coach._id}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            className="relative transition-all"
          >
            {/* 🏆 Rank Badge */}
            <div
              className={`absolute -top-4 left-85 p-2 text-4xl font-bold rounded-full shadow-lg ${rankStyles[index]}`}
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