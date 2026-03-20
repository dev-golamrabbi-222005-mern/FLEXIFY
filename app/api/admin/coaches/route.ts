import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { DbUser } from "@/actions/server/auth";

type UserStatus = "pending" | "approved" | "none" | "rejected";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "pending") as UserStatus;
    const collection = dbConnect<DbUser>("users");

    const coaches = await collection
      .find({
        specialties: { $exists: true },
        status,
      })
      .toArray();

    return NextResponse.json(coaches);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch coaches" },
      { status: 500 },
    );
  }
};
