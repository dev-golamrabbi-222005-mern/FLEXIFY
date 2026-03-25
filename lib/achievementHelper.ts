import { dbConnect } from "@/lib/dbConnect";

interface AchievementEntry {
  id: string;
  unlockedAt: Date;
}

interface UserAchievementDocument {
  userEmail: string;
  achievements: AchievementEntry[];
}

export async function unlockAchievement(email: string, achievementId: string) {
  const collection = await dbConnect<UserAchievementDocument>("user-achievements");
  
  const existing = await collection.findOne({
    userEmail: email,
    "achievements.id": achievementId
  });

  if (!existing) {
    await collection.updateOne(
      { userEmail: email },
      { 
        $push: { 
          achievements: { 
            id: achievementId, 
            unlockedAt: new Date() 
          } 
        } 
      },
      { upsert: true }
    );
    return true; 
  }
  return false;
}