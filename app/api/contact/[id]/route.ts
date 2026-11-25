import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/adminGuard";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const updateDoc: Record<string, unknown> = {
      updatedAt: new Date(),
    };
    if (body.status === "replied") {
      updateDoc.status = "replied";
      updateDoc.repliedAt = new Date();
    } else if (body.status) {
      updateDoc.status = body.status;
    }

    const collection = await dbConnect("contacts");
    await collection.updateOne(
      { _id: new ObjectId(id) },
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
