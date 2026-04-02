// app/api/coach-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const coachId = url.searchParams.get("coachId");

    const coachUsersCol = await dbConnect("coach_users");
    const usersCol = await dbConnect("users");

    if (userId) {
      const coachUserDocs = await coachUsersCol
        .find({ userId, status: "approved" })
        .toArray();

      if (coachUserDocs.length === 0) return NextResponse.json([]);

      const result = await Promise.all(
        coachUserDocs.map(async (doc) => {
          const coachData = await usersCol.findOne({ 
            _id: new ObjectId(doc.coachId) 
          });
          return {
            ...doc,
            coachName: coachData?.name,
            coachEmail: coachData?.email,
            coachImage: coachData?.imageUrl,
            messages: doc.messages || [],
          };
        })
      );

      return NextResponse.json(result);
    }

    if (coachId) {
      const coachUserDocs = await coachUsersCol
        .find({ coachId })
        .toArray();

      if (coachUserDocs.length === 0) return NextResponse.json([]);

      const result = await Promise.all(
        coachUserDocs.map(async (doc) => {
          const userData = await usersCol.findOne({ 
            _id: new ObjectId(doc.userId) 
          });
          return {
            ...doc,
            userName: userData?.name,
            userEmail: userData?.email,
            userImage: userData?.imageUrl,
            messages: doc.messages || [],
          };
        })
      );

      return NextResponse.json(result);
    }

    return NextResponse.json(
      { error: "Missing coachId or userId" },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}