import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {

    const body = await req.json();

    const collection = await dbConnect("workout_sessions");

    await collection.updateOne(
        {
            _id: new ObjectId(body.sessionId)
        },
        {
            $set: {
                currentSet: body.set,
                currentRep: body.rep,
                updatedAt: new Date()
            }
        }
    );

    return NextResponse.json({ success: true });
}