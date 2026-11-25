"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { PlanId } from "@/lib/plans";

interface SidebarUpgradeCardProps {
  userRole: string;
  userStatus: string;
  userPlan: PlanId;
}

export function SidebarUpgradeCard({
  userRole,
  userStatus,
  userPlan,
}: SidebarUpgradeCardProps) {
  if (userRole !== "user" || userStatus !== "approved") return null;

  if (userPlan === "elite") {
    return (
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-[#7c3aed] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute w-20 h-20 rounded-full -right-4 -top-4 bg-white/10" />
          <div className="flex items-center justify-center mb-3 text-lg bg-white/20 w-9 h-9 rounded-xl backdrop-blur-sm">
            🏆
          </div>
          <h4 className="mb-1 text-sm font-bold">You&apos;re on Elite!</h4>
          <p className="text-[11px] text-purple-100 mb-1 leading-relaxed">
            You have full access — AI coaching, personal coach, and everything in between.
          </p>
          <p className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">
            Maximum level unlocked 🎉
          </p>
        </div>
      </div>
    );
  }

  if (userPlan === "pro") {
    return (
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-[#f47920] to-[#dc2626] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
          <div className="absolute w-20 h-20 rounded-full -right-4 -top-4 bg-white/10" />
          <div className="flex items-center justify-center mb-3 bg-white/20 w-9 h-9 rounded-xl backdrop-blur-sm">
            <Trophy size={18} />
          </div>
          <h4 className="mb-1 text-sm font-bold">Upgrade to Elite</h4>
          <p className="text-[11px] text-orange-100 mb-3 leading-relaxed">
            Get a personal coach, custom plans, and direct messaging.
          </p>
          <button
            onClick={() => (window.location.href = "/#pricing")}
            className="w-full py-2 text-xs font-extrabold transition-all bg-white rounded-xl hover:bg-orange-50 active:scale-95 cursor-pointer"
            style={{ color: "#f47920" }}
          >
            Go Elite →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-4">
      <div className="bg-gradient-to-br from-[#F59E0B] to-[#059669] rounded-[1.5rem] p-5 text-white shadow-lg relative overflow-hidden">
        <div className="absolute w-20 h-20 rounded-full -right-4 -top-4 bg-white/10" />
        <div className="flex items-center justify-center mb-3 bg-white/20 w-9 h-9 rounded-xl backdrop-blur-sm">
          <Trophy size={18} />
        </div>
        <h4 className="mb-1 text-sm font-bold">Upgrade to Pro</h4>
        <p className="text-[11px] text-emerald-100 mb-3 leading-relaxed">
          Unlock AI coaching, full workout library, and advanced analytics.
        </p>
        <button
          onClick={() => (window.location.href = "/#pricing")}
          className="w-full py-2 text-xs font-extrabold transition-all bg-white rounded-xl hover:bg-emerald-50 active:scale-95 cursor-pointer"
          style={{ color: "var(--primary)" }}
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
}
