import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    const usersCol = await dbConnect("users");
    const paymentsCol = await dbConnect("payments");

    const userGrowth = await usersCol.aggregate([
      { $match: { role: "user" } }, 
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, 
          users: { $sum: 1 },
          order: { $min: "$createdAt" }
        }
      },
      { $sort: { order: 1 } },
      { 
        $project: { 
          month: { 
            $dateToString: { format: "%b", date: "$order" } 
          }, 
          users: 1, 
          _id: 0 
        } 
      }
    ]).toArray();

    const revenueStats = await paymentsCol.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          revenue: { $sum: "$amount" },
          order: { $min: "$createdAt" }
        }
      },
      { $sort: { order: 1 } },
      { 
        $project: { 
          month: { $dateToString: { format: "%b", date: "$order" } }, 
          revenue: 1, 
          _id: 0 
        } 
      }
    ]).toArray();

    const totalUsers = await usersCol.countDocuments({ role: "user" });
    const totalPayments = await paymentsCol.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();

    const engagementData = [
      { name: "Workouts", value: 450 },
      { name: "Programs", value: 320 },
      { name: "Challenges", value: 280 },
      { name: "Coaching", value: 190 },
    ];

    return NextResponse.json({
      summary: {
        totalUsers,
        totalRevenue: totalPayments[0]?.total || 0,
        engagement: "1.5K" 
      },
      userGrowth,
      revenueStats,
      engagementData
    });
  } catch (error) {
    return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
  }
}