export interface Coach {
  _id: string;
  name: string;
  profileImage?: string;
  imageUrl?: string;
  location?: string;
  experienceYears?: number;
  trainingTypes?: string[];
  specialties?: string;
  pricing?: {
    monthly?: number;
    perSession?: number;
  };
}

export const SPECIALTIES = [
  "Gymnishiam",
  "Yoga",
  "Cardio",
  "CrossFit",
  "Bodybuilding",
];

export const EXPERIENCE_LEVELS = ["0-2 Years", "3-5 Years", "5+ Years"];

export const TRAINING_TYPES = ["Online", "1-on-1", "Group"];
