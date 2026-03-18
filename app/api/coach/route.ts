import {  NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect"; 

export const GET = async() => {
    try{
      const usersCollection = await dbConnect("users");
      const coaches = await usersCollection
      .find({ role: "coach", status: "approved" })
      .toArray();

    return NextResponse.json(coaches, { status: 200 });
  } catch (error) {
    console.error("Error fetching coaches:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}