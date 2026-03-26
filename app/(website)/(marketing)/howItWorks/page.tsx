"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useState, useRef, useEffect } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────
const ROLES = [
  {
    id: "user",
    num: "01",
    title: "USER",
    subtitle: "Your Fitness Journey",
    verb: "TRAIN",
    description:
      "Train smarter. Track everything. Unlock AI coaching that adapts to you.",
    color: "#10B981",
    features: [
      {
        label: "Browse Packages",
        sub: "Explore your options",
        details: [
          "Free (unlocked) — No login required",
          "Free (locked) — Login needed",
          "Premium — Membership required",
        ],
      },
      {
        label: "Full Dashboard",
        sub: "Everything in one place",
        details: [
          "Update profile and settings",
          "View selected activities",
          "Nutrition & water tracker",
          "Progress metrics and analytics",
        ],
      },
      {
        label: "AI Suggestions",
        sub: "Personalized to you",
        details: [
          "AI-powered workout recommendations",
          "Adaptive plans based on progress",
          "Smart recovery insights",
        ],
      },
      {
        label: "Coach Connect",
        sub: "Real human support",
        details: [
          "Connect via CS Token",
          "Chat, calls & video consultations",
          "Dedicated coach tracking",
        ],
      },
      {
        label: "API Access",
        sub: "Developer-friendly",
        details: ["All workouts accessible via API", "Flexible integration"],
      },
    ],
    highlight: {
      icon: "⭐",
      title: "Premium Unlocks Everything",
      text: "Premium members get personalized AI coaching and direct access to certified trainers via CS Token — chat, calls, and video included.",
      stats: [
        { val: "3×", label: "Faster Progress" },
        { val: "AI", label: "Powered" },
        { val: "24/7", label: "Access" },
      ],
    },
  },
  {
    id: "coach",
    num: "02",
    title: "COACH",
    subtitle: "Deliver Elite Training",
    verb: "GUIDE",
    description:
      "Build your client base. Customize programs. Grow your coaching career.",
    color: "#f0a500",
    features: [
      {
        label: "Apply & Get Approved",
        sub: "Start your journey",
        details: [
          "Submit application form",
          "Reviewed and judged by admin",
          "Browse as user until approved",
        ],
      },
      {
        label: "Customize Packages",
        sub: "Shape the training",
        details: [
          "View all available packages",
          "Edit free packages freely",
          "Premium packages need 10yr+ exp",
          "Admin approval for premium edits",
        ],
      },
      {
        label: "Manage Clients",
        sub: "Stay connected",
        details: [
          "See your personalized users",
          "Chat options available",
          "Track user progression",
        ],
      },
      {
        label: "Earnings & Analytics",
        sub: "Grow your income",
        details: [
          "Monitor coaching earnings",
          "View detailed analytics",
          "Track progression metrics",
        ],
      },
      {
        label: "Build Your Profile",
        sub: "Stand out",
        details: [
          "Update coach profile",
          "Add certifications",
          "Showcase specialties",
        ],
      },
    ],
    highlight: {
      icon: "💪",
      title: "CS Token System",
      text: "Coaches connect with users via Coach Selection tokens. Once a user purchases premium membership, they pick their coach — unlocking chat, calls & video.",
      stats: [
        { val: "10+", label: "Yrs for Premium" },
        { val: "CS", label: "Token System" },
        { val: "∞", label: "Client Capacity" },
      ],
    },
  },
  {
    id: "admin",
    num: "03",
    title: "ADMIN",
    subtitle: "Full Platform Control",
    verb: "OWN",
    description:
      "Oversee everything. Manage coaches. Monitor revenue across the platform.",
    color: "#7c5cbf",
    features: [
      {
        label: "Manage Coaches",
        sub: "Build your team",
        details: [
          "Add coaches to platform",
          "Approve applications",
          "Manage coach profiles",
        ],
      },
      {
        label: "Package Control",
        sub: "Shape the catalog",
        details: [
          "Review all modifications",
          "Change any package settings",
          "Full edit authority",
        ],
      },
      {
        label: "User Oversight",
        sub: "Keep order",
        details: [
          "View all users & coach lists",
          "Full ban authority",
          "Monitor activity",
        ],
      },
      {
        label: "Revenue Tracking",
        sub: "Follow the money",
        details: [
          "Track overall earnings",
          "Monitor platform-wide revenue",
          "Growth analytics",
        ],
      },
      {
        label: "Payment History",
        sub: "Stay on top",
        details: ["Last 7 days of transactions", "Full payment records"],
      },
    ],
    highlight: {
      icon: "🖥️",
      title: "Platform Oversight",
      text: "When a user purchases membership, they receive a Coach Selection Token to connect with a specific coach. Admins oversee all token assignments via a dedicated coaches page.",
      stats: [
        { val: "100%", label: "Control" },
        { val: "7d", label: "Payment View" },
        { val: "∞", label: "Scalability" },
      ],
    },
  },
];

