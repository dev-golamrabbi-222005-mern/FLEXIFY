import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const collection = await dbConnect("users");
    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }

    // 1. Generate secure cryptographic reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    const resetCollection = await dbConnect("password_resets");
    // Invalidate any existing unused tokens for this email
    await resetCollection.updateMany(
      { email, used: { $ne: true } },
      { $set: { used: true, invalidatedAt: new Date() } }
    );

    await resetCollection.insertOne({
      email,
      token,
      expiresAt,
      used: false,
      createdAt: new Date(),
    });

    // 2. Generate Reset Link with verification token
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/reset-password?email=${encodeURIComponent(email)}&token=${token}`;

    // 3. Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 4. Email Template
    const mailOptions = {
      from: `"Flexify Support" <${process.env.EMAIL_USER || "support@flexify.com"}>`,
      to: email,
      subject: "Password Reset Request - Flexify",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff4c00;">Flexify Password Reset</h2>
          <p>We received a request to reset your password. Click the button below to proceed (link valid for 15 minutes):</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #ff4c00; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 13px; color: #666;">If you did not request this, please ignore this email. Your account remains safe.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #999;">Flexify Fitness © 2026</p>
        </div>
      `,
    };

    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log(`[Development Mode] Password reset link for ${email}: ${resetLink}`);
    }

    return NextResponse.json({
      success: true,
      message: "Reset link has been sent to your email.",
    });
  } catch (error: unknown) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json(
      { message: "Failed to send reset link. Please try again later." },
      { status: 500 }
    );
  }
}
