import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 

export const GET = async(req: NextRequest) => {
    try{
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
        
        const result = await dbConnect("payments").aggregate([
            {
                $match: {
                    status: "success",
                    paidAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$amount" }
                }
            }
        ]).toArray();
        
        return NextResponse.json({ total: result[0]?.total || 0 });
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch monthly earnings" },
            { status: 500 },
        );
    }
}