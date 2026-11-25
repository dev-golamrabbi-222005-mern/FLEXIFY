import React from "react";
import type { MealSection } from "@/types";

interface CalorieSplitCardProps {
  meals: MealSection[];
  totalCalories: number;
}

export default function CalorieSplitCard({ meals, totalCalories }: CalorieSplitCardProps) {
  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)]">
      <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4">
        Calorie Split
      </h3>
      <div className="space-y-4">
        {meals.map((meal) => {
          const mealCal = meal.entries.reduce(
            (s, e) => s + e.foodItem.calories * e.quantity,
            0,
          );
          const pct = totalCalories > 0 ? (mealCal / totalCalories) * 100 : 0;
          return (
            <div key={meal.id} className="group">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                  {meal.icon} {meal.name}
                </span>
                <span className="text-[11px] font-medium text-[var(--text-secondary)]">
                  {Math.round(mealCal)} kcal
                </span>
              </div>
              <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--primary)] transition-all duration-500"
                  style={{ width: `${pct}%`, opacity: 0.6 + pct / 200 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
