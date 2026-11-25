import { ObjectId } from "mongodb";
import { Coach } from "./coach";

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  badge?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
}

export interface TestimonialStory {
  id: string;
  name: string;
  role: string;
  avatar: string;
  story: string;
  achievement: string;
  rating?: number;
}

export interface FaqItem {
  id?: string;
  question: string;
  answer: string;
  category?: string;
}

export type CoachDB = Omit<Coach, "_id"> & { _id: ObjectId };
