// app/api/payment/success/route.ts
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
    console.log("SSL DATA:", data);

    const { tran_id, val_id, amount, currency, status, store_amount } = data;

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

    // ── Must be VALID or VALIDATED ─────────────────────────────────────────
    if (status !== "VALID" && status !== "VALIDATED") {
      return NextResponse.redirect(`${baseUrl}/payment/success?payment=failed`);
    }

    // ── Verify with SSLCommerz validation API ──────────────────────────────
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
      return NextResponse.redirect(`${baseUrl}/payment/success?payment=failed`);
    }

    // ── Find the pending payment ───────────────────────────────────────────
    const payment = await dbConnect("payments").findOne({
      transactionId: tran_id,
    });
    if (!payment) {
      return NextResponse.redirect(`${baseUrl}/payment/success?payment=failed`);
    }

    // ── Idempotency: already processed? ───────────────────────────────────
    if (payment.status === "success") {
      return NextResponse.redirect(
        `${baseUrl}/payment/success?payment=success`,
      );
    }

    const plan = getPlan(payment.planId);
    const now = new Date();
    const expiry = computeExpiry(plan.durationDays);

    // ── Update payment record ─────────────────────────────────────────────
    await dbConnect("payments").updateOne(
      { transactionId: tran_id },
      {
        $set: {
          status: "success",
          valId: val_id,
          bankTranId: data.bank_tran_id ?? null,
          cardType: data.card_type ?? null,
          storeAmount: parseFloat(store_amount ?? "0"),
          paidAmount: parseFloat(amount ?? "0"),
          paidCurrency: currency,
          paidAt: now,
          updatedAt: now,
          sslRaw: validateJson, // store full SSL response for audit
        },
      },
    );

    // ── Update user's plan in users collection ────────────────────────────
    await dbConnect("users").updateOne(
      { email: payment.userEmail },
      {
        $set: {
          plan: plan.id,
          planName: plan.name,
          planActivated: now,
          planExpiry: expiry,
          features: plan.features,
          updatedAt: now,
        },
      },
    );

    return NextResponse.redirect(
      // `${baseUrl}/dashboard?payment=success&plan=${plan.id}`,
      `${baseUrl}/payment/success?payment=success&plan=${plan.id}`
    );
  } catch (err) {
    console.error("[payment/success]", err);
    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
    return NextResponse.redirect(`${baseUrl}/payment/success?payment=error`);
  }
}

// SSLCommerz may also send GET in some configurations
export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return NextResponse.redirect(`${baseUrl}/payment/success?payment=invalid`);
}
