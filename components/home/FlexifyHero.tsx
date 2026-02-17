"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dumbbell, ArrowRight, Zap, Target, Users } from "lucide-react";

const slides = [
  {
    id: 1,
    role: "SPECTATOR",
    title: "WITNESS",
    highlight: "RESULTS",
    desc: "Join thousands of viewers watching real-time transformations and success stories.",
    img: "https://i.ibb.co.com/M5kfgdR2/image.png",
    icon: <Users size={24} />,
  },
  {
    id: 2,
    role: "ATHLETE",
    title: "EVOLVE",
    highlight: "LIMITS",
    desc: "Push beyond your boundaries with our AI-powered exercise tracking system.",
    img: "https://i.ibb.co.com/27PD6wh6/image.png",
    icon: <Dumbbell size={24} />,
  },
  {
    id: 3,
    role: "COACH",
    title: "LEAD",
    highlight: "SQUAD",
    desc: "Empower others. Manage your students with the most advanced coach dashboard.",
    img: "https://i.ibb.co.com/8Df59Q4p/image.png",
    icon: <Target size={24} />,
  }
];

export default function FlexifyHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-[500px] py-7 w-full bg-[var(--bg-primary)] px-6 overflow-hidden transition-colors duration-700 font-sans flex items-center">
      
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 0.12, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <img 
              src={slides[index].img} 
              className="w-full h-full object-cover grayscale" 
              alt="Background" 
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-transparent to-[var(--bg-primary)]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative  z-10 w-full max-w-[1280px] mx-auto  grid lg:grid-cols-2 gap-16 items-center">
        
        <div className="w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 40 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="flex items-center gap-3 mb-8 bg-[var(--card-bg)] w-fit px-3 py-2.5 rounded-2xl backdrop-blur-md border border-[var(--border-color)]">
                <div className="text-[var(--primary)]">{slides[index].icon}</div>
                <span className="text-[var(--text-primary)] font-bold tracking-[0.25em] text-[11px] uppercase">
                  {slides[index].role} PORTAL
                </span>
              </div>

              <h2 className="text-7xl md:text-[110px] font-black text-[var(--text-primary)] leading-[0.8] mb-10 tracking-[ -0.05em] uppercase">
                FLEXIFY <br />
                <span className="text-[var(--primary)]">{slides[index].highlight}</span>
              </h2>

              <p className="text-[var(--text-secondary)] text-xl md:text-2xl max-w-lg mb-12 leading-relaxed font-medium opacity-90">
                {slides[index].desc}
              </p>

              <div className="flex flex-col lg:flex-row  gap-6">
                <button className="bg-[var(--primary)] text-white font-black px-12 py-6 w-full rounded-2xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-2xl shadow-orange-500/20 uppercase text-lg ">
                  Join Now <ArrowRight size={24} />
                </button>
                <button className="px-8 py-6 rounded-2xl border-2 w-full border-[var(--border-color)] text-[var(--text-primary)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all bg-transparent backdrop-blur-sm flex items-center justify-center gap-3 font-bold uppercase tracking-tight text-center">
    Learn More <Zap size={22} className="fill-current" />
  </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative flex justify-end items-center h-full">
          <div className="relative w-full max-w-[520px] aspect-[9/9] rounded-2xl overflow-hidden bg-[var(--bg-secondary)] border border-[var(--border-color)] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={index}
                initial={{ clipPath: "circle(0% at 50% 50%)", filter: "blur(15px)", scale: 1.1 }}
                animate={{ clipPath: "circle(150% at 50% 50%)", filter: "blur(0px)", scale: 1 }}
                exit={{ opacity: 0, filter: "blur(10px)", scale: 1.05 }}
                transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <img 
                  src={slides[index].img} 
                  className="w-full h-full object-cover"
                  alt="Fitness Performance"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                <div className="absolute bottom-12 left-10 right-10 flex justify-between items-end z-20">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      {slides.map((_, i) => (
                        <div key={i} className={`h-2 rounded-full transition-all duration-700 ${index === i ? 'w-12 bg-[var(--primary)]' : 'w-5 bg-white/20'}`} />
                      ))}
                    </div>
                    <p className="text-white font-black text-5xl uppercase tracking-tighter drop-shadow-2xl">
                      {slides[index].highlight}
                    </p>
                  </div>
                  <div className="p-5 bg-[var(--primary)] rounded-2xl shadow-xl">
                    <Zap className="text-white" fill="white" size={32} />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

      </div>

     
    </section>
  );
}