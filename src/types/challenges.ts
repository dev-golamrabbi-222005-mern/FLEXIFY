export interface DayExercise {
  id?: string;
  name: string;
  sets: number;
  reps: string;
  rest: string;
  duration?: number;
  completed?: boolean;
}

export interface DayProgress {
  day: number;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

export interface ChallengeRecord {
  id: string;
  slug: string;
  title: string;
  category: "pushups" | "pullups" | "squats" | "custom" | string;
  totalDays: number;
  currentDay: number;
  progress: DayProgress[];
  status: "active" | "completed" | "abandoned";
  completedAt?: string;
  streakCount: number;
}

export interface ChallengeSummary {
  totalActive: number;
  totalCompleted: number;
  longestStreak: number;
  completionRate: number;
}

export type ChallengeType = "pushups" | "pullups" | "squats";
export type ChallengeLevel = "beginner" | "intermediate" | "advanced";
export type ChallengeScreen = "plan" | "day-preview" | "session" | "complete";

export interface ExerciseItem {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  target: string;
  gifUrl: string;
  secondaryMuscles?: string[];
  instructions?: string[];
}
