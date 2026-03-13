import React, { useState, useEffect, useRef } from "react";
import { History, Plus, Check, Play, Pause } from "lucide-react";
import { Exercise, SetData } from "./workout";

interface ExerciseCardProps {
  exercise: Exercise;
  exIdx: number;
  setExercises: React.Dispatch<React.SetStateAction<Exercise[]>>;
  onToggleComplete: (exIdx: number, setIdx: number, capturedTime?: string) => void;
}

export default function ExerciseCard({ exercise, exIdx, setExercises, onToggleComplete }: ExerciseCardProps) {
  const [activeTimerSet, setActiveTimerSet] = useState<string | null>(null);
  const [time, setTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const toggleTimer = (setId: string) => {
    if (activeTimerSet === setId) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setActiveTimerSet(null);
    } else {
      setActiveTimerSet(setId);
      setTime(0);
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setTime((t) => t + 1), 1000);
    }
  };

  const addSet = () => {
    setExercises((prev) => {
      const updated = [...prev];
      const newSet = { id: crypto.randomUUID(), weight: "", reps: "", seconds: "", previous: "-", isCompleted: false };
      updated[exIdx] = { ...updated[exIdx], sets: [...updated[exIdx].sets, newSet] };
      return updated;
    });
  };

  const updateInput = (setIdx: number, field: keyof SetData, val: string) => {
    if (Number(val) < 0) return;
    setExercises((prev) => {
      const updated = [...prev];
      updated[exIdx].sets[setIdx] = { ...updated[exIdx].sets[setIdx], [field]: val };
      return updated;
    });
  };

  return (
    <section className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-[var(--shadow-sm)] transition-all">
      {/* Header */}
      <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-tertiary)]/30">
        <h2 className="font-black italic uppercase text-sm tracking-tight text-[var(--text-primary)]">
          <span className="text-[var(--primary)] mr-2">#{exIdx + 1}</span>{exercise.name}
        </h2>
        <span className="text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] px-2.5 py-1 rounded-lg uppercase border border-[var(--primary)]/20">
          {exercise.trackingType.replace("_", " ")}
        </span>
      </div>

      {/* Sets List */}
      <div className="p-4 space-y-3">
        {exercise.sets.map((set, sIdx) => (
          <div key={set.id} className={`grid grid-cols-12 gap-3 items-center p-3 rounded-xl border transition-all duration-300 ${
            set.isCompleted 
            ? 'bg-[var(--primary)]/5 border-[var(--primary)]/30 opacity-80' 
            : 'bg-[var(--bg-tertiary)]/20 border-[var(--border-color)]'
          }`}>
            
            {/* Set Index & Previous Record */}
            <div className="col-span-1 text-[10px] font-black text-[var(--text-muted)] text-center">{sIdx + 1}</div>
            <div className="col-span-2 text-[10px] font-medium italic text-[var(--text-muted)] flex items-center gap-1 truncate">
              <History size={12} /> {set.previous}
            </div>
            
            {/* Input Controls */}
            <div className="col-span-7 grid grid-cols-2 gap-2">
              {exercise.trackingType !== 'TIME' ? (
                <>
                  <input type="number" min="0" placeholder="kg" value={set.weight} 
                    onChange={(e) => updateInput(sIdx, 'weight', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-lg py-2 text-center text-xs font-bold outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" />
                  
                  <input type="number" min="0" placeholder="reps" value={set.reps} 
                    onChange={(e) => updateInput(sIdx, 'reps', e.target.value)}
                    className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-lg py-2 text-center text-xs font-bold outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20 transition-all" />
                </>
              ) : (
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex-1 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg py-2 text-center text-xs font-black tabular-nums shadow-inner">
                    {activeTimerSet === set.id ? `${time}s` : (set.seconds || "0s")}
                  </div>
                  <button onClick={() => toggleTimer(set.id)} 
                    className={`p-2 rounded-lg border transition-all ${
                      activeTimerSet === set.id 
                      ? 'bg-[var(--danger)]/10 border-[var(--danger)]/30 text-[var(--danger)] animate-pulse' 
                      : 'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white'
                    }`}>
                    {activeTimerSet === set.id ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
                  </button>
                </div>
              )}
            </div>

            {/* Complete Button */}
            <div className="col-span-2 flex justify-end">
              <button 
                onClick={() => {
                  const capturedTime = activeTimerSet === set.id ? `${time}s` : undefined;
                  if (activeTimerSet === set.id) toggleTimer(set.id);
                  onToggleComplete(exIdx, sIdx, capturedTime);
                }}
                className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm ${
                  set.isCompleted 
                  ? 'bg-[var(--primary)] text-white scale-95' 
                  : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border-color)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
              >
                <Check size={18} strokeWidth={3} />
              </button>
            </div>
          </div>
        ))}
        
        {/* Add Set Button */}
        <button onClick={addSet} 
          className="w-full py-2.5 mt-2 border-2 border-dashed border-[var(--border-color)] rounded-xl text-[10px] font-black uppercase tracking-[0.1em] text-[var(--text-muted)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={14} strokeWidth={3} /> Add Set
        </button>
      </div>
    </section>
  );
}