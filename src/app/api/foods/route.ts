import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 
import { FoodItem } from "@/types/food";
import { sanitizeRegex } from "@/lib/security/sanitize";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const safeQuery = sanitizeRegex(query.trim());

    const collection = dbConnect<FoodItem>("nutritions");

    const foods = await collection
      .find(safeQuery ? { name: { $regex: safeQuery, $options: "i" } } : {})
      .limit(10)
      .toArray();

    return NextResponse.json({ foods });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch foods" },
      { status: 500 },
    );
  }
}
