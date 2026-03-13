"use client";
import React from "react";
import { ListChecks, ArrowRight, Clock } from "lucide-react";
import { useRouter } from "next/navigation";

interface Exercise {
  id: string;
  name: string;
}

interface WorkoutCardProps {
  title: string;
  exercises: Exercise[];
  createdAt?: string;
  type: "suggested" | "custom";
  id?: string;
}

export const WorkoutCard = ({ title, exercises, createdAt, type, id }: WorkoutCardProps) => {
  const router = useRouter();

  const handleStart = () => {
    router.push(`your-workouts/session/${id || title.toLowerCase()}`);
  };

  return (
    <div className="group relative bg-[var(--bg-secondary)] border border-[var(--border-color)] p-6 rounded-3xl hover:border-[var(--primary)] transition-all duration-300 shadow-sm flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div className="min-w-0">
            <h3 className={`font-black uppercase tracking-tighter text-[var(--text-primary)] truncate ${type === 'suggested' ? 'text-2xl italic' : 'text-lg'}`}>
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold opacity-50 uppercase text-[var(--text-muted)] flex items-center gap-1">
                <ListChecks size={12} /> {exercises?.length || 0} Exercises
              </span>
              {createdAt && (
                <span className="text-[10px] font-bold opacity-50 uppercase text-[var(--text-muted)] flex items-center gap-1 border-l border-[var(--border-color)] pl-2">
                  <Clock size={12} /> {new Date(createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <ul className="space-y-2 mb-8">
          {exercises?.slice(0, 4).map((ex) => (
            <li key={ex.id} className="text-xs font-medium text-[var(--text-secondary)] flex items-center gap-2 capitalize">
              <span className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full shrink-0" />
              <span className="truncate">{ex.name}</span>
            </li>
          ))}
          {exercises && exercises.length > 4 && (
            <li className="text-[10px] font-bold opacity-40 uppercase pl-3.5 text-[var(--text-muted)]">
              +{exercises.length - 4} More
            </li>
          )}
        </ul>
      </div>

      <button 
        onClick={handleStart}
        type="button" 
        className="w-full py-4 bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] font-black text-[10px] uppercase rounded-2xl group-hover:bg-[var(--primary)] group-hover:text-white group-hover:border-transparent transition-all tracking-widest active:scale-[0.98] flex items-center justify-center gap-2"
      >
        Start Workout <ArrowRight size={14} />
      </button>
    </div>
  );
};