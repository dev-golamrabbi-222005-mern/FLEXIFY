"use client";

import {
  motion,
  useMotionValue,
  animate,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useState, useEffect, useRef } from "react";

// Features Data
const FEATURES = [
  {
    id: 1,
    icon: "🤖",
    title: "AI-Powered Coaching",
    description:
      "Get personalized workout suggestions that adapt to your progress, recovery, and goals in real-time.",
    benefits: [
      "Smart workout generation based on your fitness level",
      "Adaptive rest day recommendations",
      "Form correction with computer vision",
      "Plateau detection and auto-adjustment",
    ],
    color: "#F97316", // primary
  },
  {
    id: 2,
    icon: "📊",
    title: "Advanced Analytics",
    description:
      "Track every metric that matters with comprehensive dashboards and beautiful visualizations.",
    benefits: [
      "Visual progress charts and trends",
      "Body composition tracking",
      "Performance predictions",
      "Exportable reports",
    ],
    color: "#10B981", // success
  },
  {
    id: 3,
    icon: "🍎",
    title: "Smart Nutrition Tracking",
    description:
      "Snap photos of your meals and let AI handle the calorie counting and macro breakdown.",
    benefits: [
      "Photo-based meal logging",
      "Automatic calorie estimation",
      "Macro and micronutrient analysis",
      "Recipe suggestions based on goals",
    ],
    color: "#FB923C", // secondary
  },
  {
    id: 4,
    icon: "💬",
    title: "Expert Coach Connection",
    description:
      "Connect with certified trainers for personalized guidance through chat, calls, and video sessions.",
    benefits: [
      "Direct messaging with your coach",
      "Video call consultations",
      "Custom workout plan reviews",
      "Real-time form feedback",
    ],
    color: "#F97316",
  },
  {
    id: 5,
    icon: "📱",
    title: "Mobile-First Experience",
    description:
      "Access your workouts anywhere with our seamless mobile experience and offline mode.",
    benefits: [
      "Offline workout access",
      "Voice-guided exercises",
      "Apple Watch & Wear OS support",
      "Automatic workout logging",
    ],
    color: "#10B981",
  },
  {
    id: 6,
    icon: "🎯",
    title: "Goal-Oriented Programs",
    description:
      "Choose from science-backed programs designed for specific goals like weight loss, muscle gain, or endurance.",
    benefits: [
      "Pre-built proven programs",
      "Periodization and progressive overload",
      "Milestone tracking and celebrations",
      "Community challenges",
    ],
    color: "#FB923C",
  },
];

