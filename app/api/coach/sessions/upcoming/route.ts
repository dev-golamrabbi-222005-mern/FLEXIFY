import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

interface Session {
    _id: string;
    coachId: string;
    day: number;
    month: number;
    year: number;
    time: string;
    client: string;
    type: string;
}

export const GET = async(req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
        return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }

    const coachSessions = dbConnect("coach_sessions");
    const allSessions = await coachSessions.find({ coachId }).toArray() as unknown as Session[];
    
    const now = new Date();
    const upcomingSessions = allSessions
        .map((session) => ({
            ...session,
            date: new Date(session.year, session.month - 1, session.day, ...session.time.split(':').map(Number))
        }))
        .filter((session) => session.date >= now)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .slice(0, 3)
        .map((session) => {
            const { date, ...rest } = session;
            return rest;
        });

    return NextResponse.json(
        upcomingSessions,
        {status: 200}
    );
}