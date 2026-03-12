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
    const isGlobalSearch = !!(search || level || equipment);

   if (isGlobalSearch) {
    const query: any = {};
    if (search) query.name = { $regex: search, $options: "i" };
    if (level) query.level = level.toLowerCase();
    if (equipment) query.equipment = equipment.toLowerCase();
    
    if (bodyPart) {
        const parts = bodyPart === "back" ? ["back", "lats", "middle back", "lower back"] : [bodyPart.toLowerCase()];
        query.primaryMuscles = { $in: parts };
    }

    const exercises = await collection.find(query).toArray();
    const totalResults = exercises.length;

const dynamicStats = await collection.aggregate([
  { $match: query },
  {
    $facet: {
      equipmentCounts: [{ $group: { _id: "$equipment", count: { $sum: 1 } } }],
      levelCounts: [{ $group: { _id: "$level", count: { $sum: 1 } } }],
      muscleCounts: [
        { $unwind: "$primaryMuscles" },
        { $group: { _id: "$primaryMuscles", count: { $sum: 1 } } }
      ]
    }
  }
]).toArray();
    return Response.json({ 
        type: "filtered", 
        exercises, 
        stats: dynamicStats[0],
        totalResults,
        hasMore: false 
    }, { status: 200 });
}
  const bodyParts = [
      "chest", "back", "shoulders", "quadriceps", "hamstrings", 
      "glutes", "calves", "biceps", "triceps", "forearms", 
      "abdominals", "traps", "adductors", "abductors"
    ];
 const globalStats = await collection.aggregate([
      {
        $facet: {
          equipmentCounts: [{ $group: { _id: "$equipment", count: { $sum: 1 } } }],
          levelCounts: [{ $group: { _id: "$level", count: { $sum: 1 } } }]
        }
      }
    ]).toArray();
    const builderData = await Promise.all(
      bodyParts.map(async (part) => {
        let muscleQuery: any = { primaryMuscles: { $in: [part] } };
        
        if (part === "back") {
          muscleQuery = { primaryMuscles: { $in: ["back", "lats", "middle back", "lower back"] } };
        }

        const count = await collection.countDocuments(muscleQuery);

const exercises = await collection.find(muscleQuery).toArray();
        return {
          part,
          count,
          exercises
        };
      })
    );

    return Response.json({ type: "initial", data: builderData , stats: globalStats[0], totalResults: 0, hasMore: false}, { status: 200 });

  } catch (error) {
    console.error("Builder Fetch Error:", error);
    return Response.json({ message: "Failed to fetch builder data" }, { status: 500 });
  }
}