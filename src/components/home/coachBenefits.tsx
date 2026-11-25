import React from "react";
import { FaDumbbell, FaUsers, FaChartLine, FaRocket } from "react-icons/fa";

export interface CoachBenefit {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const COACH_BENEFITS: CoachBenefit[] = [
  {
    icon: <FaDumbbell />,
    title: "Flexible Hours",
    description: "Work on your own schedule",
  },
  {
    icon: <FaUsers />,
    title: "Growing Client Base",
    description: "Access to a growing community of active users",
  },
  {
    icon: <FaChartLine />,
    title: "Premium Earnings",
    description: "Competitive rates & bonuses",
  },
  {
    icon: <FaRocket />,
    title: "Career Growth",
    description: "Professional development support",
  },
];
