import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    const collection = await dbConnect("users");
    const user = await collection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "No account found with this email." },
        { status: 404 }
      );
    }

    // 1. Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2. Generate Reset Link (You can add a token here later for security)
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?email=${email}`;

    // 3. Email Template
    const mailOptions = {
      from: `"Flexify Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset Request - Flexify",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff4c00;">Flexify Password Reset</h2>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background-color: #ff4c00; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold;">Reset Password</a>
          <p style="margin-top: 20px; font-size: 13px; color: #666;">If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 11px; color: #999;">Flexify Fitness © 2026</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({ 
      success: true, 
      message: "Reset link has been sent to your email." 
    });

  } catch (error: any) {
    console.error("Nodemailer Error:", error);
    return NextResponse.json(
      { message: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}