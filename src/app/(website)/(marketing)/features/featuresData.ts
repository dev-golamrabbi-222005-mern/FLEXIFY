export interface FeatureItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  benefits: string[];
  color: string;
}

export const FEATURES: FeatureItem[] = [
  {
    id: 1,
    icon: "🤖",
    title: "AI-Powered Coaching",
    description:
      "Get personalized workout suggestions that adapt to your progress, recovery, and goals in real-time.",
    benefits: [
      "Smart workout generation based on your fitness level",
      "Adaptive rest day recommendations",
      "Form correction with computer vision",
      "Plateau detection and auto-adjustment",
    ],
    color: "#F97316",
  },
  {
    id: 2,
    icon: "📊",
    title: "Advanced Analytics",
    description:
      "Track every metric that matters with comprehensive dashboards and beautiful visualizations.",
    benefits: [
      "Visual progress charts and trends",
      "Body composition tracking",
      "Performance predictions",
      "Exportable reports",
    ],
    color: "#10B981",
  },
  {
    id: 3,
    icon: "🍎",
    title: "Smart Nutrition Tracking",
    description:
      "Snap photos of your meals and let AI handle the calorie counting and macro breakdown.",
    benefits: [
      "Photo-based meal logging",
      "Automatic calorie estimation",
      "Macro and micronutrient analysis",
      "Recipe suggestions based on goals",
    ],
    color: "#FB923C",
  },
  {
    id: 4,
    icon: "💬",
    title: "Expert Coach Connection",
    description:
      "Connect with certified trainers for personalized guidance through chat, calls, and video sessions.",
    benefits: [
      "Direct messaging with your coach",
      "Video call consultations",
      "Custom workout plan reviews",
      "Real-time form feedback",
    ],
    color: "#F97316",
  },
  {
    id: 5,
    icon: "📱",
    title: "Mobile-First Experience",
    description:
      "Access your workouts anywhere with our seamless mobile experience and offline mode.",
    benefits: [
      "Offline workout access",
      "Voice-guided exercises",
      "Apple Watch & Wear OS support",
      "Automatic workout logging",
    ],
    color: "#10B981",
  },
  {
    id: 6,
    icon: "🎯",
    title: "Goal-Oriented Programs",
    description:
      "Choose from science-backed programs designed for specific goals like weight loss, muscle gain, or endurance.",
    benefits: [
      "Pre-built proven programs",
      "Periodization and progressive overload",
      "Milestone tracking and celebrations",
      "Community challenges",
    ],
    color: "#FB923C",
  },
];
