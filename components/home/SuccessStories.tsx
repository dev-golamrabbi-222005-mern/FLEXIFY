"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// SUCCESS DATA
const SUCCESS_DATA = [
  {
    id: 1,
    name: "James T.",
    badge: "-15lbs",
    badgeType: "weight",
    quote:
      "The logic-based approach removed the guesswork. I finally hit my goal weight in 2 months.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Muscular fit man showing physique transformation",
  },
  {
    id: 2,
    name: "Sarah L.",
    badge: "PR Achieved",
    badgeType: "pr",
    quote:
      "Precision programming that actually understands recovery. My best marathon time yet — 3:42!",
    image:
      "https://plus.unsplash.com/premium_photo-1663089951282-53b47c38e7a0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Woman runner crossing marathon finish line triumphant",
  },
  {
    id: 3,
    name: "Marcus W.",
    badge: "+22lbs Muscle",
    badgeType: "muscle",
    quote:
      "Flexify's AI caught overtraining patterns I never noticed. Gained more in 4 months than the previous year.",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    alt: "Athletic man doing heavy barbell squats in gym",
  },
  {
    id: 4,
    name: "Priya K.",
    badge: "-28lbs",
    badgeType: "weight",
    quote:
      "As a busy mom of three, I needed a plan that adapted to my chaos. Flexify delivered every single week.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    alt: "Woman in yoga pose showing strength and flexibility",
  },
  {
    id: 5,
    name: "Derek O.",
    badge: "Podium Finish",
    badgeType: "pr",
    quote:
      "Placed 2nd at my first powerlifting meet. The periodization plan was exactly what I needed.",
    image:
      "https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&q=80",
    alt: "Man lifting heavy barbell with intense focus",
  },
  {
    id: 6,
    name: "Elena R.",
    badge: "-19lbs",
    badgeType: "weight",
    quote:
      "Six weeks in and my energy is through the roof. The nutrition sync with workouts is a total game-changer.",
    image:
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80",
    alt: "Fit woman running on outdoor track in athletic wear",
  },
  {
    id: 7,
    name: "Theo B.",
    badge: "Ironman Finish",
    badgeType: "pr",
    quote:
      "Completed my first full Ironman. The adaptive training schedule kept me injury-free through 6 months of prep.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    alt: "Triathlete in serious training session outdoors",
  },
  {
    id: 8,
    name: "Aisha M.",
    badge: "+15lbs Muscle",
    badgeType: "muscle",
    quote:
      "Finally stopped second-guessing my programming. Flexify's AI coach is like having a PhD trainer in my pocket.",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80",
    alt: "Strong woman doing dumbbell exercises in gym",
  },
  {
    id: 9,
    name: "Carl N.",
    badge: "-35lbs",
    badgeType: "weight",
    quote:
      "Down 35 pounds in 5 months. The accountability features kept me consistent when motivation dipped.",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    alt: "Man in athletic gear doing outdoor cardio workout",
  },
  {
    id: 10,
    name: "Yuna S.",
    badge: "100-Day Streak",
    badgeType: "pr",
    quote:
      "Hit a 100-day workout streak and broke my deadlift record twice. Flexify made consistency feel effortless.",
    image:
      "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80",
    alt: "Woman celebrating fitness achievement with raised fists",
  },
];

// Helpers
type BadgeType = "weight" | "muscle" | "pr";

const badgeColor: Record<BadgeType, string> = {
  weight: "var(--primary)",
  muscle: "var(--secondary)",
  pr: "var(--success)",
};

const TOTAL = SUCCESS_DATA.length;

// Wrap index infinitely
const wrap = (index: number) => ((index % TOTAL) + TOTAL) % TOTAL;

// Get N items starting from index, wrapping around
const getWindow = (startIndex: number, count: number) =>
  Array.from({ length: count }, (_, i) => SUCCESS_DATA[wrap(startIndex + i)]);

// useCardsPerView
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

// Single Card
function SuccessCard({ item }: { item: (typeof SUCCESS_DATA)[0] }) {
  return (
    <div className="flex flex-col gap-3 w-full min-w-0">
      <div
        className="relative w-full overflow-hidden rounded-2xl"
        style={{ aspectRatio: "4/5" }}
      >
        <Image
          src={item.image}
          alt={item.alt}
          fill
          className="object-cover object-top transition-transform duration-700 hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 45vw, 30vw"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
      </div>
      <div className="px-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="font-semibold"
            style={{ color: "var(--text-primary)", fontSize: "0.95rem" }}
          >
            {item.name}
          </span>
          <span
            className="font-bold text-sm"
            style={{ color: badgeColor[item.badgeType as BadgeType] }}
          >
            {item.badge}
          </span>
        </div>
        <p
          className="text-sm leading-relaxed italic"
          style={{ color: "var(--text-secondary)" }}
        >
          &ldquo;{item.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

// Main Section
function SuccessStory() {
  const cardsPerView = useCardsPerView();

  // `activeIndex` = the index of the LEFT-MOST visible card
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

  // The visible window: cardsPerView cards starting at activeIndex
  const visibleCards = getWindow(activeIndex, cardsPerView);

  const gridCols =
    cardsPerView === 3
      ? "grid-cols-3"
      : cardsPerView === 2
        ? "grid-cols-2"
        : "grid-cols-1";

  return (
    <section
      className="w-full py-16 px-6"
      style={{ backgroundColor: "var(--bg-primary)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2
          className="font-bold mb-10 text-4xl text-center"
          style={{ color: "var(--text-primary)", letterSpacing: "-0.025em" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          Engineered Success
        </motion.h2>

        {/* ── Carousel ── */}
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
              transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
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

        {/* Controls */}
        <div className="flex items-center justify-between mt-8">
          {/* Dots — one per card, highlights the active one */}
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
                className="rounded-full transition-all duration-300"
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

          {/* Arrows */}
          <div className="flex gap-3">
            <motion.button
              onClick={prev}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full flex items-center justify-center border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--card-bg)",
                color: "var(--text-primary)",
              }}
              aria-label="Previous"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </motion.button>

            <motion.button
              onClick={next}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "var(--primary)", color: "#fff" }}
              aria-label="Next"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </motion.button>
          </div>
        </div>

        {/* Counter */}
        <p
          className="text-xs text-right mt-2"
          style={{ color: "var(--text-secondary)" }}
        >
          {activeIndex + 1} / {TOTAL}
        </p>
      </div>
    </section>
  );
}

export default SuccessStory;
