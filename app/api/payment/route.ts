import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest) => {
    try {
        const payments = await dbConnect("payments")
        .find()
        .sort({createdAt: -1})
        .toArray();
        return NextResponse.json(payments);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch payments" },
            { status: 500 },
        );
    }
}