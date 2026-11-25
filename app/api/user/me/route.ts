import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";

interface UserDoc {
  _id?: string;
  email: string;
  role: string;
  status?: string;
  name?: string;
  image?: string;
  imageUrl?: string;
  phone?: string;
  bio?: string;
  fullName?: string;
  location?: string;
  specialties?: string;
  experienceYears?: number;
  education?: string;
  trainingTypes?: string[];
  availableDays?: string[];
  preferredClients?: string[];
  languages?: string;
  maxClients?: number;
  isProfileComplete?: boolean;
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const emailFromQuery = searchParams.get("email");

    // Only administrators can query another user's profile by email
    let targetEmail = session.user.email;
    if (emailFromQuery && emailFromQuery !== session.user.email) {
      if (session.user.role === "admin") {
        targetEmail = emailFromQuery;
      } else {
        return NextResponse.json(
          { message: "Forbidden: Cannot access other user profiles" },
          { status: 403 }
        );
      }
    }

    const usersCollection = await dbConnect<UserDoc>("users");
    // Explicitly exclude password hash from the projection
    const user = await usersCollection.findOne(
      { email: targetEmail },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching user:", errorMessage);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Whitelist allowed profile fields to prevent privilege escalation (OWASP Mass Assignment)
    const allowedFields = [
      "name",
      "fullName",
      "phone",
      "imageUrl",
      "bio",
      "location",
      "specialties",
      "experienceYears",
      "education",
      "trainingTypes",
      "availableDays",
      "preferredClients",
      "languages",
      "pricing",
      "maxClients",
      "isProfileComplete",
      "fitnessProfile",
    ];

    const safeUpdate: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    for (const key of allowedFields) {
      if (key in body) {
        safeUpdate[key] = body[key];
      }
    }

    const result = await dbConnect("users").updateOne(
      { email: session.user.email },
      { $set: safeUpdate }
    );

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Update failed";
    console.error("User profile update error:", errorMessage);
    return NextResponse.json(
      { message: "Failed to update profile" },
      { status: 500 }
    );
  }
}
