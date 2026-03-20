import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const userEmail = session.user.email;
    const db = await dbConnect("user-data"); 

    const user = await (await dbConnect("users")).findOne({ email: userEmail });
    
    const routines = await (await dbConnect("user_routines")).find({ userEmail }).toArray();

    const schedule = await (await dbConnect("user_schedules")).findOne({ userEmail });

    return NextResponse.json({
      workoutDays: user?.fitnessProfile?.workoutDays || "Not Set",
      routines: routines.map(r => ({ id: r._id, name: r.planName })),
      currentSchedule: schedule?.days || {}
    });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching schedule" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const collection = await dbConnect("user_schedules");

    await collection.updateOne(
      { userEmail: session.user.email },
      { $set: { userEmail: session.user.email, days: body.days, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Schedule updated!" });
  } catch (error) {
    return NextResponse.json({ message: "Error saving schedule" }, { status: 500 });
  }
}