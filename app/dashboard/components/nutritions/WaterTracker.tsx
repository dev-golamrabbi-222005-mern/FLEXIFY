export default function WaterTracker({
glasses,
  setGlasses,
  goal = 8,
}: {
  glasses: number;
  setGlasses: (val: number | ((prev: number) => number)) => void;
  goal?: number;
}) {


const add = () => setGlasses((g) => Math.min(g + 1, goal + 4));
  const remove = () => setGlasses((g) => Math.max(g - 1, 0));
  const pct = Math.min(glasses / goal, 1);

const getStatus = () => {
    if (glasses === 0) return { text: "Not started", color: "text-[#9a9690]" };
    if (glasses < goal * 0.4) return { text: "Keep going!", color: "text-[#f47920]" };
    if (glasses < goal * 0.7) return { text: "Good progress", color: "text-[#f0a500]" };
    if (glasses < goal) return { text: "Almost there!", color: "text-[#4b9eff]" };
    return { text: "Goal reached! 🎉", color: "text-[#27ae60]" };
  };
  const status = getStatus();

  return (
   <div className="max-w-md mx-auto bg-[var(--bg-secondary)] rounded-2xl p-5 shadow-[var(--shadow)] border border-[var(--border-color)] font-sans transition-all duration-300">
  {/* Header */}
  <div className="flex items-center justify-between mb-3">
    <div className="flex items-center gap-2">
      <span className="text-lg">💧</span>
      <h3 className="text-[11px] font-black text-[var(--text-primary)] uppercase tracking-[0.15em]">
        Water Intake
      </h3>
    </div>
    <span
      className={`text-[11px] font-bold px-2 py-1 rounded-full ${
        pct >= 1 ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--warning)]/10 text-[var(--warning)]"
      } transition-colors duration-300`}
    >
      {status.text}
    </span>
  </div>

  {/* Big Counter */}
  <div className="text-center my-6">
    <p className="text-[48px] font-black text-[var(--primary)] leading-none tracking-tighter">
      {glasses}
      <span className="text-lg font-bold text-[var(--text-muted)] ml-1">
        / {goal}
      </span>
    </p>
    <p className="text-[12px] font-bold text-[var(--text-secondary)] mt-2 uppercase tracking-tight">
      {glasses * 250}ml <span className="text-[var(--text-muted)] font-medium">of {goal * 250}ml</span>
    </p>
  </div>

  {/* Progress Bar */}
  <div className="h-2.5 bg-[var(--bg-tertiary)] rounded-full overflow-hidden mb-6 border border-[var(--border-color)]">
    <div
      className="h-full bg-[var(--primary)] rounded-full transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] shadow-[0_0_10px_rgba(16,185,129,0.3)]"
      style={{ width: `${Math.min(pct * 100, 100)}%` }}
    />
  </div>

  {/* Glass Icons Grid */}
  <div className="grid grid-cols-5 sm:grid-cols-8 gap-2 mb-6">
    {Array.from({ length: goal }).map((_, i) => (
      <div
        key={i}
        onClick={() => setGlasses(i + 1)}
        className={`
          aspect-square rounded-xl flex items-center justify-center text-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-90
          border-[1.5px] shadow-sm
          ${
            i < glasses
              ? "bg-[var(--primary)] border-[var(--primary)] text-white scale-105 shadow-[0_4px_10px_rgba(16,185,129,0.2)]"
              : "bg-[var(--bg-primary)] border-[var(--border-color)] text-[var(--text-muted)] grayscale opacity-60"
          }
        `}
      >
        {i < glasses ? "🥛" : "🫙"}
      </div>
    ))}
  </div>

  {/* Action Buttons */}
  <div className="flex gap-3">
    <button
      onClick={remove}
      disabled={glasses === 0}
      className="flex-1 p-3 rounded-xl border-[1.5px] border-[var(--border-color)] bg-transparent text-[13px] font-bold text-[var(--text-secondary)] transition-all duration-200 hover:enabled:border-[var(--danger)] hover:enabled:text-[var(--danger)] disabled:opacity-20 disabled:cursor-not-allowed uppercase tracking-wider"
    >
      − Remove
    </button>
    <button
      onClick={add}
      className="flex-[2] p-3 rounded-xl bg-[var(--primary)] text-[13px] font-black text-white transition-all duration-300 hover:bg-[var(--primary-dark)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.3)] active:scale-[0.96] uppercase tracking-widest shadow-lg shadow-[var(--primary)]/20"
    >
      + Add Glass
    </button>
  </div>
</div>
  );
}
