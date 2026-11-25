"use client";

import React from "react";
import { PLANS } from "./pricingData";
import { PlanButton, FeatureValue } from "./PlanButton";

interface PricingDesktopTableProps {
  userPlan: string;
  loadingPlan: string | null;
  onPlanClick: (planId: string) => void;
}

export function PricingDesktopTable({
  userPlan,
  loadingPlan,
  onPlanClick,
}: PricingDesktopTableProps) {
  return (
    <div className="overflow-x-auto">
      <div
        className="rounded-3xl min-w-[800px] overflow-hidden"
        style={{ border: "3px solid var(--border-color)" }}
      >
        <div className="grid grid-cols-4 bg-[var(--bg-secondary)]">
          <div className="px-6 py-5 flex items-center">
            <span className="text-2xl font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">
              Features
            </span>
          </div>

          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="relative px-6 py-5 text-center flex flex-col items-center"
              style={{
                background: plan.featured ? "rgba(244,121,32,0.06)" : "transparent",
                borderLeft: "1px solid var(--border-color)",
                borderTop: plan.featured ? "3px solid var(--primary)" : "3px solid transparent",
              }}
            >
              {plan.featured && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg text-[9px] font-black uppercase tracking-widest text-white bg-[var(--primary)]">
                  Recommended
                </div>
              )}
              <h3 className="font-extrabold text-lg text-[var(--text-primary)]">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1 my-2">
                <span className="text-3xl font-black text-[var(--text-primary)]">${plan.price}</span>
                <span className="text-xs text-[var(--text-secondary)]">/mo</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{plan.desc}</p>
            </div>
          ))}
        </div>

        {PLANS[0].features.map((feat, idx) => (
          <div
            key={feat.label}
            className="grid grid-cols-4 items-center"
            style={{
              background: idx % 2 === 0 ? "var(--bg-primary)" : "var(--bg-secondary)",
              borderTop: "1px solid var(--border-color)",
            }}
          >
            <div className="px-6 py-3.5 text-xs font-semibold text-[var(--text-primary)]">
              {feat.label}
            </div>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className="px-6 py-3.5 text-center"
                style={{
                  borderLeft: "1px solid var(--border-color)",
                  background: plan.featured ? "rgba(244,121,32,0.03)" : "transparent",
                }}
              >
                <FeatureValue val={plan.features[idx].val} />
              </div>
            ))}
          </div>
        ))}

        <div
          className="grid grid-cols-4 bg-[var(--bg-secondary)]"
          style={{ borderTop: "2px solid var(--border-color)" }}
        >
          <div className="px-6 py-5" />
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className="px-6 py-5"
              style={{
                borderLeft: "1px solid var(--border-color)",
                background: plan.featured ? "rgba(244,121,32,0.06)" : "transparent",
              }}
            >
              <PlanButton
                plan={plan}
                userPlan={userPlan}
                loading={loadingPlan === plan.id}
                onClick={() => onPlanClick(plan.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
