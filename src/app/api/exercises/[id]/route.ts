// app/api/exercises/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Next.js 15 — params must be awaited
    const { id } = await params;

    const collection = dbConnect("exercises");

    // Try string `id` field first (e.g. "Ankle_On_The_Knee")
    let exercise = await collection.findOne({ id });

    // Fallback: try MongoDB ObjectId if the above returns nothing
    if (!exercise && ObjectId.isValid(id)) {
      exercise = await collection.findOne({ _id: new ObjectId(id) });
    }

    if (!exercise) {
      return NextResponse.json(
        { error: "Exercise not found", queriedId: id },
        { status: 404 },
      );
    }

    return NextResponse.json({ exercise });
  } catch (err) {
    console.error("Exercise fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch exercise", detail: String(err) },
      { status: 500 },
    );
  }
}
