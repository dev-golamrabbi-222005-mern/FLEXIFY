import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { pusherServer } from "@/lib/pusher";

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
const user = await collection.findOne({ _id: new ObjectId(id) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
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
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
};