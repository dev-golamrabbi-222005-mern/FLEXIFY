import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {

    const session = await getServerSession(authOptions);
    const users = await dbConnect("users");
    const singleUser = await users.findOne({email: session?.email});
    if (!singleUser?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();

    const collection = await dbConnect("workout_sessions");

    const workoutSession = {
        userId: singleUser._id.toString(),
        exerciseId: body.exerciseId,
        currentSet: 1,
        currentRep: 0,
        totalSets: body.totalSets,
        totalReps: body.totalReps,
        completed: false,
        startedAt: new Date(),
        updatedAt: new Date()
    };

    const result = await collection.insertOne(workoutSession);

    return NextResponse.json({
        sessionId: result.insertedId
    });
}