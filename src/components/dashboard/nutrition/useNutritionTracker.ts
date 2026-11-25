"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { Coffee, Sun, Moon, Utensils } from "lucide-react";
import React from "react";
import type { FoodItem, MealSection, FoodEntry, UserProfileResponse } from "@/types";
import { PlanId } from "@/lib/plans";

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

export function useNutritionTracker() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: dbUser } = useQuery({
    queryKey: ["currentUser", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) return null;
      const res = await axios.get(`/api/user/me?email=${session.user.email}`);
      return res.data;
    },
    enabled: !!session?.user?.email,
  });

  const userPlan = (dbUser?.plan as PlanId) || "free";
  const today = new Date();
  const todayDate = today.toISOString().split("T")[0];
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

  const { data: userData } = useQuery<UserProfileResponse>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      const { data } = await axios.get("/api/user/fitness-profile");
      return data;
    },
    enabled: !!session?.user,
  });

  const GOALS = useMemo(() => {
    return (
      userData?.calculatedGoals || {
        calories: 2200,
        protein: 150,
        carbs: 250,
        fats: 70,
        waterGoal: 8,
      }
    );
  }, [userData]);

  const glasses = dbData?.waterIntake || 0;
  const [insightDismissed, setInsightDismissed] = useState(false);
  const [modal, setModal] = useState({ open: false, mealId: "", mealName: "" });

  const meals = useMemo<MealSection[]>(() => {
    const baseMeals: MealSection[] = [
      { id: "breakfast", name: "Breakfast", icon: React.createElement(Coffee, { size: 18, className: "text-orange-500" }), iconColor: "#f97316", entries: [] },
      { id: "lunch", name: "Lunch", icon: React.createElement(Sun, { size: 18, className: "text-yellow-500" }), iconColor: "#eab308", entries: [] },
      { id: "dinner", name: "Dinner", icon: React.createElement(Moon, { size: 18, className: "text-indigo-500" }), iconColor: "#6366f1", entries: [] },
      { id: "snacks", name: "Snacks", icon: React.createElement(Utensils, { size: 18, className: "text-green-500" }), iconColor: "#22c55e", entries: [] },
    ];
    if (!dbData) return baseMeals;
    return baseMeals.map((m) => ({
      ...m,
      entries: dbData.meals?.[m.id]?.entries || [],
    }));
  }, [dbData]);

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, meal) => {
        meal.entries.forEach((e) => {
          acc.calories += e.foodItem.calories * e.quantity;
          acc.protein += e.foodItem.protein * e.quantity;
          acc.carbs += e.foodItem.carbs * e.quantity;
          acc.fats += e.foodItem.fats * e.quantity;
        });
        return acc;
      },
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
  }, [meals]);

  const remaining = GOALS.calories - totals.calories;
  const calPct = Math.min(totals.calories / GOALS.calories, 1);

  const handleWaterUpdate = (val: number | ((prev: number) => number)) => {
    const nextValue = typeof val === "function" ? val(glasses) : val;
    mutation.mutate({ date: todayDate, type: "WATER_UPDATE", data: { glasses: nextValue } });
  };

  const addFood = (item: FoodItem, qty: number) => {
    const randomId = crypto.randomUUID();
    const entry: FoodEntry = { id: `${modal.mealId}-${randomId}`, foodItem: item, quantity: qty };
    mutation.mutate({ date: todayDate, type: "ADD_FOOD", data: { mealId: modal.mealId, entry } });
  };

  const removeEntry = (mealId: string, entryId: string) => {
    const meal = meals.find((m) => m.id === mealId);
    const entry = meal?.entries.find((e) => e.id === entryId);
    if (entry) {
      mutation.mutate({
        date: todayDate,
        type: "REMOVE_FOOD",
        data: { mealId, entryId, caloriesToRemove: entry.foodItem.calories * entry.quantity },
      });
    }
  };

  return {
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
  };
}
