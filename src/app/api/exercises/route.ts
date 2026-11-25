// app/api/exercises/route.ts
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const level = searchParams.get("level") || "";
    const muscle = searchParams.get("muscle") || "";
    const equipment = searchParams.get("equipment") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const collection = dbConnect("exercises");

    const filter: Record<string, unknown> = {};
    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = { $regex: category, $options: "i" };
    if (level) filter.level = { $regex: level, $options: "i" };
    if (muscle)
      filter.primaryMuscles = { $elemMatch: { $regex: muscle, $options: "i" } };
    if (equipment) filter.equipment = { $regex: equipment, $options: "i" };

    const hasFilter = Object.keys(filter).length > 0;

    const [exercises, total] = await Promise.all([
      collection
        .find(filter)
        .project({
          name: 1,
          category: 1,
          level: 1,
          primaryMuscles: 1,
          equipment: 1,
          images: 1,
          id: 1,
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .toArray(),
      hasFilter
        ? collection.countDocuments(filter)
        : collection.estimatedDocumentCount(),
    ]);

    // Ensure every exercise has a usable `id` field for routing
    const normalized = exercises.map((ex) => ({
      ...ex,
      // Use existing `id` string field, fall back to string version of _id
      id: (ex as { id?: string; _id?: { toString(): string } }).id ?? ex._id?.toString(),
    }));

    return NextResponse.json(
      {
        exercises: normalized,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (err) {
    console.error("Exercises fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch exercises", detail: String(err) },
      { status: 500 },
    );
  }
}
