"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionTitle from "@/app/(website)/components/ui/section-title";
import { CoachSelectModal, Coach } from "@/components/pricing/CoachSelectModal";
import { PricingDesktopTable } from "./PricingDesktopTable";
import { ELITE_BASE_PRICE } from "./pricingData";

export default function Pricing() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showCoachModal, setShowCoachModal] = useState(false);

  const { data: dbUser } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  const userPlan: string = dbUser?.plan ?? "free";

  const initiatePayment = async (
    planId: string,
    coachId?: string,
    totalAmount?: number
  ) => {
    try {
      setLoadingPlan(planId);
      const res = await fetch("/api/payment/init", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, coachId, totalAmount }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Gateway error");
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert("Payment initialization failed. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handlePlanClick = (planId: string) => {
    if (planId === "free") {
      router.push(session ? "/dashboard" : "/register");
      return;
    }
    if (!session) {
      router.push(`/login?redirect=/pricing&plan=${planId}`);
      return;
    }
    if (planId === "elite") {
      setShowCoachModal(true);
      return;
    }
    initiatePayment(planId);
  };

  const handleProceedToPayment = (coach: Coach, totalAmount: number) => {
    setShowCoachModal(false);
    initiatePayment("elite", coach._id, totalAmount);
  };

  return (
    <section className="py-12 md:py-16 lg:py-20" id="pricing">
      <div className="px-4 md:px-6 mx-auto max-w-7xl">
        <SectionTitle
          title="Choose Your Plan"
          subtitle="Simple, transparent pricing for every stage of your fitness journey."
        />

        <PricingDesktopTable
          userPlan={userPlan}
          loadingPlan={loadingPlan}
          onPlanClick={handlePlanClick}
        />
      </div>

      <CoachSelectModal
        open={showCoachModal}
        eliteBasePrice={ELITE_BASE_PRICE}
        onClose={() => setShowCoachModal(false)}
        onProceedToPayment={handleProceedToPayment}
      />
    </section>
  );
}
