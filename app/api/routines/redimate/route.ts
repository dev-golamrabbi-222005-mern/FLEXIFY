import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const collection = await dbConnect("exercises");

    const packages = {
  beginner: [
    "Pushups",
    "One-Arm Dumbbell Row",  
    "Dumbbell Shoulder Press",
    "Bodyweight Squat",
    "Dumbbell Deadlift",
    "3/4 Sit-Up"
  ],
  intermediate: [
    "Barbell Squat",
    "Barbell Bench Press - Medium Grip",
    "One-Arm Dumbbell Row",      
    "Dumbbell Shoulder Press",
    "Zottman Curl",
    "Dumbbell Triceps Extension",
    "Knee/Hip Raise On Parallel Bars" 
  ],
  advanced: [
    "Dumbbell Bench Press",
    "Weighted Pull Ups",
    "Bent Over Barbell Row",
    "Clean and Press",
    "Barbell Squat",
    "Barbell Deadlift",
    "Zottman Preacher Curl",
    "Dumbbell Triceps Extension",
    "Ab Roller"              
  ]
};

    const allNames = [...new Set([...packages.beginner, ...packages.intermediate, ...packages.advanced])];
    const allExercises = await collection.find({ name: { $in: allNames } }).toArray();

    const formatPackage = (names: string[]) => 
      names.map(name => allExercises.find(ex => ex.name.toLowerCase() === name.toLowerCase())).filter(Boolean);

    return NextResponse.json({
      beginner: formatPackage(packages.beginner),
      intermediate: formatPackage(packages.intermediate),
      advanced: formatPackage(packages.advanced)
    });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}