"use client";

import { useEffect, useState } from "react";
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

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
  "Excuses don’t burn calories. Effort does.",
];

const Motivation = () => {
  const [index, setIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % defaultMotivations.length);
    }, 5555);

    return () => clearInterval(interval);
  }, []);

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
      className="relative min-h-111 bg-cover bg-center mt-12 md:mt-16"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1170&auto=format&fit=crop')",
      }}
    >
      {/* Dark + Blur Overlay */}
      <div className="absolute inset-0 bg-black/55 backdrop-blur-xs"></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 text-white my-10">
        <FaQuoteLeft className="text-5xl md:text-7xl opacity-25 absolute top-20 left-20" />
        <p className="text-2xl md:text-3xl font-semibold py-50 text-center">
          {displayText}
        </p>
        <FaQuoteRight className="text-5xl md:text-7xl opacity-25 absolute bottom-20 right-20" />
      </div>
    </section>
  );
};

export default Motivation;
