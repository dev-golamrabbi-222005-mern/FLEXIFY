import { FoodItem } from "@/types/food";
import { useRef, useState } from "react";

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
  if (!q.trim()) {
    setResults([]);
    return;
  }

  setLoading(true);
  try {
    const res = await fetch(`/api/foods?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setResults(data.foods);
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
                  placeholder="Search 100+ foods..."
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