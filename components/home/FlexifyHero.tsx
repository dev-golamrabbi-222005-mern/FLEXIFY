"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ArrowRight, Zap, Target, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function FlexifyHero() {
  const [index, setIndex] = useState(0);

  // ✅ FETCH FROM DB
  const { data: slides = [], isLoading } = useQuery({
    queryKey: ["heroSlides"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/content?type=hero");
      return res.data;
    },
  });

  useEffect(() => {
    if (slides.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides]);

  // ✅ fallback (important)
  if (isLoading || slides.length === 0) {
    return <p className="text-center py-20">Loading Hero...</p>;
  }

  return (
    <section className="relative min-h-[380px] pt-7 pb-4 w-full bg-[var(--bg-primary)] overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.5, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full h-full"
          >
            <img
              src={slides[index].img}
              className="object-cover w-full h-full grayscale"
              alt="Background"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-6 gap-12">
        <div className="w-full md:w-1/2">
          <AnimatePresence mode="wait">
            <motion.div key={index}>
              <h2 className="text-5xl font-black">
                FLEXIFY <br />
                <span className="text-[var(--primary)]">
                  {slides[index].highlight}
                </span>
              </h2>

              <p className="mt-4 text-lg">{slides[index].desc}</p>

              <button className="btn-primary mt-6">
                Join Now <ArrowRight />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
