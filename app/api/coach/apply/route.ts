import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const collection = await dbConnect("users"); 

    const coachPayload = {
      ...body,
      email: session.user.email, 
      role: "", 
      status: "pending",
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { email: session.user.email },
      { $set: coachPayload },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Application submitted" });
  } catch (error) {
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}