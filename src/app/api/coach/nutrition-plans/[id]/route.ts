import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async(req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getServerSession(authOptions);
    if(session){
        const {id} = await params;
        const nutrition_plan = await dbConnect("nutrition_plans").deleteOne({_id: new ObjectId(id)});
        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    }
    else{
        return NextResponse.json(
            { success: false },
            { status: 500 }
        );
    }
}