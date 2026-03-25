import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params; // ← await the promise

  const collection = dbConnect("contacts");

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isRead: true } },
  );

  return NextResponse.json({ success: true });
}
