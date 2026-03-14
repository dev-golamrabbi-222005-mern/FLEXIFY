import { DbUser } from "@/actions/server/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const collection = await dbConnect<DbUser>("users");

    const coachPayload: Partial<DbUser> = {
      ...body,
      role: "user", 
      status: "pending",
      isProfileComplete: true,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { email: body.email },
      { $set: coachPayload },
      { upsert: true }
    );

    return Response.json({ success: true, message: "Application submitted" });
  } catch (error) {
    return Response.json({ message: "Error processing request" }, { status: 500 });
  }
}