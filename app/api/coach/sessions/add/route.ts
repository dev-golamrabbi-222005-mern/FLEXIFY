import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req: NextRequest) => {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const coachSession = dbConnect("coach_sessions");
    const result = await coachSession.insertOne({
        coachId: session?.user?.id,
        ...body,
    });
    return NextResponse.json(result);
}