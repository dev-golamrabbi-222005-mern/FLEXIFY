// app/api/payment/fail/route.ts
import { dbConnect } from "@/lib/dbConnect";
import { pusherServer } from "@/lib/pusher";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const tran_id = formData.get("tran_id") as string;

    if (tran_id) {
      const paymentsColl = await dbConnect("payments");
      
      const paymentRecord = await paymentsColl.findOne({ transactionId: tran_id });

      if (paymentRecord && paymentRecord.status !== "failed") {
        await paymentsColl.updateOne(
          { transactionId: tran_id },
          { $set: { status: "failed", updatedAt: new Date() } }
        );

        const userChannel = `user-${paymentRecord.userEmail.replace(/[@.]/g, "-")}`;
        await pusherServer.trigger(userChannel, "new-update", {
          message: `❌ Payment Failed! Your transaction (${tran_id}) was unsuccessful. Please try again or use a different method.`,
        });
      }
    }
  } catch (err) {
    console.error("[payment/fail]", err);
  }

  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/payment/success?payment=failed`);
}

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/payment/success?payment=failed`);
}
