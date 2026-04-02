import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Filter, Document, Sort } from "mongodb";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const specialty = searchParams.get("specialty") || "";
    const experience = searchParams.get("experience") || "";
    const trainingType = searchParams.get("trainingType") || "";
    const sort = searchParams.get("sort") || "";

    const usersColl = await dbConnect("users");

    // ✅ Filter
    const filter: Filter<Document> = {
      role: "coach",
      status: "approved",
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (specialty) {
      filter.specialties = specialty;
    }

    if (experience) {
      if (experience === "0-2 Years") {
        filter.experienceYears = { $lte: 2 };
      } else if (experience === "3-5 Years") {
        filter.experienceYears = { $gte: 3, $lte: 5 };
      } else if (experience === "5+ Years") {
        filter.experienceYears = { $gt: 5 };
      }
    }

    if (trainingType) {
      filter.trainingTypes = { $in: [trainingType] };
    }

    // ✅ Sorting (NO any)
    let sortOption: Sort = {};

    if (sort === "price_low") sortOption = { "pricing.monthly": 1 };
    else if (sort === "price_high") sortOption = { "pricing.monthly": -1 };
    else if (sort === "experience_high") sortOption = { experienceYears: -1 };
    else if (sort === "experience_low") sortOption = { experienceYears: 1 };

    // ✅ Final query (filter + sort)
    const coaches = await usersColl.find(filter).sort(sortOption).toArray();

    return NextResponse.json(coaches);
  } catch (error) {
    console.error("COACH FETCH ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch coaches" },
      { status: 500 },
    );
  }
};
