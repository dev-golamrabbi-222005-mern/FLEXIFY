import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    try{
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("role") || "";
        const users = await dbConnect("users")
            .find(query ? { role: { $regex: query, $options: "i" } } : {})
            .toArray();
        return NextResponse.json(users);
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 },
        );
    }
}