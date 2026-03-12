// app/api/payment/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getPlan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    // ── Step 1: Check session ──────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    console.log("[payment/init] session:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ── Step 2: Parse request body ─────────────────────────────────────────
    const body = await req.json();
    console.log("[payment/init] body:", body);
    const { planId } = body;

    if (!planId || planId === "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // ── Step 3: Get plan ───────────────────────────────────────────────────
    const plan = getPlan(planId);
    console.log("[payment/init] plan:", plan);

    // ── Step 4: Insert payment record ──────────────────────────────────────
    const payments = dbConnect("payments");
    const transactionId = `FLX-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    await payments.insertOne({
      userId: session.user.id ?? session.user.email,
      userEmail: session.user.email,
      userName: session.user.name ?? "",
      planId: plan.id,
      planName: plan.name,
      amount: plan.priceLocal,
      currency: plan.currency,
      transactionId,
      status: "pending",
      sslSessionKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("[payment/init] payment record inserted:", transactionId);

    // ── Step 5: Call SSLCommerz ────────────────────────────────────────────
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const isSandbox = process.env.SSLCOMMERZ_SANDBOX === "true";
    console.log("[payment/init] env check:", {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      has_password: !!process.env.SSLCOMMERZ_STORE_PASSWORD,
      sandbox: isSandbox,
      baseUrl,
    });

    const sslData = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID!,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: plan.priceLocal.toString(),
      currency: plan.currency,
      tran_id: transactionId,
      success_url: `${baseUrl}/api/payment/success`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      product_name: `Flexify ${plan.name} Plan`,
      product_category: "Subscription",
      product_profile: "non-physical-goods",
      cus_name: session.user.name ?? "Customer",
      cus_email: session.user.email,
      cus_phone: "N/A",
      cus_add1: "Dhaka",
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      shipping_method: "NO",
      num_of_item: "1",
      emi_option: "0",
    });

    const sslUrl = isSandbox
      ? "https://sandbox.sslcommerz.com/gwprocess/v4/api.php"
      : "https://securepay.sslcommerz.com/gwprocess/v4/api.php";

    console.log("[payment/init] calling SSL URL:", sslUrl);

    const sslRes = await fetch(sslUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: sslData.toString(),
    });

    console.log("[payment/init] SSL response status:", sslRes.status);
    const sslJson = await sslRes.json();
    console.log(
      "[payment/init] SSL response body:",
      JSON.stringify(sslJson, null, 2),
    );

    if (sslJson.status !== "SUCCESS") {
      await payments.updateOne(
        { transactionId },
        { $set: { status: "failed", updatedAt: new Date() } },
      );
      return NextResponse.json(
        { error: "Payment gateway error", detail: sslJson.failedreason },
        { status: 502 },
      );
    }

    await payments.updateOne(
      { transactionId },
      { $set: { sslSessionKey: sslJson.sessionkey, updatedAt: new Date() } },
    );

    return NextResponse.json({ url: sslJson.GatewayPageURL });
  } catch (err) {
    console.error("[payment/init] CRASH:", err);
    return NextResponse.json(
      { error: "Internal server error", detail: String(err) },
      { status: 500 },
    );
  }
}
