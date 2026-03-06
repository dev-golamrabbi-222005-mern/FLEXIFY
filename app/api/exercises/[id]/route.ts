import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

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

// FIXED: params must be a Promise in Next.js 15
interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams, // This now correctly matches Next.js expectation
): Promise<Response> {
  try {
    const collection = await dbConnect<Exercise>("exercises");

    // Awaiting here is correct, but the type above must match
    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return Response.json({ message: "Invalid ObjectId" }, { status: 400 });
    }

    const query = { _id: new ObjectId(id) };
    const result = await collection.findOne(query);

    if (!result) {
      return Response.json({ message: "Exercise not found" }, { status: 404 });
    }

    return Response.json(
      {
        ...result,
        _id: result._id?.toString(), // Use optional chaining to be safe
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    return Response.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
