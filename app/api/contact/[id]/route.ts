import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// In Next.js 15, the second argument (context) MUST have params as a Promise
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  // You MUST await the params before using them
  const { id } = await params;

  const collection = dbConnect("contacts");

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isRead: true } },
  );

  return NextResponse.json({ success: true });
}
