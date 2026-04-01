import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { DbUser } from "@/actions/server/auth"; 
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { FitnessProfile, UserGoals } from "@/types/user";
import { pusherServer } from "@/lib/pusher";

function calculateGoals(profile: FitnessProfile): UserGoals {
  if (!profile || !profile.weight || !profile.height || !profile.age) {
    return { 
      calories: 2000, 
      protein: 150, 
      carbs: 250, 
      fats: 70, 
      waterGoal: 8 
    };
  }

  const weight = profile.weight || 60;
  const height = profile.height || 165;
  const age = profile.age || 25;
  const gender = profile.gender || "Male";
  const activityLevel = profile.activityLevel || "Sedentary";
  const waterIntake = profile.waterIntake || 2; 

  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  bmr = gender === "Male" ? bmr + 5 : bmr - 161;

  const multipliers: Record<string, number> = {
    "Sedentary": 1.2,
    "Lightly Active": 1.375,
    "Moderately Active": 1.55,
    "Very Active": 1.725,
  };

  const multiplier = multipliers[activityLevel] || 1.2;
  const calories = Math.round(bmr * multiplier);

  return {
    calories: isNaN(calories) ? 2000 : calories,
    protein: Math.round((calories * 0.3) / 4),
    carbs: Math.round((calories * 0.4) / 4),
    fats: Math.round((calories * 0.3) / 9),
    waterGoal: Math.round(waterIntake * 4) 
  };
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const collection = await dbConnect<DbUser>("users");
    const user = await collection.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const profile = user.fitnessProfile as FitnessProfile;

    const goals = profile ? calculateGoals(profile) : null;

    return NextResponse.json({fitnessProfile: profile || {}, calculatedGoals: goals});
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const email = session.user.email;
    const collection = await dbConnect<DbUser>("users");
  const existingUser = await collection.findOne({ email });
    const result = await collection.updateOne(
      { email: email },
      { 
        $set: { 
          name: session.user.name || body.name, 
          imageUrl: session.user.image || body.imageUrl,
          role: "user", 
          status: "none", 
          fitnessProfile: body, 
          updatedAt: new Date()
        } 
      },
      { upsert: true }
    );

    if (result.matchedCount > 0 || result.upsertedCount > 0) {
      const userChannel = `user-${email.replace(/[@.]/g, "-")}`;
      await pusherServer.trigger(userChannel, "new-update", {
        message: `🔥 Welcome to Flexify, ${name}! Your fitness journey starts now. Let's hit those goals!`,
      });

      if (result.upsertedCount > 0 || !existingUser?.fitnessProfile) {
        await pusherServer.trigger("admin-updates", "new-payment", { // আপনি চাইলে ইভেন্ট নাম 'new-user' ও দিতে পারেন
          message: `👤 New Member Joined: ${name} (${email}) has just set up their fitness profile!`,
        });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: "Profile saved successfully!" 
      });
    }

    return NextResponse.json({ message: "Failed to save profile" }, { status: 400 });

  } catch (error: unknown) {
    console.error("FITNESS_PROFILE_ERROR:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
