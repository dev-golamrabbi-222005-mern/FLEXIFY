import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
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

        // 🔗 JOIN users collection
        {
            $lookup: {
                from: "users",
                localField: "userEmail",   // coach_users
                foreignField: "email",     // users
                as: "user",
            },
        },

        // 🧩 array → object
        {
            $unwind: {
                path: "$user",
                preserveNullAndEmptyArrays: true, // user না থাকলেও data থাকবে
            },
        },

        // 🎯 Final shape
        {
            $project: {
                _id: 1,
                coachId: 1,
                userEmail: 1,
                totalPaid: 1,
                payments: 1,
                createdAt: 1,

                // 👇 user info
                name: "$user.name",
                image: "$user.imageUrl",
                phone: "$user.phone",
                plan: "$user.plan",
            },
        },

        // 🔥 latest user first
        {
            $sort: { createdAt: -1 },
        },
    ])
    .toArray();
    return NextResponse.json(
        result,
        {status: 200}
    );
}