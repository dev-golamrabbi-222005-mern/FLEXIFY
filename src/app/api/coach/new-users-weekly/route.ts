// GET /api/coach/new-users-weekly?coachId=xxx

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
        return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }

    const coachUsers = dbConnect("coach_users");

    // 🗓 Start of current week (Sunday ভিত্তিক)
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay(); // 0 = Sunday

    startOfWeek.setDate(now.getDate() - day);
    startOfWeek.setHours(0, 0, 0, 0);

    // 🔢 Count নতুন users
    const count = await coachUsers.countDocuments({
        coachId,
        createdAt: { $gte: startOfWeek },
    });

    return NextResponse.json({
        coachId,
        newUsersThisWeek: count,
        from: startOfWeek,
        to: now,
    });
}