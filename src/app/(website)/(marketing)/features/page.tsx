"use client";

import React from "react";
import { FEATURES } from "./featuresData";
import { FeatureCard } from "./FeatureCard";
import { HeroSection } from "./HeroSection";
import { FeaturesCtaSection } from "./FeaturesCtaSection";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen overflow-hidden">
      <title>Features - Flexify</title>
      <div className="mx-auto my-10 md:my-12 lg:my-16 max-w-7xl px-4 md:px-6">
        <HeroSection />

        <div>
          {FEATURES.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>

        <FeaturesCtaSection />
      </div>
    </div>
  );
}
