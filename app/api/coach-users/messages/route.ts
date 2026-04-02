import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId, UpdateFilter } from "mongodb";
import { v4 as uuidv4 } from "uuid";

interface IMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  isEdited: boolean;
  isDeleted: boolean;
}

interface ICoachUser {
  _id: ObjectId;
  coachId: string;
  userId: string;
  messages: IMessage[];
  status: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const coachUserId = searchParams.get("coachUserId");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!coachUserId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    const coachUsersCol = await dbConnect<ICoachUser>("coach_users");
    const result = await coachUsersCol.findOne(
      { _id: new ObjectId(coachUserId) },
      { projection: { messages: { $slice: [-(skip + limit), limit] } } }
    );

    return NextResponse.json(result?.messages || []);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { coachUserId, senderId, text }: { coachUserId: string; senderId: string; text: string } = await req.json();
    const coachUsersCol = await dbConnect<ICoachUser>("coach_users");

    const newMessage: IMessage = {
      id: uuidv4(),
      senderId,
      text,
      createdAt: new Date().toISOString(),
      isEdited: false,
      isDeleted: false,
    };

    await coachUsersCol.updateOne(
      { _id: new ObjectId(coachUserId) },
      { $push: { messages: newMessage } } as UpdateFilter<ICoachUser>
    );

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: "Send failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { coachUserId, messageId, action, text }: { coachUserId: string; messageId: string; action: "edit" | "deleteEveryone"; text?: string } = await req.json();
    const coachUsersCol = await dbConnect<ICoachUser>("coach_users");

    const updateQuery = action === "edit" 
      ? { $set: { "messages.$.text": text, "messages.$.isEdited": true } }
      : { $set: { "messages.$.text": "This message was deleted", "messages.$.isDeleted": true } };

    await coachUsersCol.updateOne(
      { _id: new ObjectId(coachUserId), "messages.id": messageId },
      updateQuery as UpdateFilter<ICoachUser>
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}