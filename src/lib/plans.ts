// lib/plans.ts
// Single source of truth for plan definitions, features, and pricing.

export type PlanId = "free" | "pro" | "elite";

export interface PlanFeatures {
  bmiTool: boolean;
  workoutLibrary: "limited" | "full";
  aiWorkoutPlan: boolean;
  planCustomization: boolean;
  nutritionSuggestions: boolean;
  advancedAnalytics: boolean;
  personalCoach: boolean;
  coachMessaging: boolean;
  customPlanByCoach: boolean;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: number;          // USD monthly
  priceLocal: number;     // BDT (for SSLCommerz)
  currency: string;
  durationDays: number;
  features: PlanFeatures;
}

export const PLANS: Record<PlanId, Plan> = {
  free: {
    id: "free",
    name: "Free",
    price: 0,
    priceLocal: 0,
    currency: "BDT",
    durationDays: 36500, // effectively forever
    features: {
      bmiTool: true,
      workoutLibrary: "limited",
      aiWorkoutPlan: false,
      planCustomization: false,
      nutritionSuggestions: false,
      advancedAnalytics: false,
      personalCoach: false,
      coachMessaging: false,
      customPlanByCoach: false,
    },
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: 12,
    priceLocal: 1350,   // ~12 USD in BDT
    currency: "BDT",
    durationDays: 30,
    features: {
      bmiTool: true,
      workoutLibrary: "full",
      aiWorkoutPlan: true,
      planCustomization: true,
      nutritionSuggestions: true,
      advancedAnalytics: true,
      personalCoach: false,
      coachMessaging: false,
      customPlanByCoach: false,
    },
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: 29,
    priceLocal: 3200,   // ~29 USD in BDT
    currency: "BDT",
    durationDays: 30,
    features: {
      bmiTool: true,
      workoutLibrary: "full",
      aiWorkoutPlan: true,
      planCustomization: true,
      nutritionSuggestions: true,
      advancedAnalytics: true,
      personalCoach: true,
      coachMessaging: true,
      customPlanByCoach: true,
    },
  },
};

// Helper — get plan by id safely
export function getPlan(id: string): Plan {
  return PLANS[id as PlanId] ?? PLANS.free;
}

// Helper — compute expiry date from now
export function computeExpiry(durationDays: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + durationDays);
  return d;
}
