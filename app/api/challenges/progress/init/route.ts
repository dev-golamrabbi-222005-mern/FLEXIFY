// app/api/challenges/progress/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Not logged in — level is cached in localStorage on client side, that's fine
    if (!session?.user?.email) {
      return NextResponse.json({ success: true, saved: false });
    }

    const { type, level } = await req.json();

    if (!type || !level) {
      return NextResponse.json(
        { error: "Missing type or level" },
        { status: 400 },
      );
    }

    const progress = dbConnect("challenge_progress");

    const existing = await progress.findOne({
      userEmail: session.user.email,
      type,
    });

    // Only insert if no record yet — never overwrite existing level/progress
    if (!existing) {
      await progress.insertOne({
        userEmail: session.user.email,
        type,
        level,
        startedAt: new Date(),
        completedDays: [],
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ success: true, saved: !existing });
  } catch (err) {
    console.error("[challenges/progress/init]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
