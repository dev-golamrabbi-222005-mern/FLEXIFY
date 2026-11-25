import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { pusherServer } from "@/lib/pusher";

interface Achievement {
  id: string;
  title: string;
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

    const userBadgesDoc = await achievementsColl.findOne<UserAchievementDoc>({
      userEmail: email,
    });
    const currentBadges: Achievement[] = userBadgesDoc?.achievements || [];

    const newUnlocked: Achievement[] = [];

    const hasBadge = (id: string) =>
      currentBadges.some((b: Achievement) => b.id === id);

    const userProfile = await usersColl.findOne({ email });
    const allLogs = await workoutsColl
      .find({ email })
      .sort({ createdAt: -1 })
      .toArray();
    const workoutCount = allLogs.length;
    const dailyLogs = await dailyLogsColl.find({ userEmail: email }).toArray();
    const startedChallenge = await challengeColl.findOne({ userEmail: email });

    const uniqueDates = Array.from(
      new Set(allLogs.map((l) => new Date(l.createdAt).toDateString()))
    ).length;

    const checkAndPush = (id: string, condition: boolean, title: string) => {
      if (condition && !hasBadge(id)) {
        newUnlocked.push({ id, title, unlockedAt: timestamp });
      }
    };

    checkAndPush(
      "profile_complete",
      !!userProfile?.fitnessProfile,
      "Identity Confirmed"
    );
    checkAndPush("first_workout", workoutCount >= 1, "First Step");
    checkAndPush("total_25", workoutCount >= 25, "Elite Athlete");
    checkAndPush("calorie_tracker", dailyLogs.length > 0, "Nutritionist");
    checkAndPush("challenge_starter", !!startedChallenge, "Challenger");
    checkAndPush(
      "early_bird",
      allLogs.some((l) => new Date(l.createdAt).getHours() <= 9),
      "Early Bird"
    );
    checkAndPush(
      "water_master_8",
      dailyLogs.some((log) => log.waterIntake >= 8),
      "Hydration God"
    );

    // --- Streak Achievements ---
    checkAndPush("streak_7", uniqueDates >= 7, "7 Days Streak");
    checkAndPush("streak_30", uniqueDates >= 30, "Habit Former");
    checkAndPush("streak_50", uniqueDates >= 50, "Half-Century");
    checkAndPush("streak_75", uniqueDates >= 75, "Hard 75");
    checkAndPush("streak_100", uniqueDates >= 100, "Centurion");
    checkAndPush("streak_150", uniqueDates >= 150, "Legacy Builder");
    checkAndPush("streak_180", uniqueDates >= 180, "Half-Year");
    checkAndPush("streak_365", uniqueDates >= 365, "1 Year Immortal");
    checkAndPush("streak_730", uniqueDates >= 730, "Two-Year Titan");
    checkAndPush("streak_1825", uniqueDates >= 1825, "5 Year Legend");

    // --- Challenge Specific & Others ---
    const upperBodyProgress = await challengeColl.findOne({
      userEmail: email,
      type: "upper-body",
    });
    checkAndPush(
      "upper_warrior",
      (upperBodyProgress?.completedDays?.length || 0) >= 7,
      "Upper Warrior"
    );

    const lowerBodyProgress = await challengeColl.findOne({
      userEmail: email,
      type: "lower-body",
    });
    checkAndPush(
      "lower_warrior",
      (lowerBodyProgress?.completedDays?.length || 0) >= 7,
      "Leg Legend"
    );

    checkAndPush(
      "challenge_king",
      (startedChallenge?.completedDays?.length || 0) >= 28,
      "Challenge King"
    );
    checkAndPush(
      "water_master_8",
      dailyLogs.some((log) => log.waterIntake >= 8),
      "Hydration God"
    );
    checkAndPush(
      "early_bird",
      allLogs.some((l) => new Date(l.createdAt).getHours() <= 9),
      "Early Bird"
    );

    if (newUnlocked.length > 0) {
      const updatedAchievements = [...currentBadges, ...newUnlocked];

      await achievementsColl.updateOne(
        { userEmail: email },
        {
          $set: {
            achievements: updatedAchievements,
          },
        },
        { upsert: true }
      );

      const userChannelName = `user-${email.replace(/[@.]/g, "-")}`;

      for (const badge of newUnlocked) {
        await pusherServer.trigger(userChannelName, "new-update", {
          message: `🏆 New Achievement: "${badge.title}" unlocked! Check your Hall of Fame.`,
        });
      }

      return NextResponse.json(updatedAchievements);
    }

    return NextResponse.json(currentBadges);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}
