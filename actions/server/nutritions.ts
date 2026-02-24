"use server";

import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface Meal {
  name: string;
  calories: number;
  protein: number;  // grams
  carbs: number;    // grams
  fat: number;      // grams
}

export interface Nutrition {
  _id?: ObjectId;
  userId: ObjectId;     // reference to users collection
  date: Date;

  meals: Meal[];

  waterGlassCount: number;  // total glasses per day
  sleepHours: number;       // total sleep duration

  createdAt?: Date;
  updatedAt?: Date;
}

export const getNutritions = async (): Promise<Nutrition[]> => {
  const nutritions = await dbConnect<Nutrition>("nutritions")
    .find({})
    .toArray();

  return nutritions;
};