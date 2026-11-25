import { ObjectId } from "mongodb";

export interface FitnessProfile {
  age: number;
  gender: "Male" | "Female" | "Other";
  height: number;
  weight: number;
  goal: string;
  activityLevel: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active";
  workoutDays: string;
  sleepHours: number;
  waterIntake: number;
  dietType: string;
}

export interface UserGoals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterGoal: number; 
}

export interface UserProfileResponse {
  fitnessProfile?: FitnessProfile;
  fitness_profile?: FitnessProfile;
  calculatedGoals: UserGoals | null;
}

export type GoalType = "WEIGHT_LOSS" | "MUSCLE_GAIN" | "WATER_INTAKE" | "WORKOUT_DAYS";

export interface UserGoal {
  _id?: string;
  userId: string; 
  type: GoalType;
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  createdAt: Date;
}

export interface GoalFormData {
  title: string;
  type: GoalType;
  targetValue: number;
  unit: string;
}

export interface DaySchedule {
  routine: string;
  time: string;
}

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  unlockedAt?: string;
  progress?: number;
  target?: number;
}

export interface Achievement {
  _id?: string | ObjectId;
  userId: string;
  badgeId: string;
  badgeName: string;
  unlockedAt: string | Date;
}

export interface ICoachRelation {
  coachId: string;
  coachName: string;
  coachEmail: string;
  coachImage?: string;
  status: "active" | "pending" | "ended";
  planName?: string;
}

export interface IMessage {
  id: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  text: string;
  createdAt: string | Date;
}

export interface UserRoutine {
  _id?: string | ObjectId;
  routineId?: string;
  name: string;
  planName?: string;
  exercises?: any[];
}
