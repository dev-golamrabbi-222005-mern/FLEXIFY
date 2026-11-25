// GET /api/coach/earnings?coachId=xxx

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
        return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }

    const coachUsers = dbConnect("coach_users");

    // 🗓 last 6 months (including current)
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const result = await coachUsers
        .aggregate([
        {
            $match: { coachId },
        },
        {
            $unwind: "$payments",
        },
        {
            $match: {
                "payments.paidAt": { $gte: sixMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$payments.paidAt" },
                    month: { $month: "$payments.paidAt" },
                    monthName: {
                        $dateToString: { format: "%b", date: "$payments.paidAt" }
                    }
                },
                total: { $sum: "$payments.amount" },
            },
        },
        {
            $sort: { "_id.year": 1, "_id.month": 1 },
        },
        ])
        .toArray();

    return NextResponse.json(result);
}