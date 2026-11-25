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
    const status = searchParams.get("status");
    const collection = await dbConnect("users");

    const query = { 
        specialties: { $exists: true },
        ...(status && { status }) 
    };

    const coaches = await collection.find(query, { projection: { password: 0 } }).toArray();
    return NextResponse.json(coaches);
  } catch (error) {
    console.error("Fetch Coaches Status Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
};

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
    const result = await collection.updateOne(
      { _id: safeId },
      { 
        $set: { 
            status, 
            updatedAt: new Date(),
            ...(status === "approved" && { role: "coach" })
        } 
      }
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

    return NextResponse.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    console.error("Coach Status Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};
