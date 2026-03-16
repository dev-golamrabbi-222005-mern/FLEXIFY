// app/api/challenges/exercises/route.ts
import { NextRequest, NextResponse } from "next/server";
import { WithId, Document } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { ChallengeType, Level, generatePlan } from "@/lib/challengeUtils";

// ── Raw MongoDB document shape ────────────────────────────────────────────────
interface RawExercise extends WithId<Document> {
  id?: string;
  name?: string;
  sets?: number;
  reps?: number;
  rest?: number;
  instructions?: string;
  images?: string | string[];
  videos?: string;
  video?: string;
  muscles?: string[];
  primaryMuscles?: string[];
  warning?: string;
  target?: string;
  tag?: string;
  level?: string;
}

// ── Normalised shape sent to the client ───────────────────────────────────────
interface NormalisedExercise {
  _id: string;
  id: string;
  name: string;
  sets: number;
  reps: number;
  rest: number;
  instructions: string;
  images: string[];
  videos: string | null;
  muscles: string[];
  warning: string | null;
  target?: string;
  tag?: string;
  level?: string;
}

function normalise(ex: RawExercise): NormalisedExercise {
  return {
    _id: ex._id?.toString() ?? "",
    id: ex.id ?? ex._id?.toString() ?? "",
    name: ex.name ?? "Exercise",
    sets: ex.sets ?? 3,
    reps: ex.reps ?? 10,
    rest: ex.rest ?? 30,
    instructions: ex.instructions ?? "",
    images: Array.isArray(ex.images) ? ex.images : ex.images ? [ex.images] : [],
    videos: ex.videos ?? ex.video ?? null,
    muscles: ex.muscles ?? ex.primaryMuscles ?? [],
    warning: ex.warning ?? null,
    target: ex.target,
    tag: ex.tag,
    level: ex.level,
  };
}

const MUSCLE_MAP: Record<string, string[]> = {
  arm: ["biceps", "triceps", "forearms"],
  chest: ["chest"],
  abs: ["abdominals"],
  shoulder: ["shoulders", "traps"],
  thigh: ["quadriceps", "hamstrings"],
  butt: ["glutes"],
  calfs: ["calves"],
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "upper-body") as ChallengeType;
  const level = (searchParams.get("level") ?? "beginner") as Level;
  const dayNum = parseInt(searchParams.get("day") ?? "1", 10);

  const plan = generatePlan(type);
  const dayPlan = plan.find((d) => d.day === dayNum);

  if (!dayPlan) {
    return NextResponse.json({ error: "Invalid day" }, { status: 400 });
  }

  const { tag, isLightDay } = dayPlan;
  const limit = isLightDay ? 4 : 6;

  try {
    const col = dbConnect<RawExercise>("challenges");

    // Step 1 — strict: target + tag + level
    console.log("[challenges/exercises] querying:", {
      target: type,
      tag,
      level,
    });
    let results = await col
      .find({ target: type, tag, level })
      .limit(limit)
      .toArray();
    console.log("[challenges/exercises] strict match count:", results.length);

    // Step 2 — relax level
    if (results.length < 2) {
      results = await col.find({ target: type, tag }).limit(limit).toArray();
      console.log(
        "[challenges/exercises] relaxed level count:",
        results.length,
      );
    }

    // Step 3 — relax target (just tag)
    if (results.length < 2) {
      results = await col.find({ tag }).limit(limit).toArray();
      console.log("[challenges/exercises] tag only count:", results.length);
    }

    // Step 4 — primaryMuscles fallback
    if (results.length < 2) {
      const muscles = MUSCLE_MAP[tag] ?? [];
      if (muscles.length > 0) {
        results = await col
          .find({ primaryMuscles: { $in: muscles } })
          .limit(limit)
          .toArray();
        console.log(
          "[challenges/exercises] primaryMuscles fallback count:",
          results.length,
        );
      }
    }

    console.log("[challenges/exercises] final count:", results.length);

    return NextResponse.json({
      day: dayNum,
      week: dayPlan.week,
      tag: dayPlan.tag,
      tagLabel: dayPlan.tagLabel,
      tagEmoji: dayPlan.tagEmoji,
      isLightDay,
      level,
      exercises: results.map(normalise),
    });
  } catch (err) {
    console.error("[challenges/exercises] ERROR:", err);
    return NextResponse.json(
      { error: "Server error", detail: String(err) },
      { status: 500 },
    );
  }
}
