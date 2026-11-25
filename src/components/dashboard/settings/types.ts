export type Role = "user" | "coach" | "admin" | "";

export type TabKey =
  | "profile"
  | "fitness"
  | "coach"
  | "admin"
  | "notifications"
  | "security"
  | "appearance";

export interface DbUser {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  phone?: string;
  location?: string;
  imageUrl?: string;
  profileImage?: string;
  plan?: string;
  planExpiry?: string;
  fitnessProfile?: {
    height?: number | string;
    weight?: number | string;
    age?: number | string;
    gender?: string;
    fitnessGoal?: string;
    activityLevel?: string;
    dietaryPreference?: string;
    waterIntake?: number | string;
    workoutDays?: number | string;
  };
  pricing?: Record<string, number>;
  availableDays?: string[];
  trainingTypes?: string[];
  preferredClients?: string[];
  specialties?: string;
  bio?: string;
  languages?: string;
  education?: string;
  experienceYears?: number;
  maxClients?: number;
  status?: string;
}

export interface SettingsTabProps {
  user: DbUser;
  onSaveSuccess?: () => void;
}
