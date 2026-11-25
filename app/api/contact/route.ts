import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/adminGuard";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    const collection = await dbConnect("contacts");

    await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}

// Protected GET: only admins can view user contact submissions
export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const collection = await dbConnect("contacts");
    const data = await collection.find().sort({ createdAt: -1 }).toArray();

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 },
    );
  }
}
