import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }, // 1. Removed Promise wrapper
) {
  // 2. Removed 'await' because params is a plain object in Next.js 14
  const { id } = params;

  const collection = dbConnect("contacts");

  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { isRead: true } },
  );

  return NextResponse.json({ success: true });
}
