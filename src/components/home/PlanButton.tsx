"use client";

import React from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Loader2, CheckCircle2 } from "lucide-react";
import { Plan, PLAN_RANK } from "./pricingData";

export function FeatureValue({ val }: { val: boolean | string }) {
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

interface PlanButtonProps {
  plan: Plan;
  userPlan: string;
  loading: boolean;
  onClick: () => void;
}

export function PlanButton({ plan, userPlan, loading, onClick }: PlanButtonProps) {
  const userRank = PLAN_RANK[userPlan] ?? 0;
  const planRank = PLAN_RANK[plan.id] ?? 0;
  const isCurrent = userPlan === plan.id;
  const isLower = userRank > planRank;
  const isDisabled = isCurrent || isLower || loading;

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
      className="btn-primary w-full flex items-center justify-center gap-2 transition-all disabled:cursor-not-allowed cursor-pointer"
      style={style}
    >
      {label}
    </button>
  );
}
