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
    
    const formattedCoaches = coaches.map(c => ({
      ...c,
      messages: c.messages || [] 
    }));

    return NextResponse.json(formattedCoaches);
  }

  if (coachId) {
    const trainees = await coachUsersCol
      .find({ coachId }) 
      .toArray();

    const formattedTrainees = trainees.map(t => ({
      ...t,
      messages: t.messages || []
    }));

    return NextResponse.json(formattedTrainees);
  }

  return NextResponse.json(
    { error: "Missing coachId or userId" },
    { status: 400 },
  );
}