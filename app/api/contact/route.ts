import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 },
      );
    }

    const collection = dbConnect("contacts");

    const result = await collection.insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
      status: "pending",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  const collection = dbConnect("contacts");
  const data = await collection.find().toArray();

  return NextResponse.json(data);
}