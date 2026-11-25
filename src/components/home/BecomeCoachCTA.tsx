"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { COACH_BENEFITS } from "./coachBenefits";

export default function BecomeCoachCTA() {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 lg:py-20">
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

          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/60" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-[var(--primary)]/30 to-transparent"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Content Container */}
          <div className="relative z-10 p-8 md:p-12 lg:p-16">
            <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Left Content */}
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="inline-block px-4 py-2 mb-4 border bg-white/10 backdrop-blur-md rounded-full border-white/20"
                >
                  <span className="text-sm font-semibold text-white">
                    ⭐ Join Our Elite Coaching Team
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="mb-6 text-3xl font-bold text-white md:text-5xl"
                >
                  Share Your Passion.{" "}
                  <span className="text-[var(--primary)]">
                    Inspire Growth.
                  </span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="mb-8 text-lg leading-relaxed text-white/80"
                >
                  Join Flexify as a certified coach. Help thousands achieve
                  their fitness goals with our AI-powered platform and earn on
                  your terms.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 }}
                >
                  <Link href="/applycoach">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-8 py-4 text-lg font-bold text-white shadow-2xl rounded-2xl bg-[var(--primary)] transition-colors cursor-pointer"
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
                {COACH_BENEFITS.map((benefit, i) => (
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
