import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const collection = await dbConnect("users");

    const query = { 
        specialties: { $exists: true },
        ...(status && { status }) 
    };

    const coaches = await collection.find(query).toArray();
    return NextResponse.json(coaches);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
};

export const PATCH = async (req: NextRequest) => {
  try {
    const { id, status } = await req.json();
    const collection = await dbConnect("users");

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
            status, 
            updatedAt: new Date(),
            ...(status === "approved" && { role: "coach" })
        } 
      }
    );

    return NextResponse.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};