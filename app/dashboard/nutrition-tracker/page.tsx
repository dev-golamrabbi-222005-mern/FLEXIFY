"use client";

import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Coffee, Sun, Moon, Utensils, Sparkles, X, LayoutList, Loader2 } from "lucide-react"; 
import type { FoodItem, MealSection, FoodEntry } from "@/types/food";
import CircularProgress from "../components/nutritions/CircularProgress";
import AddFoodModal from "../components/nutritions/AddFoodModal";
import MealCard from "../components/nutritions/MealCard";
import WaterTracker from "../components/nutritions/WaterTracker";
import { UserProfileResponse } from "@/types/user";


interface LogPayload {
  date: string;
  type: "WATER_UPDATE" | "ADD_FOOD" | "REMOVE_FOOD";
  data: {
    glasses?: number;
    mealId?: string;
    entry?: FoodEntry;
    entryId?: string;
    caloriesToRemove?: number;
  };
}

export default function CalorieTracker() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const today = new Date();
  const todayDate = today.toISOString().split('T')[0];
  const dayName = today.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = today.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const { data: dbData, isLoading } = useQuery({
    queryKey: ["dailyLogs", todayDate],
    queryFn: async () => {
      const { data } = await axios.get(`/api/logs?date=${todayDate}`);
      return data;
    },
    enabled: !!session?.user,
  });

  const mutation = useMutation({
    mutationFn: (payload: LogPayload) => axios.post("/api/logs", payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dailyLogs"] }),
  });

  const [meals, setMeals] = useState<MealSection[]>([
    { id: "breakfast", name: "Breakfast", icon: <Coffee size={18} className="text-orange-500" />, iconColor: "#f97316", entries: [] },
    { id: "lunch", name: "Lunch", icon: <Sun size={18} className="text-yellow-500" />, iconColor: "#eab308", entries: [] },
    { id: "dinner", name: "Dinner", icon: <Moon size={18} className="text-indigo-500" />, iconColor: "#6366f1", entries: [] },
    { id: "snacks", name: "Snacks", icon: <Utensils size={18} className="text-green-500" />, iconColor: "#22c55e", entries: [] },
  ]);

  const { data: userData } = useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/fitness-profile");
      return data;
    },
    enabled: !!session?.user,
  });


  const GOALS = useMemo(() => {
    return userData?.calculatedGoals || { 
      calories: 2200, 
      protein: 150, 
      carbs: 250, 
      fats: 70, 
      waterGoal: 8 
    };
  }, [userData]);

  const [glasses, setGlasses] = useState(0);
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [modal, setModal] = useState({ open: false, mealId: "", mealName: "" });

  useEffect(() => {
    if (dbData) {
      setGlasses(dbData.waterIntake || 0);
      setMeals(prev => prev.map(m => ({
        ...m,
        entries: dbData.meals?.[m.id]?.entries || []
      })));
    }
  }, [dbData]);

  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => {
      meal.entries.forEach((e) => {
        acc.calories += e.foodItem.calories * e.quantity;
        acc.protein += e.foodItem.protein * e.quantity;
        acc.carbs += e.foodItem.carbs * e.quantity;
        acc.fats += e.foodItem.fats * e.quantity;
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
  }, [meals]);

const remaining = GOALS.calories - totals.calories;
  const calPct = Math.min(totals.calories / GOALS.calories, 1);
const handleWaterUpdate = (val: number | ((prev: number) => number)) => {
  const nextValue = typeof val === "function" ? val(glasses) : val;
  
  setGlasses(nextValue);
  mutation.mutate({ 
    date: todayDate, 
    type: "WATER_UPDATE", 
    data: { glasses: nextValue } 
  });
};

const addFood = (item: FoodItem, qty: number) => {
   
    const randomId = typeof window !== 'undefined' 
      ? window.crypto.randomUUID() 
      : Date.now().toString(); 

    const entry: FoodEntry = { 
      id: `${modal.mealId}-${randomId}`, 
      foodItem: item, 
      quantity: qty 
    };

    mutation.mutate({ 
      date: todayDate, 
      type: "ADD_FOOD", 
      data: { mealId: modal.mealId, entry } 
    });
  };

  const removeEntry = (mealId: string, entryId: string) => {
    const meal = meals.find(m => m.id === mealId);
    const entry = meal?.entries.find(e => e.id === entryId);
    if (entry) {
      mutation.mutate({
        date: todayDate,
        type: "REMOVE_FOOD",
        data: { mealId, entryId, caloriesToRemove: entry.foodItem.calories * entry.quantity }
      });
    }
  };

  if (isLoading) {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      <p className="text-[var(--text-secondary)] font-medium animate-pulse">
        Syncing your nutrition data...
      </p>
    </div>
  );
}
  return (
    <div className="py-2.5 px-0 max-w-7xl mx-auto">
        <title>Nutrition Tracker | Dashboard - Flexify</title>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-[14px] text-[var(--text-secondary)] font-medium">{dayName}, {dateStr}</p>
          <h1 className="font-bold text-3xl text-[var(--text-primary)] tracking-tight">Daily Calorie Progress</h1>
        </div>
        <div className="text-right">
          <p className={`text-4xl font-black leading-none ${remaining >= 0 ? "text-[var(--primary)]" : "text-red-500"}`}>
            {Math.abs(Math.round(remaining))}
          </p>
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-secondary)] font-bold mt-1">
            {remaining >= 0 ? "kcal remaining" : "kcal over limit"}
          </p>
        </div>
      </div>

      {/* Main Progress Bar */}
      <div className="mb-8">
        <div className="h-3 bg-[var(--bg-secondary)] rounded-full overflow-hidden border border-[var(--border-color)]">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${calPct * 100}%`, 
              backgroundColor: calPct > 1 ? "#ef4444" : calPct > 0.8 ? "#f59e0b" : "var(--primary)" 
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs font-bold text-[var(--text-primary)]">{Math.round(totals.calories)} kcal consumed</span>
          <span className="text-xs font-medium text-[var(--text-secondary)]">Daily Goal: {GOALS.calories} kcal</span>
        </div>
      </div>

      {/* Macro Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Protein", val: totals.protein, max: GOALS.protein, color: "#4b9eff" },
          { label: "Carbs", val: totals.carbs, max: GOALS.carbs, color: "var(--primary)" },
          { label: "Fats", val: totals.fats, max: GOALS.fats, color: "#9b59b6" },
        ].map((macro) => (
          <div key={macro.label} className="bg-[var(--bg-secondary)] p-5 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <CircularProgress value={macro.val} max={macro.max} label={macro.label} color={macro.color} />
          </div>
        ))}
      </div>

      {/* 2-Column Dashboard */}
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
            <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[var(--primary)]" />
                  <span className="font-bold text-sm">Smart Insights</span>
                </div>
                <button onClick={() => setInsightDismissed(true)} className="text-[var(--text-secondary)] hover:text-red-500 transition-colors">
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-3">
                {totals.protein < GOALS.protein * 0.5 && (
                  <div className="bg-blue-500/5 border border-blue-500/10 p-3 rounded-xl">
                    <p className="text-[10px] font-black text-blue-500 uppercase mb-1">Low Protein</p>
                    <p className="text-[12px] text-[var(--text-secondary)]">Try adding eggs or chicken to your next meal.</p>
                  </div>
                )}
                {glasses < 4 && (
                  <div className="bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl">
                    <p className="text-[10px] font-black text-cyan-500 uppercase mb-1">Hydration Hint</p>
                    <p className="text-[12px] text-[var(--text-secondary)]">You've only had {glasses} glasses. Aim for 8.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          <WaterTracker glasses={glasses} setGlasses={handleWaterUpdate} goal={GOALS.waterGoal} />

          <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 border border-[var(--border-color)]">
            <h3 className="text-xs font-black text-[var(--text-secondary)] uppercase tracking-widest mb-4">Calorie Split</h3>
            <div className="space-y-4">
              {meals.map((meal) => {
                const mealCal = meal.entries.reduce((s, e) => s + (e.foodItem.calories * e.quantity), 0);
                const pct = totals.calories > 0 ? (mealCal / totals.calories) * 100 : 0;
                return (
                  <div key={meal.id} className="group">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                        {meal.icon} {meal.name}
                      </span>
                      <span className="text-[11px] font-medium text-[var(--text-secondary)]">{Math.round(mealCal)} kcal</span>
                    </div>
                    <div className="h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[var(--primary)] transition-all duration-500" 
                        style={{ width: `${pct}%`, opacity: 0.6 + (pct/200) }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
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