"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SectionTitle from "@/app/(website)/components/ui/section-title";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Loader2, CheckCircle2 } from "lucide-react";
import { CoachSelectModal, Coach } from "@/components/pricing/CoachSelectModal";

interface PlanFeature {
  label: string;
  val: boolean | string;
}
interface Plan {
  id: string;
  name: string;
  price: string;
  desc: string;
  cta: string;
  ctaStyle: string;
  featured: boolean;
  features: PlanFeature[];
}

const ELITE_BASE_PRICE = 9.99;
const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, elite: 2 };

const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    desc: "Start your fitness journey at zero cost.",
    cta: "Get Started Free",
    ctaStyle: "border",
    featured: false,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Limited" },
      { label: "Dashboard Access", val: "Limited" },
      { label: "AI Workout Plan", val: false },
      { label: "Plan Customization", val: false },
      { label: "Nutrition Suggestions", val: false },
      { label: "Advanced Analytics", val: false },
      { label: "Personal Coach", val: false },
      { label: "Coach Messaging", val: false },
      { label: "Custom Plan by Coach", val: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "3.99",
    desc: "AI-powered tools for serious training.",
    cta: "Start Pro",
    ctaStyle: "filled",
    featured: true,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Full" },
      { label: "Dashboard Access", val: "Full" },
      { label: "AI Workout Plan", val: true },
      { label: "Plan Customization", val: true },
      { label: "Nutrition Suggestions", val: true },
      { label: "Advanced Analytics", val: true },
      { label: "Personal Coach", val: false },
      { label: "Coach Messaging", val: false },
      { label: "Custom Plan by Coach", val: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    price: `${ELITE_BASE_PRICE}+`,
    desc: "Everything Pro & your own personal coach.",
    cta: "Go Elite",
    ctaStyle: "border-primary",
    featured: false,
    features: [
      { label: "BMI Tool", val: true },
      { label: "Workout Library", val: "Full" },
      { label: "Dashboard Access", val: "Full" },
      { label: "AI Workout Plan", val: true },
      { label: "Plan Customization", val: true },
      { label: "Nutrition Suggestions", val: true },
      { label: "Advanced Analytics", val: true },
      { label: "Personal Coach", val: true },
      { label: "Coach Messaging", val: true },
      { label: "Custom Plan by Coach", val: true },
    ],
  },
];

function FeatureValue({ val }: { val: boolean | string }) {
  if (val === true)
    return <FaCheckCircle className="text-[var(--primary)] text-lg mx-auto" />;
  if (val === false)
    return <FaTimesCircle className="text-red-400 text-lg mx-auto" />;
  return (
    <span
      className="text-xs font-black uppercase tracking-wider"
      style={{ color: "var(--primary)" }}
    >
      {val}
    </span>
  );
}

// ── Dynamic CTA button per plan ───────────────────────────────────────────────
function PlanButton({
  plan,
  userPlan,
  loading,
  onClick,
}: {
  plan: Plan;
  userPlan: string;
  loading: boolean;
  onClick: () => void;
}) {
  const userRank = PLAN_RANK[userPlan] ?? 0;
  const planRank = PLAN_RANK[plan.id] ?? 0;
  const isCurrent = userPlan === plan.id;
  const isLower = userRank > planRank;
  const isDisabled = isCurrent || isLower || loading;

  // ── Label ──────────────────────────────────────────────────────────────────
  let label: React.ReactNode = plan.cta;
  if (loading) {
    label = (
      <>
        <Loader2 size={13} className="animate-spin" /> Redirecting…
      </>
    );
  } else if (isCurrent) {
    label = (
      <span className="flex items-center justify-center gap-1.5">
        <CheckCircle2 size={13} />
        {plan.id === "free" ? "Current Plan" : `You are using ${plan.name}`}
      </span>
    );
  }

  // ── Style ──────────────────────────────────────────────────────────────────
  let style: React.CSSProperties = {};
  if (isCurrent) {
    style = {
      background: "var(--primary)",
      color: "#fff",
      cursor: "default",
      opacity: "60%",
    };
  } else if (isLower) {
    style = {
      background: "transparent",
      border: "1.5px solid var(--border-color)",
      color: "var(--text-secondary)",
      cursor: "not-allowed",
      opacity: 0.45,
    };
  } else if (plan.ctaStyle === "filled") {
    style = {
      background: "var(--primary)",
      color: "#fff",
      boxShadow: "0 4px 16px rgba(244,121,32,0.35)",
    };
  } else {
    style = {
      border: "1.5px solid var(--primary)",
      color: "var(--primary)",
      background: "transparent",
    };
  }

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled}
      className="btn-primary w-full flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed"
      style={style}
    >
      {label}
    </button>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
