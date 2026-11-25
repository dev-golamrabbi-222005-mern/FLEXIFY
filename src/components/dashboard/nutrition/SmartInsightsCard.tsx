import React from "react";
import { Sparkles, X } from "lucide-react";

interface SmartInsightsCardProps {
  protein: number;
  proteinGoal: number;
  glasses: number;
  onDismiss: () => void;
}

export default function SmartInsightsCard({
  protein,
  proteinGoal,
  glasses,
  onDismiss,
}: SmartInsightsCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)] relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[var(--primary)]" />
          <span className="text-sm font-bold">Smart Insights</span>
        </div>
        <button
          onClick={onDismiss}
          className="text-[var(--text-secondary)] hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      <div className="space-y-3">
        {protein < proteinGoal * 0.5 && (
          <div className="p-3 border bg-blue-500/5 border-blue-500/10 rounded-xl">
            <p className="text-[10px] font-black text-blue-500 uppercase mb-1">
              Low Protein
            </p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              Try adding eggs or chicken to your next meal.
            </p>
          </div>
        )}
        {glasses < 4 && (
          <div className="p-3 border bg-cyan-500/5 border-cyan-500/10 rounded-xl">
            <p className="text-[10px] font-black text-cyan-500 uppercase mb-1">
              Hydration Hint
            </p>
            <p className="text-[12px] text-[var(--text-secondary)]">
              You&apos;ve only had {glasses} glasses. Aim for 8.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
