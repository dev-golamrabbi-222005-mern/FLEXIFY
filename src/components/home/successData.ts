export type BadgeType = "weight" | "muscle" | "pr";

export const badgeColor: Record<BadgeType, string> = {
  weight: "var(--primary)",
  muscle: "var(--secondary)",
  pr: "var(--success)",
};

export interface SuccessStoryItem {
  id: number;
  name: string;
  badge: string;
  badgeType: BadgeType;
  quote: string;
  image: string;
  alt: string;
}

export const SUCCESS_DATA: SuccessStoryItem[] = [
  {
    id: 1,
    name: "James T.",
    badge: "-15lbs",
    badgeType: "weight",
    quote:
      "The logic-based approach removed the guesswork. I finally hit my goal weight in 2 months.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80",
    alt: "Muscular fit man showing physique transformation",
  },
  {
    id: 2,
    name: "Sarah L.",
    badge: "PR Achieved",
    badgeType: "pr",
    quote:
      "Precision programming that actually understands recovery. My best marathon time yet — 3:42!",
    image:
      "https://plus.unsplash.com/premium_photo-1663089951282-53b47c38e7a0?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Woman runner crossing marathon finish line triumphant",
  },
  {
    id: 3,
    name: "Marcus W.",
    badge: "+22lbs Muscle",
    badgeType: "muscle",
    quote:
      "Flexify's AI caught overtraining patterns I never noticed. Gained more in 4 months than the previous year.",
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80",
    alt: "Athletic man doing heavy barbell squats in gym",
  },
  {
    id: 4,
    name: "Priya K.",
    badge: "-28lbs",
    badgeType: "weight",
    quote:
      "As a busy mom of three, I needed a plan that adapted to my chaos. Flexify delivered every single week.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80",
    alt: "Woman in yoga pose showing strength and flexibility",
  },
  {
    id: 5,
    name: "Derek O.",
    badge: "Podium Finish",
    badgeType: "pr",
    quote:
      "Placed 2nd at my first powerlifting meet. The periodization plan was exactly what I needed.",
    image:
      "https://images.unsplash.com/photo-1534368959876-26bf04f2c947?w=800&q=80",
    alt: "Man lifting heavy barbell with intense focus",
  },
  {
    id: 6,
    name: "Elena R.",
    badge: "-19lbs",
    badgeType: "weight",
    quote:
      "Six weeks in and my energy is through the roof. The nutrition sync with workouts is a total game-changer.",
    image:
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=800&q=80",
    alt: "Fit woman running on outdoor track in athletic wear",
  },
  {
    id: 7,
    name: "Theo B.",
    badge: "Ironman Finish",
    badgeType: "pr",
    quote:
      "Completed my first full Ironman. The adaptive training schedule kept me injury-free through 6 months of prep.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80",
    alt: "Triathlete in serious training session outdoors",
  },
  {
    id: 8,
    name: "Aisha M.",
    badge: "+15lbs Muscle",
    badgeType: "muscle",
    quote:
      "Finally stopped second-guessing my programming. Flexify's AI coach is like having a PhD trainer in my pocket.",
    image:
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&q=80",
    alt: "Strong woman doing dumbbell exercises in gym",
  },
  {
    id: 9,
    name: "Carl N.",
    badge: "-35lbs",
    badgeType: "weight",
    quote:
      "Down 35 pounds in 5 months. The accountability features kept me consistent when motivation dipped.",
    image:
      "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80",
    alt: "Man in athletic gear doing outdoor cardio workout",
  },
  {
    id: 10,
    name: "Yuna S.",
    badge: "100-Day Streak",
    badgeType: "pr",
    quote:
      "Hit a 100-day workout streak and broke my deadlift record twice. Flexify made consistency feel effortless.",
    image:
      "https://images.unsplash.com/photo-1606902965551-dce093cda6e7?w=800&q=80",
    alt: "Woman celebrating fitness achievement with raised fists",
  },
];
