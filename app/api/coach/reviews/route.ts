import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const coach_reviews = await dbConnect("coach_reviews").find({
        coach_id: session?.user?.id,
    }).toArray();
    return NextResponse.json(
        coach_reviews,
        {status: 200}
    );
}