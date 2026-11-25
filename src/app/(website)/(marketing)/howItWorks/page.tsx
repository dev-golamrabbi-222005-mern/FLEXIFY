"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ROLES } from "@/components/marketing/how-it-works/rolesData";
import { Ticker } from "@/components/marketing/how-it-works/Ticker";
import { RoleSection } from "@/components/marketing/how-it-works/RoleSection";
import { SideNav } from "@/components/marketing/how-it-works/SideNav";
import { CtaSection } from "@/components/marketing/how-it-works/CtaSection";

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const headerY = useTransform(scrollYProgress, [0, 0.2], [0, -40]);
  const headerOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const mid = window.innerHeight / 2;
      sectionRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= mid && rect.bottom >= mid) {
          setActive(i);
        }
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const role = ROLES[active] || ROLES[0];

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen text-[var(--text-primary)]"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <SideNav active={active} onChange={scrollTo} />

      <div className="max-w-6xl mx-auto px-5 md:px-8 pt-24 pb-32">
        {/* Header */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-4"
          >
            <div
              className="px-5 py-2 rounded-full text-sm font-bold backdrop-blur-sm"
              style={{
                backgroundColor: "var(--card-bg)",
                border: "2px solid var(--primary)",
                color: "var(--primary)",
              }}
            >
              — Platform Overview
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-3xl md:text-5xl font-bold mb-6 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            How{" "}
            <span
              className="relative inline-block font-extrabold"
              style={{ color: "var(--primary)" }}
            >
              Flexify
            </span>{" "}
            Works
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-lg max-w-xl mx-auto mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Three interfaces. One ecosystem. Built for users who train, coaches
            who guide, and admins who run it all.
          </motion.p>
        </motion.div>

        {/* Ticker */}
        <Ticker color={role.color} />

        {/* Role sections */}
        {ROLES.map((r, i) => (
          <div
            key={r.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
          >
            {i > 0 && (
              <div
                className="h-px w-full"
                style={{
                  background: `linear-gradient(to right, ${ROLES[i].color}50, transparent)`,
                }}
              />
            )}
            <RoleSection role={r} />
          </div>
        ))}

        {/* CTA */}
        <CtaSection role={role} />
      </div>
    </div>
  );
}
