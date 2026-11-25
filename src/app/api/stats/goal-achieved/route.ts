import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const result = await dbConnect("user-achievements").find().toArray();
    const completed = result.filter(r => r.achievements.length !== 0);
    return NextResponse.json(completed);
}