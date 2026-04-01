// app/api/challenges/progress/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { ChallengeType } from "@/lib/challengeUtils";
import { pusherServer } from "@/lib/pusher";

// ── GET: fetch user's progress for a challenge ────────────────────────────────
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") as ChallengeType;

  const progress = dbConnect("challenge_progress");
  const record = await progress.findOne({
    userEmail: session.user.email,
    type,
  });

  return NextResponse.json({ progress: record ?? null });
}

// ── POST: save a completed day ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      type,
      level,
      day,
      week,
      tag,
      durationSecs,
      caloriesBurned,
      exercisesDone,
    } = body;

    const progress = dbConnect("challenge_progress") as any;
    const now = new Date();

    const dayRecord = {
      level,
      day,
      week,
      tag,
      completedAt: now,
      durationSecs,
      caloriesBurned,
      exercisesDone,
    };

    // Upsert: create record if first time, otherwise push day into completedDays
    const existing = await progress.findOne({
      userEmail: session.user.email,
      type,
      level,
    });

    if (!existing) {
      await progress.insertOne({
        userEmail: session.user.email,
        type,
        level,
        startedAt: now,
        completedDays: [dayRecord],
        updatedAt: now,
      });
    } else {
      // Replace if day already exists (re-do), otherwise push
      const alreadyDone = existing.completedDays?.some(
        (d: any) => d.day === day,
      );
      if (alreadyDone) {
        await progress.updateOne(
          { userEmail: session.user.email, type },
          {
            $set: {
              "completedDays.$[elem]": dayRecord,
              updatedAt: now,
            },
          },
          { arrayFilters: [{ "elem.day": day }] },
        );
      } else {
        await progress.updateOne(
          { userEmail: session.user.email, type },
          {
            $push: { completedDays: dayRecord },
            $set: { updatedAt: now },
          },
        );
      }
    }

    // Also write to user's exercise history in users collection
    const users = dbConnect("users");
    await (users as any).updateOne(
      { email: session.user.email },
      {
        $push: {
          exerciseHistory: {
            type: `challenge_${type}`,
            level,
            day,
            week,
            tag,
            completedAt: now,
            durationSecs,
            caloriesBurned,
          },
        },
        $set: { updatedAt: now },
      },
    );

    const userChannelName = `user-${session.user.email.replace(/[@.]/g, "-")}`;
    
    const displayType = type === "upper-body" ? "Upper Body" : "Lower Body";
    const notificationMessage = `Day ${day} Completed! You finished the ${displayType} Challenge (${level}). Keep crushing it! 🔥`;

    await pusherServer.trigger(userChannelName, "new-update", {
      message: notificationMessage,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[challenges/progress]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
