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