import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ success: false }, { status: 401 });
    const logCol = await dbConnect("workout_logs");
    
    const logs = await logCol
      .find({email: session.user.email})
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ success: true, data: logs });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Failed" }, 
      { status: 500 }
    );
  }
}