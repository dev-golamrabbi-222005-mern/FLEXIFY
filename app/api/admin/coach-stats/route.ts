import {  NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export const GET = async () => {
  try {
    const users = await dbConnect("users");
    const logs = await dbConnect("workout_logs");

    const approvedCount = await users.countDocuments({ role: "coach", status: "approved" });
    const warningCount = await users.countDocuments({ role: "coach", status: "warning" });

    const rawChartData = await logs.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          sessions: { $sum: 1 },
          uniqueClients: { $addToSet: "$email" }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const chartData = rawChartData.map(item => ({
      month: monthNames[item._id - 1],
      sessions: item.sessions,
      clients: item.uniqueClients.length
    }));

    const finalData = chartData.length > 0 ? chartData : [{ month: "No Data", sessions: 0, clients: 0 }];

    return NextResponse.json({
      stats: { approvedCount, warningCount },
      performanceData: finalData
    });
  } catch (error) {
    return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
  }
};