import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const adminCol = await dbConnect("users"); 
    const admin = await adminCol.findOne({ role: "admin" }, { projection: { password: 0 } });
    
    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json(admin);
  } catch (error) {
    console.error("Admin Profile GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch admin data" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const body = await req.json();
    const { _id, password, role, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    const adminCol = await dbConnect("users");
    
    const result = await adminCol.updateOne(
      { _id: new ObjectId(_id as string), role: "admin" },
      { $set: { ...updateData, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Admin not found to update" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Admin Profile PATCH Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
