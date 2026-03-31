import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

interface Session {
    _id: string;
    coachId: string;
    day: number;
    month: number;
    year: number;
    time: string;
    clientEmail: string;
    type: string;
    clientInfo?: {
        name: string;
        imageUrl: string;
        phone: string;
        plan: string;
    };
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
    const endOfWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const upcomingSessions = allSessions
        .map((session) => ({
            ...session,
            date: new Date(session.year, session.month - 1, session.day, ...session.time.split(':').map(Number))
        }))
        .filter((session) => session.date >= now && session.date <= endOfWeek)
        .sort((a, b) => a.date.getTime() - b.date.getTime())
        .map((session) => {
            const { date: _, ...rest } = session;
            return rest;
        });

    // Enrich with client info
    const clientEmails = [...new Set(upcomingSessions.map(s => s.clientEmail))];
    const usersCollection = dbConnect("users");
    const users = await usersCollection.find({ email: { $in: clientEmails } }).toArray();
    const userMap = new Map(users.map(u => [u.email, { name: u.name, imageUrl: u.imageUrl, phone: u.phone, plan: u.plan }]));
    
    upcomingSessions.forEach(session => {
        session.clientInfo = userMap.get(session.clientEmail);
    });

    return NextResponse.json(
        upcomingSessions,
        {status: 200}
    );
}