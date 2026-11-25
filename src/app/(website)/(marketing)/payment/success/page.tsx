import PaymentSuccessContent from "@/components/PaymentSuccess";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="mt-10 text-center">Loading...</div>}>
      <PaymentSuccessContent />
    </Suspense>
  );
}