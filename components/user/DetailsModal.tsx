"use client";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Target,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { Exercise } from "./workout";



interface DetailsModalProps {
  exercise: Exercise | null;
  onClose: () => void;
}

export const DetailsModal = ({ exercise, onClose }: DetailsModalProps) => {
  const [currentImg, setCurrentImg] = useState(0);

  if (!exercise) return null;

  const getImageUrl = (imgName: string) => `/exercises/${imgName}`;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-[var(--bg-secondary)] w-full max-w-lg rounded-2xl p-1 shadow-2xl animate-in zoom-in duration-300 max-h-[95vh] overflow-hidden flex flex-col border border-[var(--border-color)]">
        {/* Top Header - Sticky style */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-[var(--border-color)] bg-[var(--bg-secondary)]">
          <div className="min-w-0">
            <h2 className="text-2xl font-black uppercase tracking-tighter text-[var(--text-primary)] truncate leading-none mb-1">
              {exercise.name}
            </h2>
            <div className="flex gap-2 items-center">
              <span
                className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg border ${
                  exercise.level === "beginner"
                    ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                    : exercise.level === "intermediate"
                    ? "text-amber-500 border-amber-500/20 bg-amber-500/5"
                    : "text-rose-500 border-rose-500/20 bg-rose-500/5"
                }`}
              >
                {exercise.level}
              </span>
              <span className="text-[9px] font-black uppercase bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-lg border border-[var(--primary)]/20">
                {exercise.category}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tertiary)] hover:bg-[var(--danger)] hover:text-white rounded-2xl transition-all active:scale-90 text-[var(--text-muted)]"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-8 py-6 custom-scrollbar flex-grow space-y-8">
          {/* Image Gallery - Enhanced Style */}
          {exercise.images && exercise.images.length > 0 && (
            <div className="relative w-full aspect-square bg-[var(--bg-primary)] rounded-2xl overflow-hidden group border border-[var(--border-color)] shadow-inner">
              <img
                src={getImageUrl(exercise.images[currentImg])}
                alt={exercise.name}
                className="w-full h-full object-cover p-4 transition-transform duration-700 group-hover:scale-105"
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/400x400?text=No+Preview";
                }}
              />

              {exercise.images.length > 1 && (
                <>
                  <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                    <button
                      onClick={() =>
                        setCurrentImg((prev) =>
                          prev === 0 ? exercise.images.length - 1 : prev - 1
                        )
                      }
                      className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-black hover:bg-[var(--primary)] hover:text-white transition-all active:scale-90"
                    >
                      <ChevronLeft size={20} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImg((prev) =>
                          prev === exercise.images.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="pointer-events-auto bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl text-black hover:bg-[var(--primary)] hover:text-white transition-all active:scale-90"
                    >
                      <ChevronRight size={20} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                    {exercise.images.map((_, i: number) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          currentImg === i
                            ? "w-6 bg-white"
                            : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--bg-tertiary)] p-4 rounded-2xl border border-[var(--border-color)] flex items-center gap-3">
              <Target size={20} className="text-[var(--primary)]" />
              <div>
                <p className="text-[8px] uppercase font-black text-[var(--text-muted)] tracking-widest">
                  Muscle
                </p>
                <p className="text-[11px] font-bold uppercase text-[var(--text-primary)] truncate">
                  {exercise.primaryMuscles?.join(", ")}
                </p>
              </div>
            </div>
            <div className="bg-[var(--bg-tertiary)] p-4 rounded-2xl border border-[var(--border-color)] flex items-center gap-3">
              <ShieldCheck size={20} className="text-[var(--primary)]" />
              <div>
                <p className="text-[8px] uppercase font-black text-[var(--text-muted)] tracking-widest">
                  Equip
                </p>
                <p className="text-[11px] font-bold uppercase text-[var(--text-primary)] truncate">
                  {exercise.equipment || "Bodyweight"}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions List */}
          <div className="space-y-4">
            <h4 className="font-black text-xs uppercase text-[var(--primary)] tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-[var(--primary)] rounded-full animate-pulse" />
              How to perform:
            </h4>
            <div className="space-y-5 pb-4">
              {exercise.instructions?.map((step: string, i: number) => (
                <div key={i} className="flex gap-4 group">
                  <span className="flex-shrink-0 w-8 h-8 rounded-2xl bg-[var(--bg-tertiary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-colors border border-[var(--border-color)] text-[var(--primary)] text-xs font-black flex items-center justify-center shadow-sm">
                    {i + 1}
                  </span>
                  <p className="text-[13px] leading-relaxed text-[var(--text-secondary)] font-medium pt-1">
                    {step}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Action - Using your btn-primary */}
        <div className="p-8 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="btn-primary w-full py-4 text-xs tracking-[0.2em] flex items-center justify-center gap-2 shadow-lg shadow-[var(--primary)]/20"
          >
            Finish Preview
          </button>
        </div>
      </div>
    </div>
  );
};
