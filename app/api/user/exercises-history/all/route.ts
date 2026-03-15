import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const logsCol = await dbConnect("workout_logs");

    const allLogs = await logsCol
      .find({ email: session.user.email })
      .project({ createdAt: 1, planName: 1 }) 
      .sort({ createdAt: 1 }) 
      .toArray();

    return NextResponse.json({
      success: true,
      data: allLogs,
    });
  } catch (error) {
    console.error("Fetch All Logs Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}