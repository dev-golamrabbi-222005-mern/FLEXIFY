import { RoleData } from "./types";

export const userRole: RoleData = {
  id: "user",
  num: "01",
  title: "USER",
  subtitle: "Your Fitness Journey",
  verb: "TRAIN",
  description: "Train smarter. Track everything. Unlock AI coaching that adapts to you.",
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
};
