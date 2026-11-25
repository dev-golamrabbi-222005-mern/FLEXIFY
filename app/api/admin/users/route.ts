import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId, Filter } from "mongodb";
import { requireAdmin } from "@/lib/adminGuard";

interface UserDocument {
  _id?: ObjectId;
  name?: string;
  fullName?: string;
  email: string;
  role: string;
  status: string;
}

interface UpdateStatusBody {
  id: string;
  status: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";

    const usersCol = await dbConnect<UserDocument>("users");
    
    const query: Filter<UserDocument> = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Exclude password hashes from response
    const users = await usersCol.find(query, { projection: { password: 0 } }).toArray();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Fetch Users Error:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest): Promise<NextResponse> {
  const auth = await requireAdmin();
  if (!auth.authorized) return auth.response!;

  try {
    const body: UpdateStatusBody = await req.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const usersCol = await dbConnect<UserDocument>("users");

    const result = await usersCol.updateOne(
      { _id: new ObjectId(id) } as Filter<UserDocument>,
      { $set: { status: status, updatedAt: new Date() } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User status updated" });
  } catch (error) {
    console.error("Update Status Error:", error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
