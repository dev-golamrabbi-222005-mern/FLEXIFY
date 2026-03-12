import { dbConnect } from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return Response.json({ message: "Unauthorized!" }, { status: 401 });
    }

    const userEmail = session.user.email;

    const collection = await dbConnect("user_routines");

   const userWorkouts = await collection
      .find({ userEmail: userEmail })
      .sort({ createdAt: -1 })
      .toArray();

    return Response.json({
      success: true,
      data: userWorkouts
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Routine Error:", error);
    return Response.json({ message: "Failed to fetch routines" }, { status: 500 });
  }
}