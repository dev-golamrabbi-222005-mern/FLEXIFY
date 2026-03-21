import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json([], { status: 401 });

    const collection = await dbConnect("user-achievements");
    const data = await collection.findOne({ userEmail: session.user.email });
    
    return NextResponse.json(data?.achievements || []);
  } catch (error) {
    return NextResponse.json([], { status: 500 });
  }
}