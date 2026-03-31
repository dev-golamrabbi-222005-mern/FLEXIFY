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
    
    // Enrich with client info
    const clientEmails = [...new Set(result.map(s => s.clientEmail))];
    const usersCollection = dbConnect("users");
    const users = await usersCollection.find({ email: { $in: clientEmails } }).toArray();
    const userMap = new Map(users.map(u => [u.email, { name: u.name, imageUrl: u.imageUrl, phone: u.phone, plan: u.plan }]));
    
    result.forEach(session => {
        session.clientInfo = userMap.get(session.clientEmail);
    });
    
    return NextResponse.json(
        result,
        {status: 200}
    );
}