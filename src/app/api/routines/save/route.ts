import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized! Please login first." }, { status: 401 });
    }

    const body = await request.json();
    const { planName, exercises, createdAt } = body;

    const userName = session.user.name;
    const userEmail = session.user.email;

    if (!planName || !exercises || exercises.length === 0) {
      return Response.json({ message: "Plan Title and Exercises are required" }, { status: 400 });
    }

    const collection = await dbConnect("user_routines"); 
    const result = await collection.insertOne({
      planName,
      userName,
      userEmail, 
      exercises, 
      createdAt: createdAt || new Date(),
    });

    return Response.json({ 
      success: true, 
      message: "Routine saved successfully!",
      id: result.insertedId 
    }, { status: 201 });

  } catch (error) {
    console.error("Save Routine Error:", error);
    return Response.json({ message: "Failed to save routine" }, { status: 500 });
  }
}