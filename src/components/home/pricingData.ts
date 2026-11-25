export interface PlanFeature {
  label: string;
  val: boolean | string;
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  desc: string;
  cta: string;
  ctaStyle: string;
  featured: boolean;
  features: PlanFeature[];
}

export const ELITE_BASE_PRICE = 9.99;
export const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, elite: 2 };

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    desc: "Start your fitness journey at zero cost.",
    cta: "Get Started Free",
    ctaStyle: "border",
    featured: false,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Limited" },
      { label: "Dashboard Access", val: "Limited" },
      { label: "AI Workout Plan", val: false },
      { label: "Plan Customization", val: false },
      { label: "Nutrition Suggestions", val: false },
      { label: "Advanced Analytics", val: false },
      { label: "Personal Coach", val: false },
      { label: "Coach Messaging", val: false },
      { label: "Custom Plan by Coach", val: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "3.99",
    desc: "AI-powered tools for serious training.",
    cta: "Start Pro",
    ctaStyle: "filled",
    featured: true,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Full" },
      { label: "Dashboard Access", val: "Full" },
      { label: "AI Workout Plan", val: true },
      { label: "Plan Customization", val: true },
      { label: "Nutrition Suggestions", val: true },
      { label: "Advanced Analytics", val: true },
      { label: "Personal Coach", val: false },
      { label: "Coach Messaging", val: false },
      { label: "Custom Plan by Coach", val: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: `${ELITE_BASE_PRICE}+`,
    desc: "Everything Pro & your own personal coach.",
    cta: "Go Elite",
    ctaStyle: "border-primary",
    featured: false,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Full" },
      { label: "Dashboard Access", val: "Full" },
      { label: "AI Workout Plan", val: true },
      { label: "Plan Customization", val: true },
      { label: "Nutrition Suggestions", val: true },
      { label: "Advanced Analytics", val: true },
      { label: "Personal Coach", val: true },
      { label: "Coach Messaging", val: true },
      { label: "Custom Plan by Coach", val: true },
    ],
  },
];
