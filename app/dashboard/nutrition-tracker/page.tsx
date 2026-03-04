"use client";

import { useState, useRef, useCallback } from "react";
import type { FoodItem, MealEntry, MealSection } from "@/types/food";
import CircularProgress from "../components/nutritions/CircularProgress";
import AddFoodModal from "../components/nutritions/AddFoodModal";
import MealCard from "../components/nutritions/MealCard";
import WaterTracker from "../components/nutritions/WaterTracker";

const GOALS = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fats: 70,
};

export default function CalorieTracker() {
  const today = new Date();
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

 const [meals, setMeals] = useState<MealSection[]>([
   {
     id: "breakfast",
     name: "Breakfast",
     icon: "🌤️",
     iconColor: "#f0a500",
     entries: [],
   },
   {
     id: "lunch",
     name: "Lunch",
     icon: "☀️",
     iconColor: "#f47920",
     entries: [],
   },
   {
     id: "dinner",
     name: "Dinner",
     icon: "🌙",
     iconColor: "#7c5cbf",
     entries: [],
   },
   {
     id: "snacks",
     name: "Snacks",
     icon: "🍎",
     iconColor: "#27ae60",
     entries: [],
   },
 ]);

 const [glasses, setGlasses] = useState(0);

  const [modal, setModal] = useState<{
    open: boolean;
    mealId: string;
    mealName: string;
  }>({ open: false, mealId: "", mealName: "" });
  const [insightDismissed, setInsightDismissed] = useState(false);

  const totals = meals.reduce(
    (acc, meal) => {
      meal.entries.forEach((e) => {
        acc.calories += e.foodItem.calories * e.quantity;
        acc.protein += e.foodItem.protein * e.quantity;
        acc.carbs += e.foodItem.carbs * e.quantity;
        acc.fats += e.foodItem.fats * e.quantity;
      });
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fats: 0 },
  );

  const remaining = GOALS.calories - totals.calories;
  const calPct = Math.min(totals.calories / GOALS.calories, 1);

  const openModal = (mealId: string, mealName: string) =>
    setModal({ open: true, mealId, mealName });
  const closeModal = () => setModal({ open: false, mealId: "", mealName: "" });

  const addFood = (item: FoodItem, qty: number) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === modal.mealId
          ? {
              ...m,
              entries: [
                ...m.entries,
                { id: `${m.id}-${Date.now()}`, foodItem: item, quantity: qty },
              ],
            }
          : m,
      ),
    );
  };

  const removeEntry = (mealId: string, entryId: string) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId
          ? { ...m, entries: m.entries.filter((e) => e.id !== entryId) }
          : m,
      ),
    );
  };

  return (
    <>
      <div className="py-2.5 px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[15px] text-[var(--text-secondary)] font-medium">
              {dayName}, {dateStr}
            </p>
            <h1 className="font-bold text-3xl text-[var(--text-primary)]">
              Daily Calorie Progress
            </h1>
          </div>
          <div className="text-right">
            <p
              className={`text-4xl font-extrabold leading-none tracking-tighter ${remaining >= 0 ? "text-[var(--primary)]" : "text-red-500"}`}
            >
              {Math.abs(remaining)}
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-medium">
              {remaining >= 0 ? "kcal remaining" : "kcal over"}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="h-3 bg-[var(--bg-nav-footer)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-in-out"
              style={{
                width: `${calPct * 100}%`,
                backgroundColor:
                  calPct > 0.9
                    ? "#e74c3c"
                    : calPct > 0.7
                      ? "var(--primary)"
                      : "var(--success)",
              }}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-[var(--text-primary)] font-semibold">
              {totals.calories.toLocaleString()} kcal consumed
            </span>
            <span className="text-xs text-[var(--text-secondary)]">
              Goal: {GOALS.calories.toLocaleString()} kcal
            </span>
          </div>
        </div>

        {/* Macro Rings */}
        <div className="grid grid-cols-3 gap-4 my-6">
          {[
            {
              val: totals.protein,
              max: GOALS.protein,
              label: "Protein",
              color: "#4b9eff",
            },
            {
              val: totals.carbs,
              max: GOALS.carbs,
              label: "Carbs",
              color: "var(--primary)",
            },
            {
              val: totals.fats,
              max: GOALS.fats,
              label: "Fats",
              color: "#9b59b6",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-[var(--bg-secondary)] rounded-2xl p-5 text-center shadow-sm border border-[var(--border-color)]"
            >
              <CircularProgress
                value={m.val}
                max={m.max}
                label={m.label}
                color={m.color}
              />
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
          {/* Meal Log */}
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3.5 flex items-center gap-2">
              📋 Meal Log
            </h2>
            <div className="flex flex-col gap-3.5">
              {meals.map((meal) => (
                <div key={meal.id} className="animate-in fade-in duration-500">
                  <MealCard
                    meal={meal}
                    onAddFood={() => openModal(meal.id, meal.name)}
                    onRemoveEntry={(entryId) => removeEntry(meal.id, entryId)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-4">
            {/* Smart Insights */}
            {!insightDismissed && (
              <div className="bg-[var(--bg-nav-footer)] rounded-2xl p-5 text-[var(--text-primary)] shadow-md border border-[var(--border-color)]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[var(--primary)] text-base">✦</span>
                    <span className="font-bold text-sm">Smart Insights</span>
                  </div>
                  <button
                    onClick={() => setInsightDismissed(true)}
                    className="bg-white/10 hover:bg-white/20 border-none rounded-md text-[var(--text-secondary)] w-6 h-6 cursor-pointer text-sm flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>

                {totals.protein >= GOALS.protein * 0.75 && (
                  <div className="bg-[var(--primary)]/10 border border-[var(--primary)]/25 rounded-xl p-3 mb-2.5">
                    <p className="text-[9px] font-bold text-[var(--primary)] uppercase tracking-widest mb-1">
                      🔔 Rule Alert
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      You've hit{" "}
                      {Math.round((totals.protein / GOALS.protein) * 100)}% of
                      your Protein goal. Great job!
                    </p>
                  </div>
                )}

                {glasses < 6 && (
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4">
                    <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                      💧 Rule: Hydration
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Based on your activity, you need 800ml more water today.
                    </p>
                  </div>
                )}

                <button className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--secondary)] border-none rounded-xl text-white font-bold text-sm cursor-pointer transition-colors shadow-lg shadow-orange-500/20">
                  View Full Analysis
                </button>
              </div>
            )}

            <WaterTracker glasses={glasses} setGlasses={setGlasses} />

            {/* Calorie Split */}
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 shadow-sm border border-[var(--border-color)]">
              <h3 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3.5">
                Meal Split
              </h3>
              {meals.map((meal) => {
                const mealCal = meal.entries.reduce(
                  (s, e) => s + e.foodItem.calories * e.quantity,
                  0,
                );
                const pct =
                  totals.calories > 0 ? (mealCal / totals.calories) * 100 : 0;
                const colors: Record<string, string> = {
                  breakfast: "var(--primary)",
                  lunch: "#f47920",
                  dinner: "#7c5cbf",
                  snacks: "var(--success)",
                };
                return (
                  <div key={meal.id} className="flex items-center gap-3 mb-2.5">
                    <span className="text-sm w-5">{meal.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between mb-0.5">
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">
                          {meal.name}
                        </span>
                        <span className="text-[11px] text-[var(--text-secondary)]">
                          {mealCal} kcal
                        </span>
                      </div>
                      <div className="h-1 bg-[var(--bg-nav-footer)] rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: colors[meal.id],
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modal.open && (
        <AddFoodModal
          mealName={modal.mealName}
          onClose={closeModal}
          onAdd={addFood}
        />
      )}
    </>
  );
}
