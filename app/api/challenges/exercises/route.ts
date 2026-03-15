// app/api/challenges/exercises/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ChallengeType, Level, Tag, generatePlan } from "@/lib/challengeUtils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "upper-body") as ChallengeType;
  const level = (searchParams.get("level") ?? "beginner") as Level;
  const dayNum = parseInt(searchParams.get("day") ?? "1", 10);

  // ── Find what tag this day maps to ────────────────────────────────────────
  const plan = generatePlan(type);
  const dayPlan = plan.find((d) => d.day === dayNum);

  if (!dayPlan) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const { tag, isLightDay } = dayPlan;

  try {
    const exercises = dbConnect("exercises");

    // ── Query: match target + tag + level ─────────────────────────────────
    const targetValue = type; // "upper-body" or "lower-body"

    // Map level "advance" to "advanced" if your db uses that
    const dbLevel = level === "advance" ? "advance" : level;

    // Limit to fewer exercises on light day (day 7)
    const limit = isLightDay ? 4 : 6;

    const results = await exercises
      .find({
        target: targetValue,
        tag: tag,
        level: dbLevel,
      })
      .limit(limit)
      .toArray();

    // ── Fallback: if not enough exercises, relax level filter ─────────────
    let finalResults = results;
    if (results.length < 3) {
      finalResults = await exercises
        .find({ target: targetValue, tag })
        .limit(limit)
        .toArray();
    }

    return NextResponse.json({
      day: dayNum,
      week: dayPlan.week,
      tag: dayPlan.tag,
      tagLabel: dayPlan.tagLabel,
      tagEmoji: dayPlan.tagEmoji,
      isLightDay,
      level,
      exercises: finalResults.map((ex) => ({
        ...ex,
        _id: ex._id?.toString(),
      })),
    });
  } catch (err) {
    console.error("[challenges/exercises]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
