// app/api/payment/init/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { dbConnect } from "@/lib/dbConnect";
import { getPlan } from "@/lib/plans";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[payment/init] session:", JSON.stringify(session, null, 2));

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    console.log("[payment/init] body:", body);

    // ── CHANGE 1: destructure coachId and totalAmount alongside planId ──────
    const { planId, coachId, totalAmount } = body as {
      planId: string;
      coachId?: string;
      totalAmount?: number;
    };

    if (!planId || planId === "free") {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const plan = getPlan(planId);
    console.log("[payment/init] plan:", plan);

    // ── CHANGE 2: use totalAmount when provided (Elite + coach combo) ────────
    // totalAmount arrives in USD from the frontend (e.g. 29 + 30 = 59)
    // Convert to BDT for SSLCommerz (plan.priceLocal is already in BDT)
    const finalAmountBDT =
      typeof totalAmount === "number"
        ? Math.round(totalAmount * 113) // approximate USD → BDT rate
        : plan.priceLocal; // fallback: use plan's BDT price

    const payments = dbConnect("payments");
    const transactionId = `FLX-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    // ── CHANGE 3: save coachId in the payment record ─────────────────────────
    await payments.insertOne({
      userId: session.user.id ?? session.user.email,
      userEmail: session.user.email,
      userName: session.user.name ?? "",
      planId: plan.id,
      planName: plan.name,
      amount: finalAmountBDT,
      currency: plan.currency,
      coachId: coachId ?? null, // ← stored for success handler to link coach
      transactionId,
      status: "pending",
      sslSessionKey: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    console.log("[payment/init] payment record inserted:", transactionId);

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    const isSandbox = process.env.SSLCOMMERZ_SANDBOX === "true";
    console.log("[payment/init] env check:", {
      store_id: process.env.SSLCOMMERZ_STORE_ID,
      has_password: !!process.env.SSLCOMMERZ_STORE_PASSWORD,
      sandbox: isSandbox,
      baseUrl,
      finalAmountBDT,
      coachId,
    });

    const productName = coachId
      ? `Flexify ${plan.name} Plan + Personal Coach`
      : `Flexify ${plan.name} Plan`;

    const sslData = new URLSearchParams({
      store_id: process.env.SSLCOMMERZ_STORE_ID!,
      store_passwd: process.env.SSLCOMMERZ_STORE_PASSWORD!,
      total_amount: finalAmountBDT.toString(), // ← uses finalAmountBDT
      currency: plan.currency,
      tran_id: transactionId,
      success_url: `${baseUrl}/api/payment/success`,
      fail_url: `${baseUrl}/api/payment/fail`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
      ipn_url: `${baseUrl}/api/payment/ipn`,
      product_name: productName,
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
