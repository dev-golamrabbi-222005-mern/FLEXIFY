import { ObjectId } from "mongodb";
import { FoodItem, FoodEntry, MealSection, NutritionData } from "./food";

export * from "./food";

export interface LogPayload {
  sectionId: string;
  entry: FoodEntry;
}

export interface AnalyzeFoodResponse {
  foodItem: FoodItem;
  quantity?: number;
}

export interface SearchFoodResponse {
  results: FoodItem[];
  total: number;
}

export interface MacroTotals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface NutritionGoal {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  waterGoal?: number;
}
