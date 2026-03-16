import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

// Next.js 15 এ params একটি Promise
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // ১. params কে await করে আইডি নিন
    const { id } = await params;

    // ২. আইডি ভ্যালিডেশন
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid Coach ID format" },
        { status: 400 }
      );
    }

    const usersCollection = await dbConnect("users");

    // ৩. ডাটাবেস কোয়েরি
    const coach = await usersCollection.findOne({
      _id: new ObjectId(id),
      role: "coach"
    });

    if (!coach) {
      return NextResponse.json(
        { message: "Coach not found in database" },
        { status: 404 }
      );
    }

    // ৪. পাসওয়ার্ড বাদ দিয়ে ডেটা পাঠানো
    const { password, ...coachData } = coach;

    return NextResponse.json(coachData, { status: 200 });
  } catch (error) {
    console.error("Backend Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}