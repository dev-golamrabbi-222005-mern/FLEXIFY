import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export const GET = async () => {
  try {
    const exercises = await dbConnect("exercises");
    const logs = await dbConnect("workout_logs");

    const totalWorkouts = await exercises.countDocuments();
    
    const categoryStats = await exercises.aggregate([
      { $group: { _id: "$category", value: { $sum: 1 } } },
      { $project: { name: "$_id", value: 1, _id: 0 } }
    ]).toArray();

    const usageData = await logs.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setMonth(new Date().getMonth() - 6)) }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]).toArray();

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const workoutUsage = usageData.map(item => ({
      month: monthNames[item._id - 1],
      workouts: item.count
    }));

    return NextResponse.json({
      totalWorkouts,
      categoriesCount: categoryStats.length,
      categoryData: categoryStats,
      workoutUsage: workoutUsage.length > 0 ? workoutUsage : [{ month: "No Data", workouts: 0 }]
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch workout stats" }, { status: 500 });
  }
};