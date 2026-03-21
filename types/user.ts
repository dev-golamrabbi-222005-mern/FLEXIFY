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
  fitness_profile: FitnessProfile;
  calculatedGoals: UserGoals;
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