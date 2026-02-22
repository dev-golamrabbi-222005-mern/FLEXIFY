"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// Data Structure
const ROLES = [
  {
    id: "user",
    title: "User Workflow",
    icon: "🏃",
    description: "Your personalized fitness journey",
    features: [
      {
        title: "Browse Packages",
        details: [
          "Free (unlocked) - No login required",
          "Free (locked) - Login needed",
          "Premium - Membership required",
        ],
      },
      {
        title: "Dashboard Access",
        details: [
          "Update profile and settings",
          "View selected activities",
          "Nutrition tracker",
          "Water intake monitoring",
          "Progress metrics and analytics",
        ],
      },
      {
        title: "Free Package Features",
        details: ["Access selected package activities page only"],
      },
      {
        title: "Locked Package Features",
        details: [
          "Full dashboard access and functionality",
          "Nutrition tracker not included",
        ],
      },
      {
        title: "Premium Membership Benefits",
        details: [
          "AI-powered personalized suggestions",
          "Complete dashboard access",
          "Coach connection via CS token",
          "Chat, calls & video consultations",
        ],
      },
      {
        title: "API Integration",
        details: ["All workouts accessible via API for flexibility"],
      },
    ],
    highlight:
      "Premium members get personalized AI coaching and direct access to certified trainers.",
  },
  {
    id: "coach",
    title: "Coach / Trainer Interface",
    icon: "💪",
    description: "Tools to deliver personalized training experiences",
    features: [
      {
        title: "Application Process",
        details: [
          "Fill out a form judged by admin",
          "Until approved, you visit as a user",
        ],
      },
      {
        title: "Package Customization",
        details: [
          "View all packages",
          "Customize workouts for free packages",
          "Premium packages locked until approved",
        ],
      },
      {
        title: "Premium Control (10yr+ exp)",
        details: [
          "Experienced coaches can modify premium workouts",
          "Requires admin approval",
        ],
      },
      {
        title: "Personalized Dashboard",
        details: [
          "See personalized users",
          "Chat options available",
          "Track user progression",
        ],
      },
      {
        title: "Earnings Review",
        details: ["Monitor coaching earnings", "View progression analytics"],
      },
      {
        title: "Profile Management",
        details: ["Update coach profile", "Add certifications and specialties"],
      },
    ],
    highlight:
      "Coaches connect with users via CS tokens. Premium features include chat, calls, and video consultations.",
  },
  {
    id: "admin",
    title: "Admin Interface",
    icon: "🖥️",
    description: "Complete platform control and oversight",
    features: [
      {
        title: "Coach Management",
        details: ["Add coaches to the platform", "Manage coach profiles"],
      },
      {
        title: "Package Control",
        details: ["Check modifications", "Change any package settings"],
      },
      {
        title: "User Oversight",
        details: ["View all users and coach lists", "Full ban authority"],
      },
      {
        title: "Revenue Monitoring",
        details: ["Track overall earnings", "Monitor revenue across platform"],
      },
      {
        title: "Profile Updates",
        details: ["Update admin profile", "Manage settings"],
      },
      {
        title: "Payment Tracking",
        details: ["Check last 7 days of payment transactions"],
      },
    ],
    highlight:
      "When a user purchases a membership, they receive a Coach Selection (CS) Token to connect with a specific coach. There's a dedicated coaches page for discovery.",
  },
];

// Animated Feature Card
function FeatureCard({
  feature,
  index,
}: {
  feature: { title: string; details: string[] };
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
      className="group relative p-5 rounded-2xl transition-all duration-300"
      style={{
        backgroundColor: "var(--card-bg)",
        border: "1px solid var(--border-color)",
      }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Accent corner */}
      <div
        className="absolute top-0 left-0 w-12 h-12 rounded-tl-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-300"
        style={{ backgroundColor: "var(--primary)" }}
      />

      <h4
        className="font-bold text-base mb-3 relative z-10"
        style={{ color: "var(--text-primary)" }}
      >
        {feature.title}
      </h4>

      <ul className="space-y-1.5 relative z-10">
        {feature.details.map((detail, i) => (
          <li
            key={i}
            className="text-sm leading-relaxed flex gap-2 items-start"
            style={{ color: "var(--text-secondary)" }}
          >
            <span
              className="mt-1.5 flex-shrink-0"
              style={{ color: "var(--primary)", fontSize: "0.5rem" }}
            >
              ●
            </span>
            <span>{detail}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

// Role Section
function RoleSection({
  role,
  index,
}: {
  role: (typeof ROLES)[0];
  index: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
      className="mb-12 md:mb-16"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <motion.div
          className="text-5xl flex-shrink-0"
          initial={{ scale: 0, rotate: -180 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: index * 0.15 + 0.2,
            type: "spring",
            stiffness: 200,
          }}
        >
          {role.icon}
        </motion.div>
        <div>
          <h2
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {role.title}
          </h2>
          <p className="text-lg" style={{ color: "var(--text-secondary)" }}>
            {role.description}
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
        {role.features.map((feature, i) => (
          <FeatureCard key={i} feature={feature} index={i} />
        ))}
      </div>

      {/* Highlight callout */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.15 + 0.4, duration: 0.5 }}
        className="p-6 rounded-2xl relative overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          border: "2px solid var(--primary)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: "var(--primary)" }}
        />
        <p
          className="text-sm md:text-base font-medium leading-relaxed relative z-10"
          style={{ color: "var(--text-primary)" }}
        >
          💡 <span className="font-bold">Key Insight:</span> {role.highlight}
        </p>
      </motion.div>
    </motion.section>
  );
}

// Main Page
export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const filteredRoles =
    activeTab === "all" ? ROLES : ROLES.filter((r) => r.id === activeTab);

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--bg-primary)" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Header */}
        <motion.div
          className="text-center my-8 md:mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1
            className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            How <span style={{ color: "var(--primary)" }}>Flexify</span> Works
          </h1>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: "var(--text-secondary)" }}
          >
            Three powerful interfaces working together to deliver personalized
            fitness experiences at scale.
          </p>
        </motion.div>

        {/* Tab Filters */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-8 md:mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {[
            { id: "all", label: "All Roles" },
            { id: "admin", label: "Admin" },
            { id: "coach", label: "Coach" },
            { id: "user", label: "User" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              style={{
                backgroundColor:
                  activeTab === tab.id ? "var(--primary)" : "var(--card-bg)",
                color: activeTab === tab.id ? "#fff" : "var(--text-primary)",
                border:
                  activeTab === tab.id
                    ? "2px solid var(--primary)"
                    : "2px solid var(--border-color)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Role Sections */}
        <div>
          {filteredRoles.map((role, index) => (
            <RoleSection key={role.id} role={role} index={index} />
          ))}
        </div>

        {/* CTA Footer */}
        <motion.div
          className="text-center my-12 md:my-20 p-10 rounded-3xl relative overflow-hidden"
          style={{
            backgroundColor: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Decorative gradient orbs */}
          <div
            className="absolute -top-10 -left-10 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--primary)" }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-20"
            style={{ backgroundColor: "var(--success)" }}
          />

          <h3
            className="text-3xl font-bold mb-4 relative z-10"
            style={{ color: "var(--text-primary)" }}
          >
            Ready to Get Started?
          </h3>
          <p
            className="text-lg mb-6 max-w-xl mx-auto relative z-10"
            style={{ color: "var(--text-secondary)" }}
          >
            Join thousands of users achieving their fitness goals with
            AI-powered personalization and expert coaching.
          </p>
          <motion.button
            className="btn-primary relative z-10 text-lg font-bold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
          >
            Start Your Journey →
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
