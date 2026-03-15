"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import body01 from "../../public/upper-body.png";
import body02 from "../../public/lower-body.png";
import SectionTitle from "@/app/(website)/components/ui/section-title";

const CHALLENGES = [
  {
    id: "upper-body",
    tag: "Full Body",
    title: "FULL BODY",
    subtitle: "7×4 CHALLENGE",
    desc: "Target every muscle group. Burn fat. Build strength. 28 days to a completely transformed physique.",
    stats: [
      { val: "28", label: "Days" },
      { val: "7", label: "Workouts/wk" },
      { val: "500+", label: "Kcal/day" },
    ],
    image: body01,
    alt: "Full Body Challenge",
    accent: "var(--primary)",
    accentRgb: "244,121,32",
  },
  {
    id: "lower-body",
    tag: "Lower Body",
    title: "LOWER BODY",
    subtitle: "7×4 CHALLENGE",
    desc: "Sculpt powerful legs, glutes, and calves. Dominate your lower half in 4 intense weeks.",
    stats: [
      { val: "28", label: "Days" },
      { val: "7", label: "Workouts/wk" },
      { val: "400+", label: "Kcal/day" },
    ],
    image: body02,
    alt: "Lower Body Challenge",
    accent: "#e63946",
    accentRgb: "230,57,70",
  },
];

const Challenges = () => {
  const router = useRouter();
  return (
    <section className="pb-8 md:pb-12 bg-[var(--bg-primary)] transition-colors duration-400">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col gap-3 mt-8 md:mt-12 lg:mt-16 mb-10">
          <h1 className="text-3xl text-center font-bold tracking-tight md:text-4xl">
            <span>7x4</span> <span className="uppercase">Home Challenges</span>
          </h1>
          <span className="h-1 w-14 rounded-full bg-(--primary) mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-12">
          {CHALLENGES.map((c, i) => (
            <div
              key={i}
              className="group relative rounded-3xl overflow-hidden cursor-pointer"
              style={{ minHeight: 420 }}
            >
              {/* Background image */}
              <div className="absolute inset-0">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Dark gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 50%, rgba(0,0,0,0.3) 100%)`,
                }}
              />

              {/* Accent color wash on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(135deg, rgba(${c.accentRgb},0.25) 0%, transparent 60%)`,
                }}
              />

              {/* Diagonal accent stripe */}
              <div
                className="absolute -left-8 top-0 bottom-0 w-2 skew-x-6 origin-top opacity-80"
                style={{ background: c.accent }}
              />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between p-8 md:p-10">
                {/* Top: tag + stats */}
                <div className="flex items-start justify-between">
                  {/* Tag */}
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

                  {/* Stat pills */}
                  <div className="flex gap-2">
                    {c.stats.map((s) => (
                      <div
                        key={s.label}
                        className="text-center px-3 py-2 rounded-xl backdrop-blur-sm"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        <p
                          className="font-black text-sm leading-none"
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

                {/* Bottom: title + desc + CTA */}
                <div>
                  {/* Big title */}
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

                  <p
                    className="text-sm leading-relaxed mb-6 max-w-xs"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                  >
                    {c.desc}
                  </p>

                  {/* CTA */}
                  <button
                    onClick={() => router.push(`/dashboard/challenges/${c.id}`)}
                    className="group/btn relative flex items-center gap-3 px-7 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider text-white overflow-hidden transition-all duration-300 hover:scale-[1.03] active:scale-[0.97]"
                    style={{
                      background: c.accent,
                      boxShadow: `0 8px 32px rgba(${c.accentRgb}, 0.5)`,
                    }}
                  >
                    <span className="relative z-10">Start Challenge</span>
                    <span className="relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>

              {/* Bottom glow line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `linear-gradient(to right, transparent, ${c.accent}, transparent)`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Challenges;
