import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export const GET = async (req: NextRequest) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== "coach") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const usersCol = await dbConnect("users");
        
        const coachData = await usersCol.findOne(
            { _id: new ObjectId(session.user.id) },
            { projection: { reviews: 1 } }
        );

        return NextResponse.json(coachData?.reviews || [], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
};