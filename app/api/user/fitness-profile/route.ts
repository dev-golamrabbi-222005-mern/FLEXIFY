import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { DbUser } from "@/actions/server/auth"; 
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect<DbUser>("users");
    const user = await collection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user.fitnessProfile || {});
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const email = session.user.email;
    const collection = await dbConnect<DbUser>("users");

    const result = await collection.updateOne(
      { email: email },
      { 
        $set: { 
          name: session.user.name || body.name, 
          imageUrl: session.user.image || body.imageUrl,
          role: "user", 
          status: "none", 
          fitnessProfile: body, 
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    if (result.matchedCount > 0 || result.upsertedCount > 0) {
      return NextResponse.json({ 
        success: true, 
        message: "Profile saved successfully!" 
      });
    }

    return NextResponse.json({ message: "Failed to save profile" }, { status: 400 });

  } catch (error: unknown) {
    console.error("FITNESS_PROFILE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
