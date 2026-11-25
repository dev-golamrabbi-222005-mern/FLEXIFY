import { ReactNode } from "react";

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface FoodEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
}

export type MealEntry = FoodEntry;

export interface MealSection {
  id: string;
  name: string;
  icon: ReactNode;
  iconColor?: string; 
  entries: FoodEntry[];
}
export interface NutritionData {
  meals?: Record<string, MealSection>; 
  waterIntake?: number;
  totalCalories?: number;
}