// app/api/coach-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");
  const coachId = url.searchParams.get("coachId");

  const coachUsersCol = await dbConnect("coach_users");

  if (userId) {
    // Find coach_users where userId matches and status is approved
    const coachUserDocs = await coachUsersCol
      .find({ userId, status: "approved" })
      .toArray();

    if (coachUserDocs.length === 0) {
      return NextResponse.json([]);
    }

    // Get coachIds
    const coachIds = coachUserDocs.map(doc => doc.coachId);

    // Fetch coaches where _id in coachIds and status is approved
    const coachesCol = await dbConnect("users");
    const coaches = await coachesCol
      .find({ _id: { $in: coachIds.map(id => new ObjectId(id)) }, status: "approved" })
      .project({ name: 1, phone: 1, email: 1, imageUrl: 1, status: 1 })
      .toArray();

    return NextResponse.json(coaches);
  }

  if (coachId) {
    // Find coach_users where coachId matches
    const coachUserDocs = await coachUsersCol
      .find({ coachId })
      .toArray();

    if (coachUserDocs.length === 0) {
      return NextResponse.json([]);
    }

    // Get userIds
    const userIds = coachUserDocs.map(doc => doc.userId);

    // Fetch users where _id in userIds
    const usersCol = await dbConnect("users");
    const users = await usersCol
      .find({ _id: { $in: userIds.map(id => new ObjectId(id)) } })
      .project({ name: 1, phone: 1, email: 1, imageUrl: 1, status: 1 })
      .toArray();

    // Create a map for quick lookup
    const userMap = new Map(users.map(u => [u._id.toString(), u]));

    // Merge coachUserDocs with user data
    const result = coachUserDocs.map(cu => {
      const user = userMap.get(cu.userId);
      return {
        ...cu,
        name: user?.name,
        email: user?.email,
        phone: user?.phone,
        imageUrl: user?.imageUrl,
        userStatus: user?.status,
      };
    });

    return NextResponse.json(result);
  }

  return NextResponse.json(
    { error: "Missing coachId or userId" },
    { status: 400 },
  );
}
