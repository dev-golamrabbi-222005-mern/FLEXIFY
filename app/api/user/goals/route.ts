import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect("user-goals");
   
    const goals = await collection
      .find({ userId: session.user.email })
      .sort({ createdAt: -1 }) 
      .toArray();

    return NextResponse.json(goals);
  } catch (error) {
    console.error("GET_GOALS_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const collection = await dbConnect("user-goals");

    const newGoal = {
      userId: session.user.email,
      type: body.type,
      title: body.title,
      targetValue: Number(body.targetValue),
      currentValue: 0,
      unit: body.unit,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newGoal);

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      message: "Goal created!" 
    });
  } catch (error) {
    return NextResponse.json({ message: "Failed to create goal" }, { status: 500 });
  }
}