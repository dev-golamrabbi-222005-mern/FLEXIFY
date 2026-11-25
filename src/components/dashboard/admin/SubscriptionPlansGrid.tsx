"use client";

import React from "react";
import { CreditCard, Edit, Loader2 } from "lucide-react";

export interface PlanItem {
  _id: string;
  name: string;
  price: string | number;
  duration: string;
}

interface SubscriptionPlansGridProps {
  plans?: PlanItem[];
  onEdit: (plan: PlanItem) => void;
  isUpdating: boolean;
  updatingPlanId?: string;
}

export default function SubscriptionPlansGrid({
  plans,
  onEdit,
  isUpdating,
  updatingPlanId,
}: SubscriptionPlansGridProps) {
  return (
    <section>
      <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
        <CreditCard className="text-[var(--primary)]" /> Subscription Plans
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans?.map((plan) => (
          <div
            key={plan._id}
            className="card-glass p-6 flex flex-col gap-4 border border-[var(--border-color)] group hover:border-[var(--primary)] transition-all"
          >
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-bold tracking-wider uppercase">{plan.name}</h3>
              <span className="text-xs font-bold px-2 py-1 bg-[var(--primary)] text-white rounded">
                {plan.duration}
              </span>
            </div>
            <p className="text-4xl font-black">
              {plan.price === 0 || plan.price === "0" ? "FREE" : <>৳{plan.price}</>}
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => onEdit(plan)}
                className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition duration-300"
              >
                {isUpdating && updatingPlanId === plan._id ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <Edit size={16} />
                )}
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
