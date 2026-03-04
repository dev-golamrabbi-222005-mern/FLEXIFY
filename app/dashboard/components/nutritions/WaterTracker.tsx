export default function WaterTracker({
  glasses,
  setGlasses,
}: {
  glasses: number;
  setGlasses: React.Dispatch<React.SetStateAction<number>>;
}) {
  const GOAL = 8; // 8 glasses = ~2000ml

  const add = () => setGlasses((g) => Math.min(g + 1, GOAL + 4));
  const remove = () => setGlasses((g) => Math.max(g - 1, 0));
  const pct = Math.min(glasses / GOAL, 1);

  const getStatus = () => {
    if (glasses === 0) return { text: "Not started", color: "text-[#9a9690]" };
    if (glasses < GOAL * 0.4)
      return { text: "Keep going!", color: "text-[#f47920]" };
    if (glasses < GOAL * 0.7)
      return { text: "Good progress", color: "text-[#f0a500]" };
    if (glasses < GOAL)
      return { text: "Almost there!", color: "text-[#4b9eff]" };
    return { text: "Goal reached! 🎉", color: "text-[#27ae60]" };
  };

  const status = getStatus();

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl p-5 shadow-[0_2px_12px_rgba(0,0,0,0.05)] border border-[#ede9e0] font-sans">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">💧</span>
          <h3 className="text-[13px] font-bold text-[#1a1a1a] uppercase tracking-widest">
            Water Intake
          </h3>
        </div>
        <span
          className={`text-[12px] font-bold ${status.color} transition-colors duration-300`}
        >
          {status.text}
        </span>
      </div>

      {/* Big Counter */}
      <div className="text-center my-4">
        <p className="text-[42px] font-extrabold text-[#4b9eff] leading-none tracking-tighter">
          {glasses}
          <span className="text-base font-semibold text-[#9a9690] ml-1">
            / {GOAL}
          </span>
        </p>
        <p className="text-[12px] text-[#9a9690] mt-1">
          glasses · {glasses * 250}ml of {GOAL * 250}ml
        </p>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-[#e8e4d9] rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-[#4b9eff] to-[#74c0fc] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct * 100}%` }}
        />
      </div>

      {/* Glass Icons Grid */}
      <div className="grid grid-cols-8 gap-1.5 mb-4">
        {Array.from({ length: GOAL }).map((_, i) => (
          <div
            key={i}
            onClick={() => setGlasses(i + 1)}
            title={`Set to ${i + 1} glass${i > 0 ? "es" : ""}`}
            className={`
              aspect-square rounded-lg flex items-center justify-center text-base cursor-pointer transition-all duration-200 hover:scale-110
              border-[1.5px] 
              ${
                i < glasses
                  ? "bg-[#dbeeff] border-[#4b9eff] scale-105"
                  : "bg-[#f0ede4] border-[#e0dbd0] scale-100"
              }
            `}
          >
            {i < glasses ? "🥛" : "🫙"}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={remove}
          disabled={glasses === 0}
          className="flex-1 p-2.5 rounded-xl border-[1.5px] border-[#e0dbd0] bg-white text-[13px] font-bold text-[#555] transition-all duration-200 hover:enabled:border-[#f47920] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          − Remove
        </button>
        <button
          onClick={add}
          className="flex-[2] p-2.5 rounded-xl bg-[#4b9eff] text-[13px] font-bold text-white transition-all duration-200 hover:bg-[#3a8ff0] active:scale-[0.98]"
        >
          + Add Glass (250ml)
        </button>
      </div>
    </div>
  );
}
