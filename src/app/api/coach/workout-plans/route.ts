import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
        return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }
    const workout_plans = await dbConnect("workout_plans").find({
        coachId,
    }).toArray();
    return NextResponse.json(
        workout_plans,
        {status: 200}
    );
}

export const POST = async(req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const coachSession = dbConnect("workout_plans");
    const result = await coachSession.insertOne({
        ...body,
    });
    return NextResponse.json(result);
}