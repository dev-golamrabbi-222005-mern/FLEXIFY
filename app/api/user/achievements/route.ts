import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

interface Achievement {
  id: string;
  unlockedAt: string;
}

interface UserAchievementDoc {
  userEmail: string;
  achievements: Achievement[];
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json([], { status: 401 });

    const email = session.user.email;
    const timestamp = new Date().toISOString();

    const achievementsColl = await dbConnect("user-achievements");
    const workoutsColl = await dbConnect("workout_logs");
    const usersColl = await dbConnect("users");
    const dailyLogsColl = await dbConnect("daily-logs");
    const challengeColl = await dbConnect("challenge_progress");

    const userBadgesDoc = await achievementsColl.findOne<UserAchievementDoc>({ userEmail: email });
    const currentBadges: Achievement[] = userBadgesDoc?.achievements || [];
    
    const newUnlocked: Achievement[] = [];
    
    const hasBadge = (id: string) => currentBadges.some((b: Achievement) => b.id === id);

    const userProfile = await usersColl.findOne({ email });
    const allLogs = await workoutsColl.find({ email }).sort({ createdAt: -1 }).toArray();
    const workoutCount = allLogs.length;
    const dailyLogs = await dailyLogsColl.find({ userEmail: email }).toArray();
    const startedChallenge = await challengeColl.findOne({ userEmail: email });

    const uniqueDates = Array.from(new Set(allLogs.map(l => new Date(l.createdAt).toDateString()))).length;

    const checkAndPush = (id: string, condition: boolean) => {
      if (condition && !hasBadge(id)) {
        newUnlocked.push({ id, unlockedAt: timestamp });
      }
    };

    checkAndPush("profile_complete", !!userProfile?.fitnessProfile);
    checkAndPush("first_workout", workoutCount >= 1);
    checkAndPush("total_25", workoutCount >= 25);
    checkAndPush("calorie_tracker", dailyLogs.length > 0);
    checkAndPush("challenge_starter", !!startedChallenge);

    checkAndPush("streak_7", uniqueDates >= 7);
    checkAndPush("streak_30", uniqueDates >= 30);
    checkAndPush("streak_50", uniqueDates >= 50);
    checkAndPush("streak_75", uniqueDates >= 75);
    checkAndPush("streak_100", uniqueDates >= 100);
    checkAndPush("streak_150", uniqueDates >= 150);
    checkAndPush("streak_180", uniqueDates >= 180);
    checkAndPush("streak_365", uniqueDates >= 365);
    checkAndPush("streak_730", uniqueDates >= 730);
    checkAndPush("streak_1825", uniqueDates >= 1825);

    const upperWeek1 = await challengeColl.findOne({ userEmail: email, type: "upper-body" });
    checkAndPush("upper_warrior", (upperWeek1?.completedDays?.length || 0) >= 7);
    
    const lowerWeek1 = await challengeColl.findOne({ userEmail: email, type: "lower-body" });
    checkAndPush("lower_warrior", (lowerWeek1?.completedDays?.length || 0) >= 7);
    
    checkAndPush("challenge_king", (startedChallenge?.completedDays?.length || 0) >= 28);
    checkAndPush("water_master_8", dailyLogs.some(log => log.waterIntake >= 8));
    checkAndPush("early_bird", allLogs.some(l => new Date(l.createdAt).getHours() <= 9));

    if (newUnlocked.length > 0) {
    const updatedAchievements = [...currentBadges, ...newUnlocked];

      await achievementsColl.updateOne(
        { userEmail: email },
        { 
          $set: { 
            achievements: updatedAchievements 
          } 
        },
        { upsert: true }
      );

      return NextResponse.json(updatedAchievements);
    }

    return NextResponse.json(currentBadges);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}