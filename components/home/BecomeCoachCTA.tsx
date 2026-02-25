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
    <section className="py-16 md:py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative rounded-3xl overflow-hidden"
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
            className="absolute top-10 left-10 w-32 h-32 rounded-full bg-white/10 blur-3xl"
            animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.div
            className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-white/10 blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, -15, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md rounded-full px-4 py-2 mb-6"
                >
                  <span className="text-white text-sm font-bold">
                    🔥 We are Hiring
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight"
                >
                  Join Flexify as a
                  <br />
                  <span className="relative inline-block text-[var(--primary)] ">
                    Certified Coach
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-2 bg-white rounded-full"
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
                  className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
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
                      className="group px-8 py-4 rounded-xl font-bold text-lg shadow-2xl inline-flex items-center gap-3 cursor-pointer"
                      style={{
                        backgroundColor: "#fff",
                        color: "#f97316",
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
                  <p className="text-white/70 text-sm mt-3">
                    ⚡ Quick application • 2-3 day review
                  </p>
                </motion.div>
              </div>

              {/* Right Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
                  >
                    <div className="text-3xl text-white mb-3">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">
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