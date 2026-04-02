"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaQuoteLeft } from "react-icons/fa";

const defaultMotivations = [
  "Hard work beats talent when talent doesn't work hard.",
  "Dream big. Start small. Stay consistent.",
  "Your only competition is who you were yesterday.",
  "Strength grows in the moments you think you can't go on but you keep going.",
  "Pain is temporary. Pride is forever.",
  "Focus on progress, not perfection.",
  "The difference between try and triumph is a little extra effort.",
  "Discipline is choosing what you want most over what you want now.",
  "Every workout is a step closer to your best self.",
  "Excuses don't burn calories. Effort does.",
];

const STATS = [
  { val: "800+", label: "Free Exercises" },
  { val: "0₺", label: "No Credit Card" },
  { val: "∞", label: "Workouts" },
];

const Motivation = () => {
  const router = useRouter();
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
      className="relative mt-8 md:mt-12 lg:mt-16 overflow-hidden"
      style={{ minHeight: 420 }}
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1170&auto=format&fit=crop')",
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65 backdrop-blur-[2px]" />

      {/* Vertical divider line (desktop only) */}
      <div
        className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px opacity-20"
        style={{
          background:
            "linear-gradient(to bottom, transparent, #fff 30%, #fff 70%, transparent)",
        }}
      />

      {/* Content grid */}
      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* ── LEFT: Motivation quote ── */}
        <div className="flex flex-col justify-center py-16 md:pr-14">
          <FaQuoteLeft className="text-4xl mb-6 opacity-30 text-white" />
          <p
            className="text-xl md:text-2xl lg:text-3xl font-semibold text-white leading-snug min-h-[5rem]"
            style={{ fontFamily: "'Sora', sans-serif" }}
          >
            {displayText}
            <span className="inline-block w-0.5 h-6 bg-white/70 ml-1 align-middle animate-pulse" />
          </p>

          {/* Dot indicators */}
          <div className="flex gap-1.5 mt-8">
            {defaultMotivations.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === index ? 20 : 6,
                  height: 6,
                  background:
                    i === index ? "var(--primary)" : "rgba(255,255,255,0.3)",
                }}
              />
            ))}
          </div>
        </div>

        {/* ── RIGHT: Marketing ── */}
        <div className="flex flex-col justify-center py-16 md:pl-14">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-5"
            style={{
              background: "rgba(244,121,32,0.15)",
              border: "1px solid rgba(244,121,32,0.4)",
              color: "var(--primary)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: "var(--primary)" }}
            />
            100% Free — No signup needed
          </div>

          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight mb-3 tracking-tight">
            Turn motivation
            <br />
            into <span style={{ color: "var(--primary)" }}>real results.</span>
          </h2>

          <p className="text-white/60 text-sm leading-relaxed mb-7 max-w-xs">
            Browse 800+ expert-curated exercises — filter by muscle, level, and
            equipment. Free forever. No credit card.
          </p>

          {/* Stats row */}
          <div className="flex gap-5 mb-8">
            {STATS.map((s) => (
              <div key={s.label}>
                <p
                  className="font-black text-xl leading-none"
                  style={{
                    color: "var(--primary)",
                  }}
                >
                  {s.val}
                </p>
                <p className="text-[10px] text-white/45 font-bold uppercase tracking-wider mt-0.5">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* CTA button */}
          <button
            onClick={() => router.push("/exercises")}
            className="group self-start flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-sm text-white transition-all duration-200 hover:scale-[1.03] active:scale-[0.97]"
            style={{
              background: "var(--primary)",
              boxShadow: "0 8px 28px rgba(244,121,32,0.45)",
            }}
          >
            Explore Free Library
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Motivation;
