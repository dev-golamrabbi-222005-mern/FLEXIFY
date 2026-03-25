import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const collection = await dbConnect("users");
    
    const hashedPassword = await bcrypt.hash(password, 14);

    const result = await collection.updateOne(
      { email: email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ message: "User not found or password not changed" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}