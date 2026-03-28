import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId, Filter, Document } from "mongodb";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const specialty = searchParams.get("specialty") || "";
    const experience = searchParams.get("experience") || "";
    const trainingType = searchParams.get("trainingType") || "";

    const usersColl = await dbConnect("users");

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

    // ৫+ বছর এবং অন্যান্য এক্সপেরিয়েন্স ফিক্স
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

    const coaches = await usersColl.find(filter).toArray();

    return NextResponse.json(coaches);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
};