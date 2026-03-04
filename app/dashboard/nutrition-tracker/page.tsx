"use client";

import { useState, useRef, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FoodItem {
  id: string;
  name: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

interface MealEntry {
  id: string;
  foodItem: FoodItem;
  quantity: number;
}

interface MealSection {
  id: string;
  name: string;
  icon: string;
  iconColor: string;
  entries: MealEntry[];
}

// ─── Food Database ────────────────────────────────────────────────────────────
const FOOD_DB: FoodItem[] = [
  {
    id: "1",
    name: "Omelet with Spinach",
    description: "2 Large Eggs, 50g Spinach",
    calories: 280,
    protein: 18,
    carbs: 4,
    fats: 20,
  },
  {
    id: "2",
    name: "Oat Milk Latte",
    description: "250ml Oat Milk, Espresso",
    calories: 140,
    protein: 3,
    carbs: 18,
    fats: 5,
  },
  {
    id: "3",
    name: "Grilled Chicken Bowl",
    description: "150g Chicken, Brown Rice, Broccoli",
    calories: 650,
    protein: 45,
    carbs: 62,
    fats: 12,
  },
  {
    id: "4",
    name: "Greek Yogurt",
    description: "200g Full Fat Greek Yogurt",
    calories: 190,
    protein: 17,
    carbs: 8,
    fats: 10,
  },
  {
    id: "5",
    name: "Banana",
    description: "1 Medium Banana ~120g",
    calories: 105,
    protein: 1,
    carbs: 27,
    fats: 0,
  },
  {
    id: "6",
    name: "Avocado Toast",
    description: "2 Slices Whole Grain, 80g Avocado",
    calories: 320,
    protein: 8,
    carbs: 34,
    fats: 18,
  },
  {
    id: "7",
    name: "Salmon Fillet",
    description: "180g Atlantic Salmon, Grilled",
    calories: 370,
    protein: 40,
    carbs: 0,
    fats: 22,
  },
  {
    id: "8",
    name: "Brown Rice",
    description: "100g Cooked Brown Rice",
    calories: 216,
    protein: 5,
    carbs: 45,
    fats: 2,
  },
  {
    id: "9",
    name: "Protein Shake",
    description: "1 Scoop Whey + 300ml Milk",
    calories: 280,
    protein: 35,
    carbs: 20,
    fats: 6,
  },
  {
    id: "10",
    name: "Caesar Salad",
    description: "Romaine, Parmesan, Croutons, Dressing",
    calories: 310,
    protein: 12,
    carbs: 22,
    fats: 20,
  },
  {
    id: "11",
    name: "Blueberry Smoothie",
    description: "200g Blueberries, Almond Milk, Honey",
    calories: 210,
    protein: 4,
    carbs: 44,
    fats: 3,
  },
  {
    id: "12",
    name: "Sweet Potato",
    description: "200g Baked Sweet Potato",
    calories: 180,
    protein: 4,
    carbs: 41,
    fats: 0,
  },
  {
    id: "13",
    name: "Quinoa Bowl",
    description: "180g Quinoa, Veggies, Olive Oil",
    calories: 420,
    protein: 14,
    carbs: 58,
    fats: 14,
  },
  {
    id: "14",
    name: "Scrambled Eggs",
    description: "3 Large Eggs, Butter",
    calories: 250,
    protein: 18,
    carbs: 1,
    fats: 19,
  },
  {
    id: "15",
    name: "Pasta Bolognese",
    description: "200g Pasta, Beef Mince Sauce",
    calories: 580,
    protein: 32,
    carbs: 68,
    fats: 18,
  },
  {
    id: "16",
    name: "Turkey Sandwich",
    description: "Turkey, Whole Grain Bread, Lettuce",
    calories: 340,
    protein: 28,
    carbs: 32,
    fats: 8,
  },
  {
    id: "17",
    name: "Mixed Nuts",
    description: "30g Almonds, Cashews, Walnuts",
    calories: 180,
    protein: 5,
    carbs: 8,
    fats: 16,
  },
  {
    id: "18",
    name: "Apple",
    description: "1 Medium Apple ~182g",
    calories: 95,
    protein: 0,
    carbs: 25,
    fats: 0,
  },
  {
    id: "19",
    name: "Cottage Cheese",
    description: "150g Low-Fat Cottage Cheese",
    calories: 120,
    protein: 18,
    carbs: 5,
    fats: 2,
  },
  {
    id: "20",
    name: "Lentil Soup",
    description: "300ml Homemade Lentil Soup",
    calories: 230,
    protein: 16,
    carbs: 36,
    fats: 3,
  },
  {
    id: "21",
    name: "Beef Steak",
    description: "200g Sirloin Steak, Grilled",
    calories: 450,
    protein: 52,
    carbs: 0,
    fats: 24,
  },
  {
    id: "22",
    name: "Veggie Stir Fry",
    description: "Mixed Vegetables, Tofu, Soy Sauce",
    calories: 280,
    protein: 14,
    carbs: 28,
    fats: 10,
  },
  {
    id: "23",
    name: "Chocolate Protein Bar",
    description: "60g High Protein Bar",
    calories: 220,
    protein: 20,
    carbs: 22,
    fats: 6,
  },
  {
    id: "24",
    name: "Orange Juice",
    description: "250ml Fresh Orange Juice",
    calories: 110,
    protein: 2,
    carbs: 26,
    fats: 0,
  },
  {
    id: "25",
    name: "Peanut Butter",
    description: "2 tbsp Natural Peanut Butter",
    calories: 190,
    protein: 8,
    carbs: 6,
    fats: 16,
  },
];

// ─── Circular Progress ────────────────────────────────────────────────────────
function CircularProgress({
  value,
  max,
  label,
  color,
  size = 120,
}: {
  value: number;
  max: number;
  label: string;
  color: string;
  size?: number;
}) {
  const r = (size - 16) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const dash = circ * pct;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e8e4d9"
          strokeWidth={10}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          style={{
            transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)",
          }}
        />
        <text
          x={size / 2}
          y={size / 2 - 8}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#2c2c2c"
          fontSize="18"
          fontWeight="700"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {value}g
        </text>
        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#9a9690"
          fontSize="10"
          fontWeight="600"
          style={{
            transform: "rotate(90deg)",
            transformOrigin: `${size / 2}px ${size / 2}px`,
            fontFamily: "'Sora', sans-serif",
          }}
        >
          {label.toUpperCase()}
        </text>
      </svg>
      <p style={{ color: "#9a9690", fontSize: "12px", fontWeight: 500 }}>
        {Math.round(pct * 100)}% of {max}g goal
      </p>
    </div>
  );
}

