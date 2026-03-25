import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersCol = await dbConnect("users");
    const paymentsCol = await dbConnect("payments");
    const logsCol = await dbConnect("workout_logs");

    const totalUsers = await usersCol.countDocuments({ role: "user" });
    
    const activeCoaches = await usersCol.countDocuments({ 
      role: "coach", 
      status: "approved" 
    });

    const newSignupsToday = await usersCol.countDocuments({ 
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
    });

    const revenueResult = await paymentsCol.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]).toArray();
    const totalRevenue = revenueResult[0]?.total || 0;

    const monthlyRevenue = await paymentsCol.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]).toArray();

    const revenueData = monthlyRevenue.map(item => ({
      month: new Date(0, item._id.month - 1).toLocaleString('en-us', { month: 'short' }),
      revenue: item.revenue
    }));

    const userGrowth = await usersCol.aggregate([
      { $match: { role: "user" } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]).toArray();

    let cumulativeUsers = 0;
    const userGrowthData = userGrowth.map(item => {
      cumulativeUsers += item.count;
      return {
        month: new Date(0, item._id.month - 1).toLocaleString('en-us', { month: 'short' }),
        users: cumulativeUsers
      };
    });

    const thirtyFiveDaysAgo = new Date();
    thirtyFiveDaysAgo.setDate(thirtyFiveDaysAgo.getDate() - 35);

    const activityLogs = await logsCol.aggregate([
      { $match: { createdAt: { $gte: thirtyFiveDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      }
    ]).toArray();

    const subDist = await usersCol.aggregate([
      { $match: { role: "user", plan: { $exists: true } } },
      { $group: { _id: "$plan", value: { $sum: 1 } } }
    ]).toArray();

    const subscriptionData = subDist.map(item => ({
      name: item._id ? item._id.toUpperCase() : "FREE",
      value: item.value
    }));

    return NextResponse.json({
      stats: {
        totalUsers,
        activeCoaches,
        totalRevenue,
        newSignupsToday
      },
      revenueData,
      userGrowthData,
      subscriptionData,
      activityLogs
    });

  } catch (error) {
    console.error("Admin Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}