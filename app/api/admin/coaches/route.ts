import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const collection = await dbConnect("users");

    const coaches = await collection
      .find({
        specialties: { $exists: true },
        status: status,
      })
      .toArray();

    return NextResponse.json(coaches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
};

// (Approve/Reject)
export const PATCH = async (req: NextRequest) => {
  try {
    const { id, status } = await req.json();
    const collection = await dbConnect("users");

    const updateDoc = {
      $set: {
        status: status,
        ...(status === "approved" && { role: "coach" }),
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};