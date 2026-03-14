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
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    const emailFromQuery = searchParams.get("email");
    
    const targetEmail = session?.user?.email || emailFromQuery;

    if (!targetEmail) {
      return NextResponse.json(
        { message: "Email not provided" }, 
        { status: 400 }
      );
    }

    const usersCollection = await dbConnect<UserDoc>("users"); 
    const user = await usersCollection.findOne({ email: targetEmail });

    if (!user) {
      return NextResponse.json(null, { status: 200 });
    }

    return NextResponse.json(user, { status: 200 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching user:", errorMessage);
    
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}