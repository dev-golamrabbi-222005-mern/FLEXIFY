import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const usersCol = await dbConnect("users");
    const logsCol = await dbConnect("workout_logs");

    const user = await usersCol.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    const targetDays = parseInt(user.fitnessProfile?.workoutDays) || 3;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); 
    startOfWeek.setHours(0, 0, 0, 0);

    const weeklyLogs = await logsCol.find({
      email: session.user.email,
      createdAt: { $gte: startOfWeek }
    }).toArray();

    const uniqueWeeklyDays = new Set(
      weeklyLogs.map(log => new Date(log.createdAt).toDateString())
    ).size;

    const progress = Math.min(Math.round((uniqueWeeklyDays / targetDays) * 100), 100);

    const allLogs = await logsCol
      .find({ email: session.user.email })
      .sort({ createdAt: -1 })
      .toArray();

    let totalStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDates = Array.from(new Set(
      allLogs.map(log => {
        const d = new Date(log.createdAt);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
    ));

    for (let i = 0; i < uniqueDates.length; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i); 
      
      if (uniqueDates.includes(checkDate.getTime())) {
        totalStreak++;
      } else {
       
        if (i === 0) {
           const yesterday = new Date(today);
           yesterday.setDate(today.getDate() - 1);
           if (uniqueDates.includes(yesterday.getTime())) continue;
        }
        break;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        completedDays: uniqueWeeklyDays,
        targetDays,
        progress,
        isGoalAchieved: uniqueWeeklyDays >= targetDays,
        totalStreak, 
        lastUpdated: now
      }
    });

  } catch (error) {
    console.error("Streak API Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}