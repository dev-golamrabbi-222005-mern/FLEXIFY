export default function MealCard({
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
