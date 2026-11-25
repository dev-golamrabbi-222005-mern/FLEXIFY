import { dbConnect } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const usersColl = await dbConnect("users");
    const paymentsColl = await dbConnect("payments");

    const [totalUsers, activeCoaches, pendingCoaches, successPayments, recentPayments] = await Promise.all([
      usersColl.countDocuments({ role: "user" }),
      usersColl.countDocuments({ role: "coach", status: "approved" }),
      usersColl.countDocuments({ role: "coach", status: "pending" }),
      paymentsColl.find({ status: "success" }).toArray(), // সঠিক: "success"
      paymentsColl.find().sort({ createdAt: -1 }).limit(5).toArray()
    ]);

    const totalRevenue = successPayments.reduce((acc, curr) => acc + (curr.amount || 0), 0);

    const activities = recentPayments.map((p) => ({
      action: p.status === "success" ? "Payment Received" : "Payment Failed",
      detail: `${p.userName} - ${p.planName} Plan (${p.amount} ${p.currency})`,
      time: new Date(p.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dot: p.status === "success" ? "#27ae60" : "#e74c3c" 
    }));

    const chartData = [
      { month: "Jan", revenue: 4500, users: 30 },
      { month: "Feb", revenue: 5200, users: 45 },
      { month: "Mar", revenue: totalRevenue, users: totalUsers }
    ];

    return NextResponse.json({
      stats: {
        totalUsers,
        activeCoaches,
        pendingCoaches,
        totalRevenue,
        totalTransactions: successPayments.length,
        health: "99.9%"
      },
      activities,
      chartData
    });
  } catch (error) {
    console.error("Admin Overview Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}