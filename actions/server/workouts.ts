"use server";

import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface Exercise {
  name: string;
  sets?: number;        // strength training
  reps?: number;        // strength training
  weight?: number;      // in kg or lbs
  duration?: number;    // in minutes (for cardio)
}

export type WorkoutStatus = "planned" | "completed" | "skipped";

export interface Workout {
  _id?: ObjectId;
  userId: ObjectId;     // reference to users collection
  date: Date;
  exercises: Exercise[];
  totalCalories: number;
  status: WorkoutStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export const getWorkouts = async (): Promise<Workout[]> => {
  const workouts = await dbConnect<Workout>("workouts")
    .find({})
    .toArray();

  return workouts;
};