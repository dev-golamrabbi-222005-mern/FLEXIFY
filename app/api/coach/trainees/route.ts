import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("name");
    const trainees = await dbConnect("coach_trainees").find(query ? {
        coach_id: session?.user?.id,
        name: { $regex: query, $options: "i" }
    } : {}).toArray();
    return NextResponse.json(
        trainees,
        {status: 200}
    );

}