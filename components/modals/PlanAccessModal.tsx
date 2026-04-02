"use client";

import { useRouter } from "next/navigation";
import { PlanId, getPlan } from "@/lib/plans";
import { X, Lock } from "lucide-react";

interface PlanAccessModalProps {
  currentPlan: PlanId;
  requiredPlan: PlanId;
  isOpen: boolean;
  onClose?: () => void;
}

export default function PlanAccessModal({
  currentPlan,
  requiredPlan,
  isOpen,
  onClose,
}: PlanAccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const requiredPlanName = getPlan(requiredPlan).name;

  const handleDashboard = () => {
    router.push("/dashboard");
    onClose?.();
  };

  const handleUpgrade = () => {
    router.push("/dashboard/settings?tab=billing");
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-[var(--border-color)]"
        style={{ background: "var(--bg-secondary)" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lock size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase">Feature Locked</h2>
              <p className="text-sm opacity-90">Plan upgrade required</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Message */}
          <div className="text-center space-y-3">
            <p className="text-[var(--text-primary)] font-semibold">
              You aren't accessible for this feature.
            </p>
            <p className="text-[var(--text-secondary)] text-sm">
              For access to this feature, you need to upgrade to the{" "}
              <span className="font-bold text-[var(--primary)]">
                {requiredPlanName}
              </span>{" "}
              plan.
            </p>
          </div>

          {/* Feature comparison hint */}
          <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)]">
            <p className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-2">
              Plan Comparison
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">Your Plan</span>
                <span className="font-bold text-[var(--text-primary)]">
                  {getPlan(currentPlan).name}
                </span>
              </div>
              <div className="h-px bg-[var(--border-color)]" />
              <div className="flex justify-between items-center text-sm">
                <span className="text-[var(--text-secondary)]">
                  Required Plan
                </span>
                <span className="font-bold text-[var(--primary)]">
                  {requiredPlanName}
                </span>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDashboard}
              className="px-4 py-3 rounded-xl font-bold uppercase text-sm transition-all border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-[var(--bg-primary)] active:scale-95"
            >
              Go Back
            </button>
            <button
              onClick={handleUpgrade}
              className="px-4 py-3 rounded-xl font-bold uppercase text-sm transition-all bg-[var(--primary)] text-white hover:brightness-110 active:scale-95 shadow-lg"
            >
              Upgrade Now
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => handleDashboard()}
            className="absolute top-4 right-4 p-1 hover:bg-[var(--bg-primary)] rounded-lg transition-colors"
          >
            <X size={20} style={{ color: "var(--text-secondary)" }} />
          </button>
        </div>
      </div>
    </div>
  );
}
