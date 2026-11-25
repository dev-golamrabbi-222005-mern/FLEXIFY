"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionTitle from "@/app/(website)/components/ui/section-title";
import { SUCCESS_DATA } from "./successData";
import { SuccessCard } from "./SuccessCard";

const TOTAL = SUCCESS_DATA.length;
const wrap = (index: number) => ((index % TOTAL) + TOTAL) % TOTAL;
const getWindow = (startIndex: number, count: number) =>
  Array.from({ length: count }, (_, i) => SUCCESS_DATA[wrap(startIndex + i)]);

function useCardsPerView() {
  const getCount = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  };

  const [count, setCount] = useState(getCount);

  useEffect(() => {
    const handler = () => setCount(getCount());
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return count;
}

export default function SuccessStory() {
  const cardsPerView = useCardsPerView();
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const go = useCallback((dir: 1 | -1) => {
    setDirection(dir);
    setActiveIndex((prev) => wrap(prev + dir));
  }, []);

  const next = useCallback(() => go(1), [go]);
  const prev = useCallback(() => go(-1), [go]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4444);
    return () => clearInterval(timer);
  }, [next, paused]);

  const visibleCards = getWindow(activeIndex, cardsPerView);
  const gridCols =
    cardsPerView === 3
      ? "grid-cols-3"
      : cardsPerView === 2
        ? "grid-cols-2"
        : "grid-cols-1";

  return (
    <section
      className="py-12 md:py-16 lg:py-20"
      style={{ backgroundColor: "var(--bg-primary)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          style={{ color: "var(--text-primary)", letterSpacing: "-0.025em" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <SectionTitle title="Engineered Success" />
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={activeIndex}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? "100%" : "-100%",
                  opacity: 0,
                }),
                center: { x: "0%", opacity: 1 },
                exit: (dir: number) => ({
                  x: dir > 0 ? "-100%" : "100%",
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`grid gap-8 ${gridCols}`}
            >
              {visibleCards.map((item, i) => (
                <motion.div
                  key={`${activeIndex}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.07,
                    duration: 0.4,
                    ease: "easeOut",
                  }}
                >
                  <SuccessCard item={item} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center gap-2">
            {SUCCESS_DATA.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => {
                  const dir = i > activeIndex ? 1 : -1;
                  setDirection(dir);
                  setActiveIndex(i);
                }}
                aria-label={`Go to card ${i + 1}`}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{
                  width: i === activeIndex ? 24 : 8,
                  height: 8,
                  backgroundColor:
                    i === activeIndex
                      ? "var(--primary)"
                      : "var(--border-color)",
                }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="arrow-btn w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              aria-label="Previous"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="arrow-btn w-10 h-10 rounded-full flex items-center justify-center cursor-pointer"
              aria-label="Next"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.button>
          </div>
        </div>

        <p className="text-xs text-right mt-2" style={{ color: "var(--text-secondary)" }}>
          {activeIndex + 1} / {TOTAL}
        </p>
      </div>
    </section>
  );
}
