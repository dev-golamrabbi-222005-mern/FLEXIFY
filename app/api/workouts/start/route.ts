import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const session = await getServerSession(authOptions);

    const user = await dbConnect("users");
    const singleUser = user.findOne({email: session?.user?.email});

    if (!singleUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const collection = await dbConnect("workout_sessions");

    const workoutSession = {
        exerciseId: body.exerciseId,
        currentSet: 1,
        currentRep: 0,
        totalSets: 3,
        totalReps: 12,
        completed: false,
        startedAt: new Date(),
        updatedAt: new Date()
    };

    const result = await collection.insertOne(workoutSession);

    return NextResponse.json({
        sessionId: result.insertedId
    });
}