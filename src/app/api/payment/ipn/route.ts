// app/api/payment/ipn/route.ts
// SSLCommerz server-to-server IPN — fires even if user closes browser.
// This is the most reliable way to confirm payment.

import { NextRequest, NextResponse } from "next/server";
import { getPlan, computeExpiry } from "@/lib/plans";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    const { tran_id, val_id, status, amount, currency } = data;

    if ((status !== "VALID" && status !== "VALIDATED") || !tran_id) {
      return NextResponse.json({ message: "ignored" }, { status: 200 });
    }

    // ── Re-validate with SSLCommerz ───────────────────────────────────────
    const isSandbox = process.env.SSLCOMMERZ_SANDBOX === "true";
    const validateUrl = isSandbox
      ? `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php`
      : `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php`;

    const validateRes = await fetch(
      `${validateUrl}?val_id=${val_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASSWORD}&format=json`,
    );
    const validateJson = await validateRes.json();

    if (
      validateJson.status !== "VALID" &&
      validateJson.status !== "VALIDATED"
    ) {
      return NextResponse.json(
        { message: "validation failed" },
        { status: 200 },
      );
    }
    const payment = await dbConnect("payments").findOne({
      transactionId: tran_id,
    });

    if (!payment || payment.status === "success") {
      return NextResponse.json(
        { message: "already processed or not found" },
        { status: 200 },
      );
    }

    const plan = getPlan(payment.planId);
    const now = new Date();

    // ── Update payment ────────────────────────────────────────────────────
    await dbConnect("payments").updateOne(
      { transactionId: tran_id },
      {
        $set: {
          status: "success",
          valId: val_id,
          paidAmount: parseFloat(amount ?? "0"),
          paidCurrency: currency,
          paidAt: now,
          updatedAt: now,
          ipnProcessed: true,
          sslRaw: validateJson,
        },
      },
    );

    // ── Update user plan ──────────────────────────────────────────────────
    await dbConnect("users").updateOne(
      { email: payment.userEmail },
      {
        $set: {
          plan: plan.id,
          planName: plan.name,
          planActivated: now,
          planExpiry: computeExpiry(plan.durationDays),
          features: plan.features,
          updatedAt: now,
        },
      },
    );

    return NextResponse.json({ message: "ok" }, { status: 200 });
  } catch (err) {
    console.error("[payment/ipn]", err);
    return NextResponse.json({ message: "error" }, { status: 200 }); // always 200 to SSL
  }
}