const Pricing = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [showCoachModal, setShowCoachModal] = useState(false);

  // Fetch user's current plan from DB
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
    totalAmount?: number,
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
    <section className="py-8 md:py-12 lg:py-16" id="pricing">
      <div className="px-4 md:px-6 mx-auto max-w-7xl">
        <SectionTitle
          title="Choose Your Plan"
          subtitle="Simple, transparent pricing for every stage of your fitness journey."
        />

        <div className="overflow-x-auto">
          <div
            className="rounded-3xl min-w-[800px] overflow-hidden" // set a min-width for table
            style={{ border: "3px solid var(--border-color)" }}
          >
            {/* ── Header row ── */}
            <div
              className="grid grid-cols-4"
              style={{ background: "var(--bg-secondary)" }}
            >
              <div className="px-6 py-5 flex items-center">
                <span
                  className="text-2xl font-extrabold uppercase tracking-widest"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Features
                </span>
              </div>

              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className="relative px-6 py-5 text-center flex flex-col items-center"
                  style={{
                    background: plan.featured
                      ? "rgba(244,121,32,0.06)"
                      : "transparent",
                    borderLeft: "1px solid var(--border-color)",
                    borderTop: plan.featured
                      ? "3px solid var(--primary)"
                      : "3px solid transparent",
                  }}
                >
                  {/* Recommended badge */}
                  {plan.featured && (
                    <div
                      className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg text-[9px] font-black uppercase tracking-widest text-white"
                      style={{ background: "var(--primary)" }}
                    >
                      Recommended
                    </div>
                  )}

                  {/* Active plan badge */}
                  {session && userPlan === plan.id && (
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
                      style={{
                        background: "rgba(16,185,129,0.12)",
                        border: "1px solid rgba(16,185,129,0.3)",
                        color: "#059669",
                      }}
                    >
                      ✓ Active
                    </div>
                  )}

                  <p
                    className="font-black text-base mb-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-0.5 mb-1">
                    <span
                      className="text-3xl font-black"
                      style={{
                        color: plan.featured
                          ? "var(--primary)"
                          : "var(--text-primary)",
                      }}
                    >
                      ${plan.price}
                    </span>
                    <span
                      className="font-bold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      /mo
                    </span>
                  </div>
                  <p
                    className="text-[13px] leading-snug mb-4"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {plan.desc}
                  </p>

                  <PlanButton
                    plan={plan}
                    userPlan={userPlan}
                    loading={loadingPlan === plan.id}
                    onClick={() => handlePlanClick(plan.id)}
                  />
                </div>
              ))}
            </div>

            {/* ── Feature rows ── */}
            {PLANS[0].features.map((f, fi) => (
              <div
                key={f.label}
                className="grid grid-cols-4"
                style={{
                  borderTop: "1px solid var(--border-color)",
                  background:
                    fi % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)",
                }}
              >
                <div className="px-6 py-4 flex items-center">
                  <span
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {f.label}
                  </span>
                </div>
                {PLANS.map((plan) => (
                  <div
                    key={`${f.label}-${plan.id}`}
                    className="px-6 py-4 flex items-center justify-center"
                    style={{
                      borderLeft: "1px solid var(--border-color)",
                      background: plan.featured
                        ? "rgba(244,121,32,0.03)"
                        : "transparent",
                    }}
                  >
                    <FeatureValue val={plan.features[fi].val} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p
          className="text-center text-[11px] mt-6 font-semibold"
          style={{ color: "var(--text-secondary)" }}
        >
          🔒 Payments secured by{" "}
          <span style={{ color: "var(--primary)" }}>SSLCommerz</span> · Cancel
          anytime
        </p>
      </div>

      <CoachSelectModal
        open={showCoachModal}
        eliteBasePrice={ELITE_BASE_PRICE}
        onClose={() => setShowCoachModal(false)}
        onProceedToPayment={handleProceedToPayment}
      />
    </section>
  );
};

export default Pricing;
