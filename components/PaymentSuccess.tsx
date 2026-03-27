"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get("payment");
  const plan = searchParams.get("plan");

  useEffect(() => {
    if (status === "success") {
      toast.success("Payment successful");
      router.replace("/dashboard");
    } else {
      toast.error("Payment failed");
    }
  }, [status, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        {status === "success" ? (
          <>
            <h1 className="mb-4 text-3xl font-bold text-green-600">
              Payment successful!
            </h1>
            <p>Your {plan} plan is active</p>
            <div className="flex justify-center mt-6">
              <Loader2 className="mr-2 animate-spin" />
              <span>Redirecting to dashboard...</span>
            </div>
          </>
        ) : (
          <h1 className="text-2xl font-bold text-red-600">Payment failed</h1>
        )}
      </div>
    </div>
  );
}
