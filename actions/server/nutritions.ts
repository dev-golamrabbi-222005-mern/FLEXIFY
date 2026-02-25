"use server";

import { dbConnect } from "@/lib/dbConnect";

export interface Nutrition {
  name: string;
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

export const getNutritions = async (): Promise<Nutrition[]> => {
  const nutritions = await dbConnect<Nutrition>("nutritions")
    .find({})
    .toArray();

  return nutritions;
};