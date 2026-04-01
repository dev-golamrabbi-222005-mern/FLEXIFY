// app/api/coach-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const coachId = url.searchParams.get("coachId");

  const coachUsersCol = await dbConnect("coach_users");

  if (userId) {
    const coaches = await coachUsersCol
      .find({ userId, status: "approved" })
      .toArray();
    return NextResponse.json(coaches);
  }

  if (coachId) {
    const trainees = await coachUsersCol.find({ coachId }).toArray();
    return NextResponse.json(trainees);
  }

  return NextResponse.json(
    { error: "Missing coachId or userId" },
    { status: 400 },
  );
}
