"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { FeatureItem } from "./featuresData";

interface FeatureCardProps {
  feature: FeatureItem;
  index: number;
}

export function FeatureCard({ feature, index }: FeatureCardProps) {
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
      className={`grid md:grid-cols-2 gap-8 items-center my-24 md:my-48 lg:my-52 ${
        isEven ? "" : "md:grid-flow-dense"
      }`}
    >
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
        <motion.div
          className="absolute inset-0 rounded-full blur-3xl opacity-20"
          style={{ backgroundColor: feature.color }}
          animate={{
            scale: isHovered ? 1.3 : 1,
            opacity: isHovered ? 0.3 : 0.2,
          }}
          transition={{ duration: 0.4 }}
        />

        <div
          className="relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center border-4 backdrop-blur-sm"
          style={{
            backgroundColor: "var(--card-bg)",
            borderColor: feature.color,
          }}
        >
          <motion.div
            className="text-7xl md:text-8xl"
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {feature.icon}
          </motion.div>
        </div>
      </motion.div>

      <div className={isEven ? "md:order-2" : "md:order-1"}>
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-4"
          style={{
            backgroundColor: `${feature.color}15`,
            color: feature.color,
          }}
        >
          Feature {feature.id}
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-[var(--text-primary)]">
          {feature.title}
        </h2>
        <p className="text-lg text-[var(--text-secondary)] mb-6 leading-relaxed">
          {feature.description}
        </p>

        <ul className="space-y-3">
          {feature.benefits.map((benefit, bIndex) => (
            <motion.li
              key={bIndex}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * bIndex }}
              className="flex items-center gap-3 text-[var(--text-primary)]"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <Check className="w-3 h-3" style={{ color: feature.color }} />
              </div>
              <span>{benefit}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
