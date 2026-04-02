"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import {
  FaDumbbell,
  FaUsers,
  FaChartLine,
  FaRocket,
  FaChevronRight,
} from "react-icons/fa";

export default function BecomeCoachCTA() {
  const benefits = [
    {
      icon: <FaDumbbell />,
      title: "Flexible Hours",
      desc: "Schedule on your terms",
    },
    { icon: <FaUsers />, title: "Global Reach", desc: "Access to a growing community of active users" },
    {
      icon: <FaChartLine />,
      title: "High Revenue",
      desc: "Market-leading rates",
    },
    { icon: <FaRocket />, title: "Fast Track", desc: "Career growth tools" },
  ];

  return (
    <section className="px-6 pt-12 overflow-hidden md:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative group">
          {/* 1. Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dark)] rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white/10 border border-white/10 rounded-[2rem] overflow-hidden"
          >
            {/* 2. Content Grid */}
            <div className="grid items-stretch grid-cols-1 lg:grid-cols-12">
              {/* Left Column: Visual/Stats */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80"
                  alt="Coach Training"
                  className="absolute inset-0 object-cover w-full h-full transition-all duration-700 scale-110 grayscale hover:grayscale-0 group-hover:scale-100"
                />
                <div className="absolute z-20 bottom-6 left-6 right-6">
                  <div className="p-4 border bg-black/60 backdrop-blur-md rounded-2xl border-white/10">
                    <p className="text-xl font-bold text-white">$500+</p>
                    <p className="text-xs tracking-wider uppercase text-white/60">
                      Avg. Monthly Earnings
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA & Benefits */}
              <div className="flex flex-col justify-center p-8 lg:col-span-7 md:p-14 lg:p-16">
                <motion.span
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  className="text-[var(--primary)] font-bold tracking-[0.2em] text-sm uppercase mb-4 block"
                >
                  Join the Elite
                </motion.span>

                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-[1.1]">
                  Ready to lead the <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                    Next Generation?
                  </span>
                </h2>

                <p className="max-w-xl mb-10 text-lg font-semibold leading-relaxed text-gray-400">
                  We don&apos;t just hire coaches; we build brands. Get the
                  platform, the audience, and the tools you need to scale your
                  fitness career.
                </p>

                {/* Benefits List */}
                <div className="grid grid-cols-1 mb-12 sm:grid-cols-2 gap-y-6 gap-x-8">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="mt-1 w-10 h-10 shrink-0 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-lg border border-[var(--primary)]/20">
                        {b.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{b.title}</h4>
                        <p className="text-sm text-gray-500">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button Group */}
                <div className="flex flex-col items-center gap-6 sm:flex-row">
                  <Link href="/applycoach" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full cursor-pointer sm:w-auto px-10 py-5 bg-white text-black font-black rounded-full flex items-center justify-center gap-3 hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
                    >
                      APPLY TO COACH <FaChevronRight className="text-xs" />
                    </motion.button>
                  </Link>
                  <span className="text-sm font-medium text-gray-500">
                    Limited spots available for Q3
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
