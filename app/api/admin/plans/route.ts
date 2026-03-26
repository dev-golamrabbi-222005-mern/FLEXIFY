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

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const plansCol = await dbConnect("plans");

    await plansCol.deleteOne({ _id: new ObjectId(id!) });
    return NextResponse.json({ message: "Plan deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}