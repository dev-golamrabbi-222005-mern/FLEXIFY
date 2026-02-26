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
    { icon: <FaUsers />, title: "Global Reach", desc: "50K+ active users" },
    {
      icon: <FaChartLine />,
      title: "High Revenue",
      desc: "Market-leading rates",
    },
    { icon: <FaRocket />, title: "Fast Track", desc: "Career growth tools" },
  ];

  return (
    <section className="pt-12 md:pt-20 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative group">
          {/* 1. Background Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[var(--primary)] to-orange-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative bg-white/10 border border-white/10 rounded-[2rem] overflow-hidden"
          >
            {/* 2. Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
              {/* Left Column: Visual/Stats */}
              <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/20 to-transparent z-10" />
                <img
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?w=800&auto=format&fit=crop&q=80"
                  alt="Coach Training"
                  className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                />
                <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                    <p className="text-white font-bold text-xl">$4,500+</p>
                    <p className="text-white/60 text-xs uppercase tracking-wider">
                      Avg. Monthly Earnings
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: CTA & Benefits */}
              <div className="lg:col-span-7 p-8 md:p-14 lg:p-16 flex flex-col justify-center">
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

                <p className="text-gray-400 text-lg mb-10 font-semibold max-w-xl leading-relaxed">
                  We don&apos;t just hire coaches; we build brands. Get the
                  platform, the audience, and the tools you need to scale your
                  fitness career.
                </p>

                {/* Benefits List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8 mb-12">
                  {benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="mt-1 w-10 h-10 shrink-0 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] text-lg border border-[var(--primary)]/20">
                        {b.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-semibold">{b.title}</h4>
                        <p className="text-gray-500 text-sm">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA Button Group */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <Link href="/applycoach" className="w-full sm:w-auto">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full cursor-pointer sm:w-auto px-10 py-5 bg-white text-black font-black rounded-full flex items-center justify-center gap-3 hover:bg-[var(--primary)] hover:text-white transition-colors duration-300"
                    >
                      APPLY TO COACH <FaChevronRight className="text-xs" />
                    </motion.button>
                  </Link>
                  <span className="text-gray-500 text-sm font-medium">
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