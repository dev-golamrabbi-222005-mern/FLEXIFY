import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

interface IReview {
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

interface IUser {
  _id?: ObjectId;
  role: string;
  reviews?: IReview[];
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { coachId, userId, userName, rating, comment } = body as {
      coachId: string;
      userId: string;
      userName: string;
      rating: number;
      comment: string;
    };

    if (!coachId || !rating) {
      return NextResponse.json({ error: "Required data missing" }, { status: 400 });
    }

    const usersCol = await dbConnect<IUser>("users");

    const result = await usersCol.updateOne(
      { 
        _id: new ObjectId(coachId), 
        role: "coach" 
      },
      {
        $push: {
          reviews: {
            userId,
            userName,
            rating: Number(rating),
            comment,
            createdAt: new Date(),
          },
        },
      }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: "Coach not found or update failed" }, { status: 404 });
    }

    return NextResponse.json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Review Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}