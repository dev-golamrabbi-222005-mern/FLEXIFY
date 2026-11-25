import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password, token } = await req.json();

    if (!email || !password || !token) {
      return NextResponse.json(
        { message: "Missing required fields (email, password, or token)." },
        { status: 400 }
      );
    }

    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { message: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // 1. Verify reset token in password_resets collection
    const resetCollection = await dbConnect("password_resets");
    const validReset = await resetCollection.findOne({
      email,
      token,
      used: { $ne: true },
      expiresAt: { $gt: new Date() },
    });

    if (!validReset) {
      return NextResponse.json(
        { message: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    // 2. Hash new password and update user
    const usersCollection = await dbConnect("users");
    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await usersCollection.updateOne(
      { email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User account not found." },
        { status: 404 }
      );
    }

    // 3. Mark token as consumed
    await resetCollection.updateOne(
      { _id: validReset._id },
      { $set: { used: true, consumedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: "Password updated successfully!",
    });
  } catch (error: unknown) {
    console.error("Reset Password API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
