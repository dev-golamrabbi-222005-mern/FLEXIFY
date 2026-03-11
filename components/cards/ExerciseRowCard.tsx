import { Info, Plus, Check } from "lucide-react";

export const ExerciseRow = ({ exercise, onSelect, isSelected, onShowDetails }: any) => {
  const imageUrl = exercise.images?.[0] 
    ? `/exercises/${exercise.images[0]}` 
    : null;

  return (
    <div className={`flex items-center gap-4 p-3 mb-2 rounded-2xl border transition-all duration-300
      ${isSelected 
        ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-[0_0_20px_rgba(16,185,129,0.1)] scale-[1.01]' 
        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-[var(--primary-light)] hover:shadow-sm'}`}>
      
      <div className="w-16 h-16 bg-white rounded-2xl flex-shrink-0 overflow-hidden border border-[var(--border-color)] relative shadow-sm group">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={exercise.name} 
            className="w-full h-full object-cover p-1 transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center font-black text-[var(--primary)] text-xs bg-[var(--bg-primary)] uppercase">
            {exercise.name.substring(0, 2)}
          </div>
        )}
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="text-[13px] font-black uppercase  tracking-tight truncate text-[var(--text-primary)] leading-none mb-2">
          {exercise.name}
        </h4>
        <div className="flex flex-wrap items-center gap-2">
           <span className="text-[8px] text-[var(--text-muted)] uppercase font-black bg-[var(--bg-tertiary)] px-2 py-1 rounded-lg border border-[var(--border-color)] tracking-wider">
            {exercise.equipment}
          </span>
          <span className={`text-[8px] uppercase font-black px-2 py-1 rounded-lg border ${
            exercise.level === 'beginner' 
              ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5' : 
            exercise.level === 'intermediate' 
              ? 'text-amber-500 border-amber-500/20 bg-amber-500/5' : 
              'text-rose-500 border-rose-500/20 bg-rose-500/5'
          }`}>
            {exercise.level}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Info Button */}
        <button 
          onClick={() => onShowDetails(exercise)} 
          className="p-2.5 text-[var(--text-muted)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-xl transition-all active:scale-90"
          title="Exercise Details"
        >
          <Info size={18} />
        </button>

        {/* Selection Toggle Button */}
        <button 
          onClick={() => onSelect(exercise)}
          className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 shadow-sm active:scale-95 ${
            isSelected 
              ? 'bg-[var(--primary)] text-white shadow-[0_4px_10px_rgba(16,185,129,0.3)]' 
              : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
          }`}
        >
          {isSelected ? <Check size={20} strokeWidth={3} /> : <Plus size={20} strokeWidth={2.5} />}
        </button>
      </div>
    </div>
  );
};