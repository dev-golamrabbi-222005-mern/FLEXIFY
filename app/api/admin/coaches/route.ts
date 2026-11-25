import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { pusherServer } from "@/lib/pusher";
import { requireAdmin } from "@/lib/adminGuard";
import { toSafeObjectId } from "@/lib/security/sanitize";

export const GET = async (req: NextRequest) => {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "pending";
    const collection = await dbConnect("users");

    const coaches = await collection
      .find(
        {
          specialties: { $exists: true },
          status: status,
        },
        { projection: { password: 0 } }
      )
      .toArray();

    return NextResponse.json(coaches);
  } catch (error) {
    console.error("Fetch Coaches Error:", error);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
};

// (Approve/Reject)
export const PATCH = async (req: NextRequest) => {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const { id, status } = await req.json();
    const safeId = toSafeObjectId(id);
    if (!safeId || !status) {
      return NextResponse.json({ error: "Missing or invalid required fields (id, status)" }, { status: 400 });
    }

    const collection = await dbConnect("users");
    const user = await collection.findOne({ _id: safeId });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updateDoc = {
      $set: {
        status: status,
        ...(status === "approved" && { role: "coach" }),
        updatedAt: new Date(),
      },
    };

    const result = await collection.updateOne(
      { _id: safeId },
      updateDoc
    );

    if (result.modifiedCount > 0) {
      const channelName = `user-${user.email.replace(/[@.]/g, "-")}`;
      
      const message = status === "approved" 
        ? "Congratulations! Your coach application has been approved." 
        : `Your application status has been updated to: ${status}`;

      await pusherServer.trigger(channelName, "new-update", {
        message: message,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update Coach Status Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};
