import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async(req: NextRequest) => {
    try {
        const body = await req.json();
        const coaches = await dbConnect("coaches");
        await coaches.updateOne(
            {
                _id: new ObjectId(body.id)
            },
            {
                $set: {
                    status: body.status,
                }
            }
        );

        return NextResponse.json(
            { success: true },
            { status: 200 },
        );
    }
    catch(error){
        return NextResponse.json(
            { success: false },
            { status: 200 },
        );
    }
}