"use client";

import PlanAccessModal from "@/components/modals/PlanAccessModal";
import { LayoutList, Loader2 } from "lucide-react"; 
import AddFoodModal from "../../components/nutritions/AddFoodModal";
import MealCard from "../../components/nutritions/MealCard";
import WaterTracker from "../../components/nutritions/WaterTracker";
import NutritionHeader from "@/components/dashboard/nutrition/NutritionHeader";
import MacroStatsGrid from "@/components/dashboard/nutrition/MacroStatsGrid";
import SmartInsightsCard from "@/components/dashboard/nutrition/SmartInsightsCard";
import CalorieSplitCard from "@/components/dashboard/nutrition/CalorieSplitCard";
import { useNutritionTracker } from "@/components/dashboard/nutrition/useNutritionTracker";

export default function CalorieTracker() {
  const {
    userPlan,
    dayName,
    dateStr,
    isLoading,
    GOALS,
    glasses,
    meals,
    totals,
    remaining,
    calPct,
    insightDismissed,
    setInsightDismissed,
    modal,
    setModal,
    handleWaterUpdate,
    addFood,
    removeEntry,
  } = useNutritionTracker();

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
        <p className="text-[var(--text-secondary)] font-medium animate-pulse">Syncing your nutrition data...</p>
      </div>
    );
  }

  if (userPlan === "free") {
    return <PlanAccessModal currentPlan={userPlan} requiredPlan="pro" isOpen={true} onClose={() => {}} />;
  }

  return (
    <div className="max-w-full space-y-8 md:space-y-12 lg:space-y-16">
      <title>Nutrition Tracker | Dashboard - Flexify</title>
      <NutritionHeader
        dayName={dayName}
        dateStr={dateStr}
        remaining={remaining}
        calPct={calPct}
        consumedCalories={totals.calories}
        calorieGoal={GOALS.calories}
      />
      <MacroStatsGrid totals={totals} goals={GOALS} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
            <LayoutList size={20} className="text-[var(--primary)]" /> Meal Log
          </h2>
          <div className="flex flex-col gap-4">
            {meals.map((meal) => (
              <MealCard
                key={meal.id}
                meal={meal}
                onAddFood={() => setModal({ open: true, mealId: meal.id, mealName: meal.name })}
                onRemoveEntry={(id) => removeEntry(meal.id, id)}
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          {!insightDismissed && (
            <SmartInsightsCard
              protein={totals.protein}
              proteinGoal={GOALS.protein}
              glasses={glasses}
              onDismiss={() => setInsightDismissed(true)}
            />
          )}
          <WaterTracker glasses={glasses} setGlasses={handleWaterUpdate} goal={GOALS.waterGoal} />
          <CalorieSplitCard meals={meals} totalCalories={totals.calories} />
        </div>
      </div>

      {modal.open && (
        <AddFoodModal
          mealName={modal.mealName}
          onClose={() => setModal({ open: false, mealId: "", mealName: "" })}
          onAdd={addFood}
        />
      )}
    </div>
  );
}
