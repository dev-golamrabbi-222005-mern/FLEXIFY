import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const plansCol = await dbConnect("plans");
    const plans = await plansCol.find({}).toArray();
    return NextResponse.json(plans);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, price, duration } = body;

    if (!id) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const plansCol = await dbConnect("plans");

    const result = await plansCol.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          price: Number(price), 
          duration: duration,
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Plan updated successfully" });
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}