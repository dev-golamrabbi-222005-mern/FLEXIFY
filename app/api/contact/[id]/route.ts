import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }, // 👈 1. Update the type to a Promise
) {
  try {
    // 👈 2. Await the params to extract the ID safely
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    // Only update status and repliedAt
    const updateDoc: Record<string, unknown> = {};
    if (body.status === "replied") {
      updateDoc.status = "replied";
      updateDoc.repliedAt = new Date();
    }

    const collection = await dbConnect("contacts");
    await collection.updateOne(
      { _id: new ObjectId(id) }, // 👈 3. Use the extracted id
      { $set: updateDoc },
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 },
    );
  }
}
