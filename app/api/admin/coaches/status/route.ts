import { dbConnect } from "@/lib/dbConnect";
import { DbUser } from "@/actions/server/auth";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest) => {
  try {
    const { id, status } = await req.json();
    const collection = await dbConnect<DbUser>("users");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: status,
          role: status === "approved" ? "coach" : "user",
          updatedAt: new Date()
        }
      }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
};