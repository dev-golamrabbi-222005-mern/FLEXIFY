import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const collection = dbConnect("contacts");

  await collection.updateOne(
    { _id: new ObjectId(params.id) },
    { $set: { isRead: true } },
  );

  return NextResponse.json({ success: true });
}
