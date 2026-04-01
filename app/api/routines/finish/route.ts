import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

interface WorkoutLog {
  email: string;
  userId: string;
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

    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const logCol = await dbConnect("workout_logs");

    const { routineId, planName, duration, exercises, date } = body;

    const newLog: WorkoutLog = {
      email: session.user.email,
      userId: session.user.id,
      routineId,
      planName,
      duration,
      exercises,
      createdAt: new Date(date || new Date()),
    };

    const result = await logCol.insertOne(newLog);
    if (result.insertedId) {
      const userChannelName = `user-${session.user.email.replace(/[@.]/g, "-")}`;
      
      await pusherServer.trigger(userChannelName, "new-update", {
        message: `Workout Completed! You've finished "${planName}" successfully.`,
      });
    }

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