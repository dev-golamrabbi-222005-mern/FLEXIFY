import React from "react";

interface NutritionHeaderProps {
  dayName: string;
  dateStr: string;
  remaining: number;
  calPct: number;
  consumedCalories: number;
  calorieGoal: number;
}

export default function NutritionHeader({
  dayName,
  dateStr,
  remaining,
  calPct,
  consumedCalories,
  calorieGoal,
}: NutritionHeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="leading-relaxed mb-2 text-[var(--text-secondary)]">
            {dayName}, {dateStr}
          </p>
          <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
            Daily Calorie Progress
          </h1>
        </div>
        <div className="text-right">
          <p
            className={`text-4xl font-black leading-none ${remaining >= 0 ? "text-[var(--primary)]" : "text-red-500"}`}
          >
            {Math.abs(Math.round(remaining))}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-1">
            {remaining >= 0 ? "kcal remaining" : "kcal over limit"}
          </p>
        </div>
      </div>

      <div className="mb-8">
        <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
          <div
            className="h-full transition-all duration-1000 ease-out rounded-full"
            style={{
              width: `${calPct * 100}%`,
              backgroundColor:
                calPct > 1
                  ? "#ef4444"
                  : calPct > 0.8
                    ? "#f59e0b"
                    : "var(--primary)",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-bold text-[var(--text-primary)]">
            {Math.round(consumedCalories)} kcal consumed
          </span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">
            Daily Goal: {calorieGoal} kcal
          </span>
        </div>
      </div>
    </>
  );
}
