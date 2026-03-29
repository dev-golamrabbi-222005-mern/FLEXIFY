import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
        return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }

    const coachSessions = dbConnect("coach_sessions");
    const result = await coachSessions.find({ coachId }).toArray();
    
    // Sort sessions by date and time in ascending order
    result.sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1, a.day, ...a.time.split(':').map(Number));
        const dateB = new Date(b.year, b.month - 1, b.day, ...b.time.split(':').map(Number));
        return dateA.getTime() - dateB.getTime();
    });
    
    return NextResponse.json(
        result,
        {status: 200}
    );
}