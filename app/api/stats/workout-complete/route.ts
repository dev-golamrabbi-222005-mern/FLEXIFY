import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const result = await dbConnect("challenge_progress").find().toArray();
    const completed = result.filter(r => r.completedDays.length !== 0);
    return NextResponse.json(completed);
}