// ─── Add Food Modal ───────────────────────────────────────────────────────────
function AddFoodModal({
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

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    const lower = q.toLowerCase();
    setResults(
      FOOD_DB.filter(
        (f) =>
          f.name.toLowerCase().includes(lower) ||
          f.description.toLowerCase().includes(lower),
      ).slice(0, 6),
    );
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
        const resp = await fetch("/api/analyze-food", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ base64, mediaType: file.type }),
        });
        if (!resp.ok) {
          const errData = await resp.json();
          throw new Error(errData.error || "API error");
        }
        const data = await resp.json();
        setAiResult({ id: "ai-" + Date.now(), ...data.food });
      } catch {
        setAiError(
          "Could not identify the food. Please try a clearer image or search manually.",
        );
      } finally {
        setAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const currentFood = tab === "photo" ? aiResult : selected;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--bg-secondary)] rounded-[20px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl font-['Sora'] border border-[var(--border-color)]">
        {/* Header */}
        <div className="p-6 pb-0 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] font-semibold text-[var(--primary)] uppercase tracking-wider">
                Adding to
              </p>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {mealName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] cursor-pointer flex items-center justify-center text-[var(--text-secondary)] text-lg hover:bg-[var(--bg-primary)] transition-colors"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-0 -mb-[1px]">
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
                className={`px-5 py-2.5 border-none border-b-2 text-[13px] font-semibold cursor-pointer transition-all capitalize
                  ${
                    tab === t
                      ? "border-b-[var(--primary)] text-[var(--primary)] font-bold"
                      : "border-b-transparent text-[var(--text-secondary)]"
                  }`}
              >
                {t === "search" ? "🔍 Search Food" : "📸 Photo AI"}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* SEARCH TAB */}
          {tab === "search" && (
            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">
                  🔍
                </span>
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search 25+ foods..."
                  className="w-full pl-10 pr-3.5 py-3 border-1.5 border-[var(--border-color)] rounded-xl font-['Sora'] text-sm bg-[var(--bg-primary)] outline-none focus:border-[var(--primary)] transition-colors"
                />
              </div>

              {results.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {results.map((food) => (
                    <button
                      key={food.id}
                      onClick={() => {
                        setSelected(food);
                        setQuery(food.name);
                        setResults([]);
                      }}
                      className={`flex justify-between items-center p-3.5 rounded-xl border-1.5 transition-all text-left
                        ${
                          selected?.id === food.id
                            ? "border-[var(--primary)] bg-[var(--primary)]/5"
                            : "border-[var(--border-color)] bg-[var(--bg-primary)]"
                        }`}
                    >
                      <div>
                        <p className="font-semibold text-sm text-[var(--text-primary)]">
                          {food.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                          {food.description}
                        </p>
                      </div>
                      <span className="font-bold text-sm text-[var(--primary)] ml-3">
                        {food.calories} kcal
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {query && results.length === 0 && !selected && (
                <p className="text-center text-[var(--text-secondary)] text-[13px] py-5">
                  No results for "{query}"
                </p>
              )}
            </div>
          )}

          {/* PHOTO TAB */}
          {tab === "photo" && (
            <div className="space-y-4">
              {!imagePreview ? (
                <div
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) handleFile(file);
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileRef.current?.click()}
                  className="border-2 border-dashed border-[var(--border-color)] rounded-2xl p-10 text-center cursor-pointer bg-[var(--bg-primary)]/50 hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all"
                >
                  <div className="text-4xl mb-3">📸</div>
                  <p className="font-bold text-[15px] text-[var(--text-primary)] mb-1.5">
                    Upload a food photo
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    Drag & drop or click to browse
                    <br />
                    AI will identify the food automatically
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      e.target.files?.[0] && handleFile(e.target.files[0])
                    }
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden aspect-video bg-black">
                    <img
                      src={imagePreview}
                      alt="food"
                      className="w-full h-full object-cover"
                    />
                    {analyzing && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-3">
                        <div className="w-10 h-10 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                        <p className="text-white font-semibold text-sm">
                          AI is analyzing...
                        </p>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setImagePreview(null);
                      setAiResult(null);
                      setAiError(null);
                    }}
                    className="text-xs text-[var(--text-secondary)] underline bg-transparent border-none cursor-pointer"
                  >
                    ← Try a different image
                  </button>
                </div>
              )}

              {aiError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3.5 text-red-500 text-[13px]">
                  ⚠️ {aiError}
                </div>
              )}

              {aiResult && !analyzing && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-2">
                  <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-tight">
                    ✅ AI Identified
                  </p>
                  <p className="font-bold text-base text-[var(--text-primary)]">
                    {aiResult.name}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {aiResult.description}
                  </p>
                  <div className="flex gap-2 pt-2">
                    {[
                      {
                        l: "Calories",
                        v: aiResult.calories,
                        c: "text-[var(--primary)]",
                      },
                      { l: "P", v: aiResult.protein, c: "text-blue-500" },
                      { l: "C", v: aiResult.carbs, c: "text-amber-500" },
                      { l: "F", v: aiResult.fats, c: "text-purple-500" },
                    ].map((m) => (
                      <div
                        key={m.l}
                        className="flex-1 text-center bg-[var(--bg-secondary)] rounded-lg p-2"
                      >
                        <p className={`text-xs font-bold ${m.c}`}>
                          {m.v}
                          {m.l === "Calories" ? " kcal" : "g"}
                        </p>
                        <p className="text-[9px] text-[var(--text-secondary)]">
                          {m.l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Selection Detail & Footer */}
          {currentFood && (
            <div className="mt-6 space-y-4">
              <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-2xl p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-bold text-[15px] text-[var(--text-primary)]">
                      {currentFood.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                      {currentFood.description}
                    </p>
                  </div>
                  <span className="font-extrabold text-xl text-[var(--primary)]">
                    {currentFood.calories * qty}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-sm font-semibold text-[var(--text-secondary)]">
                    Servings:
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQty((q) => Math.max(0.5, q - 0.5))}
                      className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                    >
                      −
                    </button>
                    <span className="font-bold text-[var(--text-primary)] min-w-[20px] text-center">
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty((q) => q + 0.5)}
                      className="w-8 h-8 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <button
                disabled={!currentFood}
                onClick={() => {
                  if (currentFood) {
                    onAdd(currentFood, qty);
                    onClose();
                  }
                }}
                className={`w-full py-3.5 rounded-xl border-none font-bold text-[15px] transition-all
                  ${
                    currentFood
                      ? "bg-[var(--primary)] text-white cursor-pointer hover:shadow-lg hover:brightness-110"
                      : "bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed"
                  }`}
              >
                Add {currentFood.name} (+{currentFood.calories * qty} kcal)
              </button>
            </div>
          )}

          {!currentFood && (
            <button
              disabled
              className="w-full py-3.5 mt-6 rounded-xl border-none font-bold text-[15px] bg-[var(--border-color)] text-[var(--text-secondary)] cursor-not-allowed"
            >
              Select a food to add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Meal Card ────────────────────────────────────────────────────────────────
function MealCard({
  meal,
  onAddFood,
  onRemoveEntry,
}: {
  meal: MealSection;
  onAddFood: () => void;
  onRemoveEntry: (entryId: string) => void;
}) {
  const totalCal = meal.entries.reduce(
    (s, e) => s + e.foodItem.calories * e.quantity,
    0,
  );

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 shadow-sm border border-[var(--border-color)]">
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-xl">{meal.icon}</span>
          <h3 className="font-bold text-base text-[var(--text-primary)]">
            {meal.name}
          </h3>
        </div>
        <span className="font-bold text-[15px] text-[var(--text-secondary)]">
          {totalCal} kcal
        </span>
      </div>

      {/* Entry List */}
      {meal.entries.length > 0 && (
        <div className="flex flex-col gap-2.5 mb-3">
          {meal.entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center justify-between p-3 bg-[var(--bg-primary)]/50 rounded-xl gap-3 border border-transparent hover:border-[var(--border-color)] transition-all"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Icon Box */}
                <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center shrink-0">
                  <span className="text-sm">🍽️</span>
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[var(--text-primary)] truncate">
                    {entry.foodItem.name}
                    {entry.quantity !== 1 && (
                      <span className="text-[var(--primary)] ml-1.5">
                        ×{entry.quantity}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
                    P: {entry.foodItem.protein * entry.quantity}g | C:{" "}
                    {entry.foodItem.carbs * entry.quantity}g | F:{" "}
                    {entry.foodItem.fats * entry.quantity}g
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-[var(--text-primary)] whitespace-nowrap">
                  {entry.foodItem.calories * entry.quantity} kcal
                </span>
                <button
                  onClick={() => onRemoveEntry(entry.id)}
                  className="w-6 h-6 rounded-full border border-[var(--border-color)] bg-[var(--bg-secondary)] cursor-pointer text-xs text-[var(--text-secondary)] flex items-center justify-center shrink-0 hover:bg-red-500 hover:text-white hover:border-red-500 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Food Button */}
      <button
        onClick={onAddFood}
        className="w-full py-2.5 rounded-xl border-2 border-dashed bg-transparent font-['Sora'] text-sm font-semibold text-[var(--text-secondary)] cursor-pointer transition-all hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5"
      >
        + Add Food
      </button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const GOALS = {
  calories: 2200,
  protein: 150,
  carbs: 250,
  fats: 70,
  sodium: 2300,
  sugar: 50,
  fiber: 30,
};
const DAILY_AVG = {
  sodium: { value: 1800, status: "Normal", color: "#27ae60" },
  sugar: { value: 46, status: "Near Limit", color: "#f47920" },
  fiber: { value: 22, status: "On Track", color: "#27ae60" },
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
      entries: [
        { id: "b1", foodItem: FOOD_DB[0], quantity: 1 },
        { id: "b2", foodItem: FOOD_DB[1], quantity: 1 },
      ],
    },
    {
      id: "lunch",
      name: "Lunch",
      icon: "☀️",
      iconColor: "#f47920",
      entries: [{ id: "l1", foodItem: FOOD_DB[2], quantity: 1 }],
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
          <p className={`text-4xl font-extrabold leading-none tracking-tighter ${remaining >= 0 ? 'text-[var(--primary)]' : 'text-red-500'}`}>
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
                backgroundColor: calPct > 0.9 ? "#e74c3c" : calPct > 0.7 ? "var(--primary)" : "var(--success)"
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
          { val: totals.protein, max: GOALS.protein, label: "Protein", color: "#4b9eff" },
          { val: totals.carbs, max: GOALS.carbs, label: "Carbs", color: "var(--primary)" },
          { val: totals.fats, max: GOALS.fats, label: "Fats", color: "#9b59b6" },
        ].map((m) => (
          <div key={m.label} className="bg-[var(--bg-secondary)] rounded-2xl p-5 text-center shadow-sm border border-[var(--border-color)]">
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
                    You've hit {Math.round((totals.protein / GOALS.protein) * 100)}% of your Protein goal. Great job!
                  </p>
                </div>
              )}

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 mb-4">
                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                  💧 Rule: Hydration
                </p>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Based on your activity, you need 800ml more water today.
                </p>
              </div>

              <button className="w-full py-3 bg-[var(--primary)] hover:bg-[var(--secondary)] border-none rounded-xl text-white font-bold text-sm cursor-pointer transition-colors shadow-lg shadow-orange-500/20">
                View Full Analysis
              </button>
            </div>
          )}

          {/* Daily Average */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 shadow-sm border border-[var(--border-color)]">
            <h3 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-4">
              Daily Average
            </h3>
            <div className="flex flex-col gap-3.5">
              {Object.entries(DAILY_AVG).map(([key, data]) => (
                <div key={key}>
                  <div className="flex justify-between mb-1">
                    <span className="text-[13px] font-semibold text-[var(--text-primary)] capitalize">{key}</span>
                    <span className="text-xs font-bold" style={{ color: data.color }}>{data.status}</span>
                  </div>
                  <div className="h-1.5 bg-[var(--bg-nav-footer)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(data.value / (GOALS as Record<string, number>)[key]) * 100}%`,
                        backgroundColor: data.color 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Calorie Split */}
          <div className="bg-[var(--bg-secondary)] rounded-2xl p-5 shadow-sm border border-[var(--border-color)]">
            <h3 className="text-[13px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-3.5">
              Meal Split
            </h3>
            {meals.map((meal) => {
              const mealCal = meal.entries.reduce((s, e) => s + e.foodItem.calories * e.quantity, 0);
              const pct = totals.calories > 0 ? (mealCal / totals.calories) * 100 : 0;
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
                      <span className="text-xs font-semibold text-[var(--text-secondary)]">{meal.name}</span>
                      <span className="text-[11px] text-[var(--text-secondary)]">{mealCal} kcal</span>
                    </div>
                    <div className="h-1 bg-[var(--bg-nav-footer)] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: colors[meal.id] }}
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
