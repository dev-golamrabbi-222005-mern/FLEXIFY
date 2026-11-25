import React from "react";
import CircularProgress from "@/app/dashboard/components/nutritions/CircularProgress";

interface MacroStatsGridProps {
  totals: {
    protein: number;
    carbs: number;
    fats: number;
  };
  goals: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export default function MacroStatsGrid({ totals, goals }: MacroStatsGridProps) {
  const macros = [
    {
      label: "Protein",
      val: totals.protein,
      max: goals.protein,
      color: "#4b9eff",
    },
    {
      label: "Carbs",
      val: totals.carbs,
      max: goals.carbs,
      color: "var(--primary)",
    },
    {
      label: "Fats",
      val: totals.fats,
      max: goals.fats,
      color: "#9b59b6",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {macros.map((macro) => (
        <div
          key={macro.label}
          className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm"
        >
          <CircularProgress
            value={macro.val}
            max={macro.max}
            label={macro.label}
            color={macro.color}
          />
        </div>
      ))}
    </div>
  );
}
