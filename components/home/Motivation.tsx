"use client";

import { useEffect, useState } from "react";
import SectionTitle from "@/app/Components/ui/section-title";

const defaultMotivations = [
   "Hard work beats talent when talent doesn’t work hard.",
  "Dream big. Start small. Stay consistent.",
  "Your only competition is who you were yesterday.",
  "Strength grows in the moments you think you can’t go on but you keep going.",
  "Pain is temporary. Pride is forever.",
  "Focus on progress, not perfection.",
  "The difference between try and triumph is a little extra effort.",
  "Discipline is choosing what you want most over what you want now.",
  "Every workout is a step closer to your best self.",
  "Excuses don’t burn calories. Effort does."
];

const Motivation = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  // Auto Change
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % defaultMotivations.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Typewriter Effect
  useEffect(() => {
    let i = 0;
    const currentText = defaultMotivations[index];
    setDisplayText("");

    const typing = setInterval(() => {
      setDisplayText(currentText.slice(0, i + 1));
      i++;
      if (i === currentText.length) clearInterval(typing);
    }, 30);

    return () => clearInterval(typing);
  }, [index]);

  return (
    <section
      className="relative pt-4 pb-16 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1170&auto=format&fit=crop')",
      }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative max-w-7xl mx-auto px-4 text-center text-white">
        <SectionTitle
          title="Daily Motivation"
          subtitle="Fuel your mindset. Elevate your discipline. Transform daily."
        />

        <div className="max-w-4xl mx-auto">
          <div
            className="group bg-white/10 backdrop-blur-lg border border-white/20
                       rounded-2xl p-10 text-center relative
                       transition-all duration-300
                       hover:-translate-y-2
                       hover:shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
          >
            <p className="text-xl md:text-2xl font-semibold min-h-[80px]">
              “{displayText}”
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Motivation;