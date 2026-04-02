"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FaDumbbell, FaUsers, FaChartLine, FaRocket } from "react-icons/fa";

export default function BecomeCoachCTA() {
  const benefits = [
    {
      icon: <FaDumbbell />,
      title: "Flexible Hours",
      description: "Work on your own schedule",
    },
    {
      icon: <FaUsers />,
      title: "Growing Client Base",
      description: "Access to 50K+ active users",
    },
    {
      icon: <FaChartLine />,
      title: "Premium Earnings",
      description: "Competitive rates & bonuses",
    },
    {
      icon: <FaRocket />,
      title: "Career Growth",
      description: "Professional development support",
    },
  ];

  return (
    <section className="relative overflow-hidden py-8 md:py-12 lg:py-16">
      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background Image with Slow Zoom */}
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("https://images.unsplash.com/photo-1687350119840-3e2cc5977e92?w=1600&auto=format&fit=crop&q=80")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Dark + Blur Overlay */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          {/* Animated Dots Pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `radial-gradient(circle, #fff 2px, transparent 2px)`,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating Glow Elements */}
          <motion.div
            className="absolute w-32 h-32 rounded-full top-10 left-10 bg-white/10 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute w-40 h-40 rounded-full bottom-10 right-10 bg-white/10 blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/20 backdrop-blur-md"
                >
                  <span className="text-sm font-bold text-white">
                    🔥 We are Hiring
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl"
                >
                  Join Flexify as a
                  <br />
                  <span className="relative inline-block text-[var(--primary)] ">
                    Certified Coach
                    <motion.div
                      className="absolute left-0 right-0 h-2 bg-white rounded-full -bottom-2"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, duration: 0.6 }}
                    />
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 text-lg leading-relaxed md:text-xl text-white/90"
                >
                  Transform lives, build your brand, and earn on your terms.
                  Join our community of elite fitness professionals making a
                  real difference.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/applycoach">
                    <motion.button
                      className="inline-flex items-center gap-3 px-8 py-4 text-lg font-bold shadow-2xl cursor-pointer group rounded-xl"
                      style={{
                        backgroundColor: "#fff",
                        color: "#10B981",
                      }}
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 15px 50px rgba(255,255,255,0.4)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Apply Now
                      <motion.span
                        animate={{ x: [0, 5, 0] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        →
                      </motion.span>
                    </motion.button>
                  </Link>
                  <p className="mt-3 text-sm text-white/70">
                    ⚡ Quick application • 2-3 day review
                  </p>
                </motion.div>
              </div>

              {/* Right Benefits */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="p-6 border bg-white/10 backdrop-blur-md rounded-2xl border-white/20"
                  >
                    <div className="mb-3 text-3xl text-white">
                      {benefit.icon}
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-white/80">
                      {benefit.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}