"use client";

import React, { useState } from "react";
import axios from "axios";
import { Search, Loader2 } from "lucide-react";
import { FoodItem } from "@/types/food";

interface SearchFoodResponse {
  foods: FoodItem[];
}

interface FoodDatabaseSearchProps {
  onSelectFood: (food: FoodItem) => void;
  selectedFoodId?: string;
}

export function FoodDatabaseSearch({
  onSelectFood,
  selectedFoodId,
}: FoodDatabaseSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get<SearchFoodResponse>(
        `/api/foods?q=${encodeURIComponent(q)}`
      );
      setResults(data.foods || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative group">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-colors"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for food (e.g. Chicken Rice)..."
          className="w-full pl-11 pr-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-primary)] outline-none focus:ring-2 ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-[var(--text-primary)]"
        />
      </div>

      <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col items-center py-6 gap-2 opacity-50">
            <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
            <p className="text-xs font-medium text-[var(--text-secondary)]">Looking through database...</p>
          </div>
        ) : (
          results.map((food) => (
            <button
              key={food.id}
              onClick={() => {
                onSelectFood(food);
                setQuery(food.name);
                setResults([]);
              }}
              className={`flex justify-between items-center p-4 rounded-xl border transition-all text-left cursor-pointer ${
                selectedFoodId === food.id
                  ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]"
                  : "border-[var(--border-color)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-primary)]"
              }`}
            >
              <div className="flex-1">
                <p className="font-bold text-sm text-[var(--text-primary)]">{food.name}</p>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">
                  {food.description}
                </p>
              </div>
              <div className="text-right ml-3">
                <span className="font-black text-sm text-[var(--primary)]">{food.calories}</span>
                <span className="text-[10px] text-[var(--text-secondary)] ml-1 font-bold">kcal</span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
