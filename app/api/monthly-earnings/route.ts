import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 

export const GET = async(req: NextRequest) => {
    try{
        const now = new Date();
        const months = [
            "Jan", "Feb", "Mar",
            "Apr", "May", "Jun",
            "Jul", "Aug", "Sep",
            "Oct", "Nov", "Dec",
        ];

        // determine date range for last 6 months (inclusive)
        const startOfWindow = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const endOfWindow = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const agg = await dbConnect("payments").aggregate([
            {
                $match: {
                    status: "success",
                    paidAt: { $gte: startOfWindow, $lte: endOfWindow },
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$paidAt" },
                        month: { $month: "$paidAt" }
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id.year",
                    month: "$_id.month",
                    total: 1
                }
            }
        ]).toArray();

        const totalsByMonth = new Map<string, number>();
        agg.forEach(item => {
            totalsByMonth.set(`${item.year}-${String(item.month).padStart(2, "0")}`, item.total);
        });

        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
            return {
                year: d.getFullYear(),
                month: months[d.getMonth()],
                total: totalsByMonth.get(key) ?? 0
            };
        });

        return NextResponse.json({ data: last6Months });
    }
    catch(error){
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch monthly earnings" },
            { status: 500 },
        );
    }
}