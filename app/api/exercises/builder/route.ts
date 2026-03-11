import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const level = searchParams.get("level") || "";
    const equipment = searchParams.get("equipment") || "";
    const bodyPart = searchParams.get("bodyPart") || "";

    const collection = await dbConnect("exercises");

    if (search || level || equipment || bodyPart) {
      const query: any = {};
      if (search) query.name = { $regex: search, $options: "i" };
      if (level) query.level = level.toLowerCase();
      if (equipment) query.equipment = equipment.toLowerCase();
      if (bodyPart) {
        if (bodyPart === "back") {
          query.primaryMuscles = { $in: ["back", "lats", "middle back", "lower back"] };
        } else {
          query.primaryMuscles = { $in: [bodyPart.toLowerCase()] };
        }
      }

      const exercises = await collection.find(query).limit(50).toArray();
      return Response.json({ type: "filtered", exercises }, { status: 200 });
    }

  const bodyParts = [
      "chest", "back", "shoulders", "quadriceps", "hamstrings", 
      "glutes", "calves", "biceps", "triceps", "forearms", 
      "abdominals", "traps", "adductors", "abductors"
    ];

    const builderData = await Promise.all(
      bodyParts.map(async (part) => {
        let muscleQuery: any = { primaryMuscles: { $in: [part] } };
        
        if (part === "back") {
          muscleQuery = { primaryMuscles: { $in: ["back", "lats", "middle back", "lower back"] } };
        }

        const count = await collection.countDocuments(muscleQuery);
        const exercises = await collection.find(muscleQuery).limit(5).toArray();

        return {
          part,
          count,
          exercises
        };
      })
    );

    return Response.json({ type: "initial", data: builderData }, { status: 200 });

  } catch (error) {
    console.error("Builder Fetch Error:", error);
    return Response.json({ message: "Failed to fetch builder data" }, { status: 500 });
  }
}