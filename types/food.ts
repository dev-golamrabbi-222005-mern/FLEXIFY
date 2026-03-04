export interface FoodItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
}

export interface MealSection {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  entries: MealEntry[];
}
