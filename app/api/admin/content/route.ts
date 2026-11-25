import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/adminGuard";

// Public GET for site visitors (articles, faqs, hero)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type"); 
  
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : type === "faqs" ? "faqs" : "hero");
    const data = await collection.find({}).toArray();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Content GET Error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// Protected POST: only admins can create content
export async function POST(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  const { type, ...body } = await req.json();
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : type === "faqs" ? "faqs" : "hero");
    const result = await collection.insertOne({ ...body, createdAt: new Date() });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Content POST Error:", error);
    return NextResponse.json({ error: "Post failed" }, { status: 500 });
  }
}

// Protected PATCH: only admins can update content
export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  const { type, id, ...updates } = await req.json();
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : type === "faqs" ? "faqs" : "hero");
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updates }
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Content PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// Protected DELETE: only admins can delete content
export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");
  try {
    const collection = await dbConnect(type === "articles" ? "articles" : "faqs");
    await collection.deleteOne({ _id: new ObjectId(id!) });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Content DELETE Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
