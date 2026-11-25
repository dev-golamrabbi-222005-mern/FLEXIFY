import { ObjectId } from "mongodb";

export interface Exercise {
  id?: string;
  name: string;
  target?: string;
  bodyPart?: string;
  equipment?: string;
  gifUrl?: string;
  sets?: number;
  reps?: string | number;
  weight?: string | number;
  duration?: number;
  rest?: string;
  instructions?: string[];
  notes?: string;
}

export interface ExerciseGroup {
  name: string;
  exercises: Exercise[];
}

export interface Routine {
  _id?: string | ObjectId;
  id?: string;
  name: string;
  description?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  exercises: Exercise[];
  targetMuscle?: string;
  createdAt?: string | Date;
}

export interface SuggestedPlans {
  title: string;
  description: string;
  level: string;
  duration: string;
  exercises: Exercise[];
}

export interface WorkoutPlan {
  _id?: string | ObjectId;
  coachId: string;
  traineeId: string;
  traineeName: string;
  title: string;
  description: string;
  exercises: Exercise[];
  createdAt?: string | Date;
}

export interface PlanFormData {
  title: string;
  description: string;
  traineeId: string;
  exercises: Exercise[];
}

export interface WorkoutStat {
  date: string;
  completedMinutes: number;
  caloriesBurned: number;
}

export interface WorkoutLog {
  date: string;
  completed: boolean;
  routineName?: string;
  durationMinutes?: number;
}