function Ticker({ color }: { color: string }) {
  const items = [
    "TRAIN",
    "EAT",
    "SLEEP",
    "REPEAT",
    "TRACK",
    "IMPROVE",
    "FLEXIFY",
  ];
  const repeated = [...items, ...items];

  return (
    <div
      className="overflow-hidden py-3 border-y"
      style={{ borderColor: `${color}30` }}
    >
      <style>{`
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .ticker-track {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: ticker-scroll 18s linear infinite;
        }
      `}</style>

      <div className="ticker-track">
        {[...repeated, ...repeated].map((item, i) => (
          <span
            key={i}
            className="text-[11px] font-black tracking-[0.3em] flex items-center gap-8 whitespace-nowrap"
            style={{ color: `${color}70` }}
          >
            {item}
            <span style={{ color }}>✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Feature Row ──────────────────────────────────────────────────────────────
function FeatureRow({
  feature,
  index,
  color,
}: {
  feature: { label: string; sub: string; details: string[] };
  index: number;
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left group"
        whileTap={{ scale: 0.995 }}
      >
        <motion.div
          className="flex items-center gap-4 py-4 px-3 rounded-xl transition-all duration-200"
          animate={{
            backgroundColor: open ? `${color}10` : "transparent",
          }}
          whileHover={{ backgroundColor: `${color}08` }}
          style={{
            borderBottom: `1px solid ${open ? `${color}20` : "var(--border-color)"}`,
          }}
        >
          {/* index */}
          <motion.span
            animate={{ color: open ? color : "var(--text-secondary)" }}
            className="text-xs font-black w-5 shrink-0 tabular-nums"
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>

          {/* dot */}
          <motion.div
            animate={{
              backgroundColor: open ? color : "var(--border-color)",
              scale: open ? 1.4 : 1,
            }}
            className="w-2 h-2 rounded-full shrink-0"
          />

          {/* label + sub */}
          <div className="flex-1 min-w-0">
            <motion.p
              animate={{
                color: open ? "var(--text-primary)" : "var(--text-primary)",
              }}
              className="font-black text-sm md:text-base tracking-tight leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {feature.label}
            </motion.p>
            <p
              className="text-xs mt-0.5 hidden sm:block"
              style={{ color: "var(--text-secondary)" }}
            >
              {feature.sub}
            </p>
          </div>

          {/* count badge */}
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 hidden sm:block"
            style={{
              backgroundColor: open ? `${color}20` : "var(--bg-primary)",
              color: open ? color : "var(--text-secondary)",
              border: `1px solid ${open ? `${color}40` : "var(--border-color)"}`,
              transition: "all 0.2s",
            }}
          >
            {feature.details.length} items
          </span>

          {/* chevron */}
          <motion.span
            animate={{
              rotate: open ? 180 : 0,
              color: open ? color : "var(--text-secondary)",
            }}
            className="text-xs shrink-0"
            transition={{ duration: 0.25 }}
          >
            ▾
          </motion.span>
        </motion.div>
      </motion.button>

      {/* Dropdown details */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div
              className="mx-3 mb-2 mt-1 rounded-xl p-3 grid grid-cols-1 gap-1.5"
              style={{
                backgroundColor: `${color}08`,
                border: `1px solid ${color}15`,
              }}
            >
              {feature.details.map((d, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-2.5 text-[15px] py-1"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span
                    className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ backgroundColor: color, opacity: 0.7 }}
                  />
                  {d}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Highlight Block ──────────────────────────────────────────────────────────
function HighlightBlock({
  highlight,
  color,
}: {
  highlight: (typeof ROLES)[0]["highlight"];
  color: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="mt-10 rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${color}30` }}
    >
      {/* ── Header (always visible, clickable) ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 transition-all"
        style={{ backgroundColor: `${color}40` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{highlight.icon}</span>
          <p className="font-black text-sm tracking-tight" style={{ color }}>
            {highlight.title}
          </p>
        </div>

        {/* Arrow */}
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="text-xs font-black shrink-0"
          style={{ color }}
        >
          ▾
        </motion.span>
      </button>

      {/* ── Expandable body ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-5" style={{ backgroundColor: `${color}06` }}>
              {/* insight text */}
              <p
                className="text-sm leading-relaxed mb-5"
                style={{ color: "var(--text-primary)" }}
              >
                {highlight.text}
              </p>

              {/* stats row */}
              <div className="grid grid-cols-3 gap-3">
                {highlight.stats.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className="text-center py-3 rounded-xl"
                    style={{
                      backgroundColor: `${color}12`,
                      border: `1px solid ${color}20`,
                    }}
                  >
                    <p
                      className="font-black text-lg md:text-xl leading-none"
                      style={{ color }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[10px] font-semibold mt-1 uppercase tracking-wider"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Role Section ─────────────────────────────────────────────────────────────
function RoleSection({ role }: { role: (typeof ROLES)[0] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const verbY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const numY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div ref={sectionRef} className="relative py-12 md:py-20">
      {/* ── Parallax verb watermark ── */}
      <motion.div
        style={{ y: verbY }}
        className="absolute inset-0 flex items-center justify-end pointer-events-none overflow-hidden"
      >
        <span
          className="font-black select-none leading-none pr-2 md:pr-6"
          style={{
            fontSize: "clamp(60px, 14vw, 160px)",
            color: role.color,
            opacity: 0.06,
            letterSpacing: "-0.04em",
          }}
        >
          {role.verb}
        </span>
      </motion.div>

      {/* ── Grid: left identity + right features ── */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-8 md:gap-16 items-start">
        {/* Left */}
        <div className="md:sticky md:top-24">
          {/* Giant number */}
          <motion.div
            style={{ y: numY }}
            className="font-black leading-none mb-1 select-none"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            css-color={role.color}
          >
            <span
              style={{
                color: role.color,
                fontSize: "clamp(56px, 10vw, 110px)",
                letterSpacing: "-0.04em",
                display: "block",
              }}
            >
              {role.num}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tighter leading-none mb-3"
            style={{
              fontSize: "clamp(36px, 7vw, 68px)",
              color: "var(--text-primary)",
            }}
          >
            {role.title}
          </motion.h2>

          {/* Subtitle pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-black tracking-widest mb-4"
            style={{
              backgroundColor: `${role.color}18`,
              color: role.color,
              border: `1px solid ${role.color}35`,
            }}
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: role.color }}
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            {role.subtitle.toUpperCase()}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.12 }}
            className="text-sm leading-relaxed mb-5 max-w-xs"
            style={{ color: "var(--text-secondary)" }}
          >
            {role.description}
          </motion.p>

          {/* Accent line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{
              delay: 0.18,
              duration: 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="h-[3px] w-14 rounded-full origin-left"
            style={{ backgroundColor: role.color }}
          />

          {/* Highlight block — desktop only here */}
          <div className="hidden md:block">
            <HighlightBlock highlight={role.highlight} color={role.color} />
          </div>
        </div>

        {/* Right: features */}
        <div>
          <p
            className="text-[10px] font-black uppercase tracking-[0.25em] mb-3 px-3"
            style={{ color: role.color }}
          >
            What you get
          </p>
          <div>
            {role.features.map((f, i) => (
              <FeatureRow
                key={f.label}
                feature={f}
                index={i}
                color={role.color}
              />
            ))}
          </div>

          {/* Highlight block — mobile only here */}
          <div className="md:hidden mt-2">
            <HighlightBlock highlight={role.highlight} color={role.color} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sticky Side Nav ─────────────────────────────────────────────────────────
function SideNav({
  active,
  onChange,
}: {
  active: number;
  onChange: (i: number) => void;
}) {
  return (
    <div className="hidden xl:flex fixed left-5 top-1/2 -translate-y-1/2 z-50 flex-col gap-5">
      {ROLES.map((r, i) => (
        <button
          key={r.id}
          onClick={() => onChange(i)}
          className="flex items-center gap-2.5 group"
        >
          <motion.div
            animate={{
              width: active === i ? 24 : 10,
              backgroundColor: active === i ? r.color : "var(--border-color)",
            }}
            className="h-[2px] rounded-full"
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={{
              opacity: active === i ? 1 : 0,
              x: active === i ? 0 : -4,
            }}
            className="text-[10px] font-black tracking-widest"
            style={{ color: r.color }}
          >
            {r.num}
          </motion.span>
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  const [activeRole, setActiveRole] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = ROLES.map((_, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveRole(i);
        },
        { threshold: 0.35 },
      );
      if (sectionRefs.current[i]) obs.observe(sectionRefs.current[i]!);
      return obs;
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const scrollToRole = (i: number) => {
    sectionRefs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const role = ROLES[activeRole];
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

   const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: "var(--bg-primary)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <title>How it works - Flexify</title>
      
      <SideNav active={activeRole} onChange={scrollToRole} />

      <div className="max-w-7xl mx-auto px-6 mt-8 md:mt-12 mb-10">
        {/* ── HERO ── */}
        <motion.div ref={ref} style={{ y, opacity }} className="text-center">
          {/* Floating badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-block mb-6"
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
            className="text-lg max-w-3xl mx-auto mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            Three interfaces. One ecosystem. Built for users who train, coaches
            who guide, and admins who run it all.
          </motion.p>
        </motion.div>

        {/* ── TICKER ── */}
        <Ticker color={role.color} />

        {/* ── ROLE SECTIONS ── */}
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

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="py-12 md:py-16 text-center relative rounded-xl overflow-hidden shadow-xl"
          style={{
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          {/* faded BG word */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
            style={{
              fontSize: "clamp(70px, 18vw, 200px)",
              fontWeight: 900,
              color: role.color,
              opacity: 0.08,
              letterSpacing: "-0.05em",
              lineHeight: 1,
            }}
          >
            START
          </div>

          <p
            className="text-[11px] font-black uppercase tracking-[0.3em] mb-3 relative z-10"
            style={{ color: role.color }}
          >
            — Get Moving
          </p>

          <h3
            className="font-black tracking-tighter leading-none mb-4 relative z-10"
            style={{
              fontSize: "clamp(30px, 6vw, 72px)",
              color: "var(--text-primary)",
            }}
          >
            Ready to
            <br />
            <span style={{ color: role.color }}>Get Started?</span>
          </h3>

          <p
            className="text-sm md:text-base max-w-sm mx-auto mb-8 relative z-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Join thousands achieving their goals with AI-powered
            personalization.
          </p>

          <motion.button
            className="relative z-10 inline-flex items-center gap-3 px-7 py-4 font-black text-sm md:text-base text-white rounded-2xl"
            style={{
              backgroundColor: role.color,
              boxShadow: `0 10px 36px ${role.color}40`,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: `0 16px 48px ${role.color}55`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            Start Your Journey
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.3 }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
