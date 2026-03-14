// app/api/challenges/plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { generatePlan, ChallengeType } from "@/lib/challengeUtils";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get("type") ?? "upper-body") as ChallengeType;

  if (type !== "upper-body" && type !== "lower-body") {
    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  }

  const plan = generatePlan(type);
  return NextResponse.json({ plan });
}
