import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); 
  
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : type === "faqs" ? "faqs" : "hero");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { type, ...body } = await req.json();
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : type === "faqs" ? "faqs" : "hero");
    const result = await collection.insertOne({ ...body, createdAt: new Date() });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Post failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const { type, id, ...updates } = await req.json();
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : type === "faqs" ? "faqs" : "hero");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : "faqs");
    await collection.deleteOne({ _id: new ObjectId(id!) });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}