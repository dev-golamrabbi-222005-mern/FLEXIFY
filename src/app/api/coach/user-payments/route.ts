// GET /api/coach/user-payments?coachId=xxx

import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const coachId = searchParams.get("coachId");

    if (!coachId) {
        return NextResponse.json({ error: "coachId required" }, { status: 400 });
    }

    const coachUsers = dbConnect("coach_users");

    const result = await coachUsers
        .aggregate([
            {
                $match: { coachId },
            },
            {
                $unwind: "$payments",
            },
            {
                $group: {
                    _id: "$userEmail",
                    totalPaid: { $sum: "$payments.amount" },
                    lastPayment: { $max: "$payments.paidAt" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "email",
                    as: "user",
                },
            },
                {
                    $unwind: "$user",
                },
            {
                $sort: { lastPayment: -1 }, // 🔥 latest first
            },
        ])
        .toArray();

    return NextResponse.json(result);
}