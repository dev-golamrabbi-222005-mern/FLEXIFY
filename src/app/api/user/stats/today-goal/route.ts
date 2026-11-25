import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    const email = session.user.email;
    const goalsCol = await dbConnect("daily_goals");
    const logsCol = await dbConnect("workout_logs");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const currentGoal = await goalsCol.findOne({email: email, date: today });
    if (!currentGoal) return NextResponse.json({ success: true, data: null });

    const workoutToday = await logsCol.findOne({ 
      email: email,
      planName: currentGoal.planName,
      createdAt: { $gte: today }
    });

    const completedCount = workoutToday?.exercises?.length || 0;
    const totalCount = currentGoal.totalExercises || 0;
    const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return NextResponse.json({ 
      success: true, 
      data: { planName: currentGoal.planName, progress: progress > 100 ? 100 : progress, isCompleted: progress === 100 } 
    });
  } catch {
    return NextResponse.json({ success: false, data: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false }, { status: 401 });
    }
    const { planName, totalExercises } = await req.json();
    const email = session.user.email;
    const goalsCol = await dbConnect("daily_goals");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await goalsCol.updateOne(
      { email: email, date: today },
      { $set: { email, planName, totalExercises, date: today, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}