import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export interface Exercise {
  _id?: ObjectId;
  id: string;
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

export async function GET(request: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(request.url);
        
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "12");
        const search = searchParams.get("search") || "";
        const muscle = searchParams.get("muscle") || "";
        const level = searchParams.get("level") || "";
        const equipment = searchParams.get("equipment") || "";
        const category = searchParams.get("category") || "";
        const force = searchParams.get("force") || "";

        const skip = (page - 1) * limit;

       
        let query: any = {};
        if (search) {
            query.name = { $regex: search, $options: "i" }; 
        }
        if (muscle) {
            query.primaryMuscles = { $in: [muscle.toLowerCase()] };
        }
        if (level) {
            query.level = level.toLowerCase();
        }
        if (equipment) {
            query.equipment = equipment.toLowerCase();
        }
        if (category) {
            query.category = category.toLowerCase();
        }
        if (force) {
            query.force = force.toLowerCase();
        }
        const collection = await dbConnect<Exercise>("exercises");
        
        const exercises = await collection
            .find(query)
            .skip(skip)
            .limit(limit)
            .toArray();

        const total = await collection.countDocuments(query);

        return Response.json({
            exercises,
            total,
            currentPage: page,
            totalPages: Math.ceil(total / limit)
        }, { status: 200 });

    } catch (error) {
        console.error("Exercise Fetch Error:", error);
        return Response.json(
            { message: "Failed to fetch exercises" },
            { status: 500 }
        );
    }
}