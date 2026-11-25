"use client";

import { FoodItem } from "@/types/food";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { Search, Camera, X, Minus, Plus, Loader2, AlertCircle } from "lucide-react";

interface AnalyzeFoodResponse {
  food: Omit<FoodItem, "id">;
}

interface SearchFoodResponse {
  foods: FoodItem[];
}

export default function AddFoodModal({
  onClose,
  onAdd,
  mealName,
}: {
  onClose: () => void;
  onAdd: (item: FoodItem, qty: number) => void;
  mealName: string;
}) {
  const [tab, setTab] = useState<"search" | "photo">("search");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FoodItem[]>([]);
  const [selected, setSelected] = useState<FoodItem | null>(null);
  const [qty, setQty] = useState(1);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<FoodItem | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (q: string) => {
    setQuery(q);
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const { data } = await axios.get<SearchFoodResponse>(`/api/foods?q=${encodeURIComponent(q)}`);
      setResults(data.foods || []);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setImagePreview(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setAnalyzing(true);
      setAiResult(null);
      setAiError(null);
      try {
        const { data } = await axios.post<AnalyzeFoodResponse>("/api/analyze-food", { 
          base64, 
          mediaType: file.type 
        });
        const newFood: FoodItem = {
          id: `ai-${Date.now()}`,
          name: data.food.name,
          calories: data.food.calories,
          protein: data.food.protein,
          carbs: data.food.carbs,
          fats: data.food.fats,
          description: data.food.description || "AI Analyzed"
        };
        setAiResult(newFood);
      } catch (err) {
        const error = err as AxiosError<{ error: string }>;
        setAiError(error.response?.data?.error || "Could not identify the food.");
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentFood = tab === "photo" ? aiResult : selected;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--bg-secondary)] rounded-[24px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl border border-[var(--border-color)] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-0 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-[0.2em]">Adding to</p>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{mealName}</h2>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full border border-[var(--border-color)] flex items-center justify-center text-[var(--text-secondary)] hover:bg-red-50 hover:text-red-500 transition-all">
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 -mb-[1px]">
            {(["search", "photo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  setSelected(null);
                  setAiResult(null);
                  setAiError(null);
                  setImagePreview(null);
                }}
                className={`pb-3 flex items-center gap-2 text-[13px] font-bold cursor-pointer transition-all border-b-2 
                  ${tab === t ? "border-[var(--primary)] text-[var(--primary)]" : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"}`}
              >
                {t === "search" ? <Search size={16} /> : <Camera size={16} />}
                {t === "search" ? "Search Database" : "Photo AI Scanner"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {tab === "search" && (
            <div className="space-y-4">
              <div className="relative group">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--primary)] transition-colors" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search for food (e.g. Chicken Rice)..."
                  className="w-full pl-11 pr-4 py-3 border border-[var(--border-color)] rounded-xl bg-[var(--bg-primary)] outline-none focus:ring-2 ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all"
                />
              </div>

              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto pr-1">
                {loading ? (
                  <div className="flex flex-col items-center py-6 gap-2 opacity-50">
                    <Loader2 size={24} className="animate-spin text-[var(--primary)]" />
                    <p className="text-xs font-medium">Looking through database...</p>
                  </div>
                ) : (
                  results.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => { setSelected(food); setQuery(food.name); setResults([]); }}
                      className={`flex justify-between items-center p-4 rounded-xl border transition-all text-left
                        ${selected?.id === food.id ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]" : "border-[var(--border-color)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-primary)]"}`}
                    >
                      <div className="flex-1">
                        <p className="font-bold text-sm text-[var(--text-primary)]">{food.name}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] line-clamp-1">{food.description}</p>
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
          )}

          {tab === "photo" && (
            <div className="space-y-4">
              {!imagePreview ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  className="group border-2 border-dashed border-[var(--border-color)] rounded-2xl p-12 text-center cursor-pointer hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                >
                  <div className="w-14 h-14 bg-[var(--bg-primary)] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Camera size={28} className="text-[var(--text-secondary)] group-hover:text-[var(--primary)]" />
                  </div>
                  <p className="font-bold text-sm text-[var(--text-primary)]">Upload or Take a Photo</p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">Our AI will calculate the calories for you</p>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black shadow-lg">
                    <img src={imagePreview} alt="food" className="w-full h-full object-cover" />
                    {analyzing && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                        <Loader2 size={32} className="text-white animate-spin" />
                        <p className="text-white text-xs font-bold tracking-widest uppercase">AI is Analyzing...</p>
                      </div>
                    )}
                    <button 
                      onClick={() => {setImagePreview(null); setAiResult(null);}} 
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
              {aiError && (
                <div className="flex items-center gap-2 text-red-500 text-xs p-3 bg-red-50 border border-red-100 rounded-xl">
                  <AlertCircle size={14} />
                  <span className="font-medium">{aiError}</span>
                </div>
              )}
            </div>
          )}

          {/* Selection Detail & Footer */}
          {currentFood && (
            <div className="mt-6 space-y-5 pt-6 border-t border-[var(--border-color)] animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-black text-lg text-[var(--text-primary)]">{currentFood.name}</h4>
                  <div className="flex gap-4 mt-2">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-blue-500">Protein</span>
                      <span className="text-xs font-black">{currentFood.protein}g</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-orange-500">Carbs</span>
                      <span className="text-xs font-black">{currentFood.carbs}g</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase font-bold text-purple-500">Fats</span>
                      <span className="text-xs font-black">{currentFood.fats}g</span>
                    </div>
                  </div>
                </div>
                
                {/* Quantity Selector */}
                <div className="flex items-center gap-1 bg-[var(--bg-primary)] p-1 rounded-xl border border-[var(--border-color)]">
                  <button 
                    onClick={() => setQty(q => Math.max(0.5, q - 0.5))} 
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)]"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-black text-sm">{qty}</span>
                  <button 
                    onClick={() => setQty(q => q + 0.5)} 
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--bg-secondary)] transition-colors text-[var(--text-primary)]"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <button
                onClick={() => { onAdd(currentFood, qty); onClose(); }}
                className="w-full py-4 rounded-xl bg-[var(--primary)] text-white font-black text-sm uppercase tracking-widest shadow-lg shadow-orange-500/25 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                Add Meal — {Math.round(currentFood.calories * qty)} kcal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}