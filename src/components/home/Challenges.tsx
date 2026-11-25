"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { HOME_CHALLENGES } from "./challengesData";

export default function Challenges() {
  const router = useRouter();

  return (
    <section className="py-12 transition-colors md:py-16 lg:py-20 duration-400">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-center md:text-4xl text-[var(--text-primary)]">
            <span>7x4</span> <span className="uppercase">Home Challenges</span>
          </h1>
          <span className="h-1 w-14 rounded-full bg-[var(--primary)] mx-auto" />
        </div>
        <div className="grid grid-cols-1 gap-6 mt-12 lg:grid-cols-2">
          {HOME_CHALLENGES.map((c, i) => (
            <div
              key={i}
              onClick={() => router.push(`/dashboard/challenges/${c.id}`)}
              className="relative overflow-hidden cursor-pointer group rounded-3xl"
              style={{ minHeight: 420 }}
            >
              <div className="absolute inset-0">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%)`,
                }}
              />

              <div
                className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, rgba(${c.accentRgb},0.25) 0%, transparent 60%)`,
                }}
              />

              <div
                className="absolute top-0 bottom-0 w-2 origin-top skew-x-6 -left-8 opacity-80"
                style={{ background: c.accent }}
              />

              <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-10">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]"
                    style={{
                      background: `rgba(${c.accentRgb}, 0.2)`,
                      border: `1px solid rgba(${c.accentRgb}, 0.5)`,
                      color: c.accent,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full animate-pulse"
                      style={{ background: c.accent }}
                    />
                    {c.tag}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {c.stats.map((s) => (
                      <div
                        key={s.label}
                        className="px-3 py-2 text-center rounded-xl backdrop-blur-sm"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <p
                          className="text-sm font-black leading-none"
                          style={{ color: c.accent }}
                        >
                          {s.val}
                        </p>
                        <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5 text-white/50">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="mb-4">
                    <p
                      className="font-black leading-none tracking-tighter"
                      style={{
                        fontSize: "clamp(36px, 6vw, 58px)",
                        color: "#fff",
                        textShadow: "0 2px 20px rgba(0,0,0,0.5)",
                      }}
                    >
                      {c.title}
                    </p>
                    <p
                      className="font-black leading-none tracking-tighter"
                      style={{
                        fontSize: "clamp(24px, 4vw, 36px)",
                        color: c.accent,
                        textShadow: `0 0 40px rgba(${c.accentRgb},0.6)`,
                      }}
                    >
                      {c.subtitle}
                    </p>
                  </div>

                  <p className="text-sm leading-relaxed mb-6 max-w-md text-white/70">
                    {c.desc}
                  </p>

                  <button
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:gap-3 cursor-pointer"
                    style={{
                      background: c.accent,
                      color: "#fff",
                      boxShadow: `0 4px 20px rgba(${c.accentRgb}, 0.4)`,
                    }}
                  >
                    Start 28-Day Challenge →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
