"use client";

import React, { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { FoodItem } from "@/types/food";

interface FoodSelectedDetailProps {
  food: FoodItem;
  onAddMeal: (food: FoodItem, qty: number) => void;
}

export function FoodSelectedDetail({
  food,
  onAddMeal,
}: FoodSelectedDetailProps) {
  const [qty, setQty] = useState(1);

  return (
    <div className="mt-6 space-y-5 pt-6 border-t border-[var(--border-color)] animate-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-black text-lg text-[var(--text-primary)]">{food.name}</h4>
          <div className="flex gap-4 mt-2">
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-blue-500">Protein</span>
              <span className="text-xs font-black text-[var(--text-primary)]">{food.protein}g</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-orange-500">Carbs</span>
              <span className="text-xs font-black text-[var(--text-primary)]">{food.carbs}g</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-bold text-purple-500">Fats</span>
              <span className="text-xs font-black text-[var(--text-primary)]">{food.fats}g</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border-color)]">
          <button
            onClick={() => setQty((q) => Math.max(0.5, q - 0.5))}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)] cursor-pointer"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center font-black text-sm text-[var(--text-primary)]">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 0.5)}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)] cursor-pointer"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <button
        onClick={() => onAddMeal(food, qty)}
        className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
      >
        Add Meal — {Math.round(food.calories * qty)} kcal
      </button>
    </div>
  );
}
