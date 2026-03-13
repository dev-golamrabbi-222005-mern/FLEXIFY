import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

interface WorkoutLog {
  routineId: string;
  planName: string;
  duration: number;
  exercises: {
    exerciseId: string;
    name: string;
    trackingType: string;
    sets: {
      weight: string;
      reps: string;
      seconds: string;
    }[];
  }[];
  createdAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const logCol = await dbConnect("workout_logs");

    const { routineId, planName, duration, exercises, date } = body;

    const newLog: WorkoutLog = {
      routineId,
      planName,
      duration,
      exercises,
      createdAt: new Date(date),
    };

    const result = await logCol.insertOne(newLog);

    return NextResponse.json({ 
      success: true, 
      message: "Workout saved!", 
      id: result.insertedId 
    });

  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Save Failed";
    return NextResponse.json({ success: false, message: errorMsg }, { status: 500 });
  }
}