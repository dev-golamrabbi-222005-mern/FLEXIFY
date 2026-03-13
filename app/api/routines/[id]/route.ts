import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> } // Next.js 15+ এ params একটি Promise
) {
  try {
    const { id } = await params;
    const routineCol = await dbConnect("user_routines"); // আপনার কালেকশন নাম
    const exerciseCol = await dbConnect("exercises");

    // ১. চেক করা: এটি কি হার্ডকোড করা সাজেস্টেড প্ল্যান (beginner, intermediate, advanced)?
    const suggestedPlans: Record<string, string[]> = {
      beginner: ["Pushups", "One-Arm Dumbbell Row", "Dumbbell Shoulder Press", "Bodyweight Squat", "Dumbbell Deadlift", "3/4 Sit-Up"],
      intermediate: ["Barbell Squat", "Barbell Bench Press - Medium Grip", "One-Arm Dumbbell Row", "Dumbbell Shoulder Press", "Zottman Curl", "Dumbbell Triceps Extension", "Knee/Hip Raise On Parallel Bars"],
      advanced: ["Dumbbell Bench Press", "Weighted Pull Ups", "Bent Over Barbell Row", "Clean and Press", "Barbell Squat", "Barbell Deadlift", "Zottman Preacher Curl", "Dumbbell Triceps Extension", "Ab Roller"]
    };

    if (suggestedPlans[id]) {
      const names = suggestedPlans[id];
      const exercises = await exerciseCol.find({ name: { $in: names } }).toArray();
      return NextResponse.json({
        success: true,
        data: { planName: id.toUpperCase() + " PLAN", exercises }
      });
    }

    // ২. চেক করা: এটি কি মঙ্গোডিবি আইডি (যেমন: 69b2d786...)?
    if (ObjectId.isValid(id)) {
      const routine = await routineCol.findOne({ _id: new ObjectId(id) });
      
      if (routine) {
        return NextResponse.json({ success: true, data: routine });
      }
    }

    // যদি কোনোটিই না মেলে
    return NextResponse.json({ message: "Routine Not Found in DB" }, { status: 404 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}