import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 

export const GET = async(req: NextRequest) => {
    try{
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("status") || "";
        const coaches = await dbConnect("coaches")
            .find(query ? { status: { $regex: query, $options: "i" } } : {})
            .toArray();
        return NextResponse.json(coaches);
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch coaches" },
            { status: 500 },
        );
    }
}