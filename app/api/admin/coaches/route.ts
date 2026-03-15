import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { DbUser } from "@/actions/server/auth";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const collection = await dbConnect<DbUser>("users");

    const coaches = await collection
      .find({
        specialties: { $exists: true },
        status: status
      })
      .toArray();

    return NextResponse.json(coaches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coaches" }, { status: 500 });
  }
};