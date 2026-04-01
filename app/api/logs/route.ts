import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { ObjectId } from "mongodb";
import { pusherServer } from "@/lib/pusher";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized! Please login first." },
        { status: 401 }
      );
    }

    const userEmail:string = session.user.email;
    const body = await request.json();
    const { date, type, data } = body;

    if (!date || !type) {
      return NextResponse.json(
        { message: "Date and Type are required" },
        { status: 400 }
      );
    }

    const logCollection = await dbConnect("daily-logs");
    const goalCollection = await dbConnect("user-goals");
    
 const logId = `${userEmail}_${date}`;
    const filter = { _id: logId as unknown as ObjectId };

    if (type === "WATER_UPDATE") {
      const glasses = Number(data.glasses) || 0;
      const liters = glasses * 0.25;
      await logCollection.updateOne(
        filter,
        {
          $set: {
            userEmail,
            date,
            waterIntake: data.glasses,
            lastUpdated: new Date(),
          },
        },
        { upsert: true }
      );
      await goalCollection.updateOne(
        { userId: userEmail, type: "WATER_INTAKE" },
        { $set: { currentValue: liters } }
      );
    
    }
    

    if (type === "ADD_FOOD") {
      const calorieGain = Number(data.entry.foodItem.calories * data.entry.quantity);
      const mealName = data.mealId;
      await logCollection.updateOne(
        filter,
        {
          $set: { userEmail, date, lastUpdated: new Date() },
          $push: { [`meals.${data.mealId}.entries`]: data.entry },
          $inc: { totalCalories: data.entry.foodItem.calories * data.entry.quantity }
        },
        { upsert: true }
      );
      await goalCollection.updateOne(
        { userId: userEmail, type: "WEIGHT_LOSS" }, 
        { $inc: { currentValue: calorieGain } }
      );
  
  const userChannelName = `user-${userEmail.replace(/[@.]/g, "-")}`;
      await pusherServer.trigger(userChannelName, "new-update", {
        message: `Logged ${data.entry.foodItem.name} for ${mealName}. Total calories updated! 🥗`,
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Log updated successfully!" 
    }, { status: 200 });

  } catch (error) {
    console.error("Daily Log Error:", error);
    return NextResponse.json(
      { message: "Failed to update daily log" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const userEmail = session.user.email;

    if (!date) {
      return NextResponse.json({ message: "Date is required" }, { status: 400 });
    }

    const collection = await dbConnect("daily-logs");
    const log = await collection.findOne({ 
      _id: `${userEmail}_${date}` as unknown as ObjectId 
    });
    return NextResponse.json(log || { 
      waterIntake: 0, 
      meals: { breakfast: { entries: [] }, lunch: { entries: [] }, dinner: { entries: [] }, snacks: { entries: [] } },
      totalCalories: 0 
    });

  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch logs" }, { status: 500 });
  }
}