// Feature Card Component

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`grid md:grid-cols-2 gap-8 items-center my-12 md:my-20 ${
        isEven ? "" : "md:grid-flow-dense"
      }`}
    >
      {/* Icon Circle - Animated */}
      <motion.div
        className={`relative flex items-center justify-center ${
          isEven ? "md:order-1" : "md:order-2"
        }`}
        animate={{
          scale: isHovered ? 1.05 : 1,
          rotate: isHovered ? 5 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {/* Background glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: feature.color }}
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered ? 0.3 : 0.2,
          }}
          transition={{ duration: 0.4 }}
        />

        {/* Main circle */}
        <div
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center border-4 backdrop-blur-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: feature.color,
          }}
        >
          {/* Icon */}
          <motion.div
            className="text-7xl md:text-8xl"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {feature.icon}
          </motion.div>

          {/* Floating particles */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{ backgroundColor: feature.color }}
              animate={{
                x: isHovered ? [0, (i - 1) * 40, 0] : [0, (i - 1) * 20, 0],
                y: isHovered ? [0, (i - 1) * 40, 0] : [0, (i - 1) * 20, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <div className={isEven ? "md:order-2" : "md:order-1"}>
        <motion.div
          initial={{ opacity: 0, x: isEven ? -30 : 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.2, duration: 0.5 }}
        >
          {/* Number badge */}
          <div
            className="inline-block px-4 py-1 rounded-full text-sm font-bold mb-4"
            style={{
              backgroundColor: `${feature.color}20`,
              color: feature.color,
            }}
          >
            Feature #{index + 1}
          </div>

          <h3
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {feature.title}
          </h3>

          <p
            className="text-lg mb-6 leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            {feature.description}
          </p>

          {/* Benefits list */}
          <ul className="space-y-3">
            {feature.benefits.map((benefit, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 + i * 0.05 }}
                className="flex gap-3 items-start"
              >
                <span
                  className="mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: feature.color }}
                />
                <span
                  className="text-sm md:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {benefit}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </div>
    </motion.div>
  );
}

// Counter component with animation
function Counter({
  value,
  suffix = "",
  decimals = 0,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
}) {
  const count = useMotionValue(0);
const rounded = useTransform(count, (latest) =>
  decimals > 0 ? latest.toFixed(decimals) : Math.round(latest).toString(),
);
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

function StatsSection() {
  const stats = [
    { number: 50, suffix: "K+", label: "Active Users" },
    { number: 300, suffix: "K+", label: "Workouts Completed" },
    { number: 100, suffix: "+", label: "Certified Coaches" },
    { number: 4.9, suffix: "★", label: "Average Rating", decimals: 1 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16 my-16 px-8 rounded-3xl relative overflow-hidden"
      style={{
        backgroundColor: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Background gradient orbs */}
      <div
        className="absolute -top-20 -left-20 w-60 h-60 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: "var(--primary)" }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-10"
        style={{ backgroundColor: "var(--success)" }}
      />

      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.1,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
          className="text-center relative z-10"
        >
          <div
            className="text-3xl md:text-4xl font-extrabold mb-2"
            style={{ color: "var(--primary)" }}
          >
            <Counter
              value={stat.number}
              suffix={stat.suffix}
              decimals={stat.decimals}
            />
          </div>
          <div
            className="text-sm md:text-base font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            {stat.label}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

// Parallax Hero Section
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity }}
      className="text-center mt-8 md:mt-12 mb-10"
    >
      {/* Floating badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-block mb-6"
      >
        <div
          className="px-5 py-2 rounded-full text-sm font-bold backdrop-blur-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            border: "2px solid var(--primary)",
            color: "var(--primary)",
          }}
        >
          ✨ Powered by AI & Expert Coaching
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.7 }}
        className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
        style={{ color: "var(--text-primary)" }}
      >
        Features That{" "}
        <span
          className="relative inline-block"
          style={{ color: "var(--primary)" }}
        >
          Transform
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.7 }}
        className="text-lg max-w-3xl mx-auto"
        style={{ color: "var(--text-secondary)" }}
      >
        Everything you need to achieve your fitness goals — backed by AI,
        science, and certified trainers.
      </motion.p>
    </motion.div>
  );
}

// Main Page
export default function FeaturesPage() {
  return (
    <div
      className="min-h-screen overflow-hidden"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <HeroSection />

        {/* Features Grid */}
        <div className="mb-20">
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        {/* Stats */}
        <StatsSection />

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center py-12 my:py-20 mb-12 px-8 rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          {/* Animated gradient background */}
          <motion.div
            className="absolute inset-0 opacity-10"
            animate={{
              background: [
                "radial-gradient(circle at 0% 0%, var(--primary) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 100%, var(--success) 0%, transparent 50%)",
                "radial-gradient(circle at 0% 100%, var(--secondary) 0%, transparent 50%)",
                "radial-gradient(circle at 100% 0%, var(--primary) 0%, transparent 50%)",
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />

          <h2
            className="text-3xl md:text-5xl font-bold mb-6 relative z-10"
            style={{ color: "var(--text-primary)" }}
          >
            Ready to Experience the Difference?
          </h2>
          <p
            className="text-lg md:text-xl mb-8 max-w-2xl mx-auto relative z-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Join thousands of users who have transformed their fitness journey
            with Flexify.
          </p>
          <motion.button
            className="btn-primary text-lg font-bold shadow-xl relative z-10"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 40px rgba(249, 115, 22, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
