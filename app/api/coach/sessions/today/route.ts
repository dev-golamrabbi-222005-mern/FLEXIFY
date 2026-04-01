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
    const todaySessions = allSessions
        .filter((session) => 
            session.day === now.getDate() && 
            session.month === now.getMonth() + 1 && 
            session.year === now.getFullYear()
        )
        .sort((a, b) => {
            const timeA = a.time.split(':').map(Number);
            const timeB = b.time.split(':').map(Number);
            return (timeA[0] * 60 + timeA[1]) - (timeB[0] * 60 + timeB[1]);
        });

    // Enrich with client info
    const clientEmails = [...new Set(todaySessions.map(s => s.clientEmail))];
    const usersCollection = dbConnect("users");
    const users = await usersCollection.find({ email: { $in: clientEmails } }).toArray();
    const userMap = new Map(users.map(u => [u.email, { name: u.name, imageUrl: u.imageUrl, phone: u.phone, plan: u.plan }]));

    todaySessions.forEach(session => {
        session.clientInfo = userMap.get(session.clientEmail);
    });

    return NextResponse.json(
        todaySessions,
        {status: 200}
    );
}