import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { requireAdmin } from "@/lib/adminGuard";
import { ContactInquirySchema, validateBody } from "@/lib/validators/contracts";
import { sendNotificationToRole } from "@/lib/notifications/dispatch";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = validateBody(ContactInquirySchema, body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 },
      );
    }

    const { name, email, message, subject } = validation.data;

    const collection = await dbConnect("contacts");

    await collection.insertOne({
      name,
      email,
      message,
      ...(subject && { subject }),
      createdAt: new Date(),
      status: "pending",
    });

    // Dispatch real-time alert to all online admins
    await sendNotificationToRole("admin", {
      title: "New Support Inquiry",
      message: `📬 ${name} sent an inquiry: "${message.slice(0, 45)}..."`,
      type: "contact",
      link: "/dashboard/admin-users-connect",
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
