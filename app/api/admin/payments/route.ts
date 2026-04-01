import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const paymentsCol = await dbConnect("payments");
    const usersCol = await dbConnect("users");

    const transactions = await paymentsCol.find({}).sort({ createdAt: -1 }).toArray();

    const totalUsers = await usersCol.countDocuments({ role: "user" });

    const paidCount = await usersCol.countDocuments({ 
      role: "user", 
      plan: { $exists: true, $ne: "free" } 
    });

    const pendingCount = await paymentsCol.countDocuments({ status: "pending" });


    const refundedCount = await paymentsCol.countDocuments({ status: "refunded" });

    return NextResponse.json({
      summary: { 
        totalUsers, 
        paidCount, 
        pendingCount, 
        refundedCount 
      },
      transactions
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    const paymentsCol = await dbConnect("payments");
    
    await paymentsCol.updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: status, updatedAt: new Date() } }
    );

    return NextResponse.json({ message: "Status updated successfully" });
  } catch (error) {
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}