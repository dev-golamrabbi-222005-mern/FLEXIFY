import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const nutrition_plans = await dbConnect("nutrition_plans").find({
        coach_id: session?.user?.id,
    }).toArray();
    return NextResponse.json(
        nutrition_plans,
        {status: 200}
    );
}