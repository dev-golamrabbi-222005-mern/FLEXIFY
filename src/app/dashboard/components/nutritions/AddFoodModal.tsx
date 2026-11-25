"use client";

import React, { useState } from "react";
import { FoodItem } from "@/types/food";
import { Search, Camera, X } from "lucide-react";
import { FoodDatabaseSearch } from "./FoodDatabaseSearch";
import { FoodPhotoAiScanner } from "./FoodPhotoAiScanner";
import { FoodSelectedDetail } from "./FoodSelectedDetail";

interface AddFoodModalProps {
  onClose: () => void;
  onAdd: (item: FoodItem, qty: number) => void;
  mealName: string;
}

export default function AddFoodModal({
  onClose,
  onAdd,
  mealName,
}: AddFoodModalProps) {
  const [tab, setTab] = useState<"search" | "photo">("search");
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [aiResult, setAiResult] = useState<FoodItem | null>(null);

  const currentFood = tab === "photo" ? aiResult : selected;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--bg-secondary)] rounded-[24px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
        <div className="p-6 pb-0 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em]">
                Adding to
              </p>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{mealName}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex gap-4 -mb-[1px]">
            {(["search", "photo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSelected(null);
                  setAiResult(null);
                }}
                className={`pb-3 flex items-center gap-2 text-[13px] font-bold cursor-pointer transition-all border-b-2 ${
                  tab === t
                    ? "border-[var(--primary)] text-[var(--primary)]"
                    : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                {t === "search" ? <Search size={16} /> : <Camera size={16} />}
                {t === "search" ? "Search Database" : "Photo AI Scanner"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === "search" ? (
            <FoodDatabaseSearch
              onSelectFood={setSelected}
              selectedFoodId={selected?.id}
            />
          ) : (
            <FoodPhotoAiScanner onAiAnalyzed={setAiResult} />
          )}

          {currentFood && (
            <FoodSelectedDetail
              food={currentFood}
              onAddMeal={(food, qty) => {
                onAdd(food, qty);
                onClose();
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
