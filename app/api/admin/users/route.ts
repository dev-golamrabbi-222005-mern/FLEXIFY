import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const usersCol = await dbConnect("users");
    const users = await usersCol.find({ role: "user" }).toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const usersCol = await dbConnect("users");

    await usersCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status } } 
    );

    return NextResponse.json({ message: "User status updated" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}