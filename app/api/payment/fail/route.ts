// app/api/payment/fail/route.ts
import { dbConnect } from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    if (tran_id) {
      await dbConnect("payments").updateOne(
        { transactionId: tran_id },
        { $set: { status: "failed", updatedAt: new Date() } },
      );
    }
  } catch (err) {
    console.error("[payment/fail]", err);
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/dashboard?payment=failed`);
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/dashboard?payment=failed`);
}
