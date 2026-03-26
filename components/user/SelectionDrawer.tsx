"use client";
import React, { useState } from "react";
import { Save, Trash2, X, ListChecks, Dumbbell} from "lucide-react";
import { Exercise } from "./workout";


interface SelectionDrawerProps {
  selectedExercises: Exercise[];
  onRemove: (ex: Exercise) => void;
  onSave: (userData: { planName: string; userName: string; userEmail: string }) => void;
  planName: string;
  setPlanName: (name: string) => void;
  userSession: { name: string; email: string };
}

export const SelectionDrawer = ({ 
  selectedExercises, 
  onRemove, 
  onSave, 
  planName, 
  setPlanName,
  userSession,
}: SelectionDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  if (selectedExercises.length === 0) return null;

  return (
    <>
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-10 z-[60] bg-[var(--primary)] text-white p-4 rounded-2xl shadow-[0_10px_30px_rgba(16,185,129,0.4)] flex items-center gap-3 active:scale-90 transition-all group animate-in slide-in-from-right duration-500"
        >
          <div className="relative">
            <ListChecks size={24} strokeWidth={2.5} />
            <span className="absolute -top-2 -right-2 bg-[var(--neutral-900)] text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-[var(--primary)] font-black">
              {selectedExercises.length}
            </span>
          </div>
          <span className="text-xs font-black uppercase tracking-[0.1em] hidden md:block">
            Preview Routine
          </span>
        </button>
      )}

      <div className={`fixed top-0 right-0 h-full w-full max-w-[380px] z-[100] transition-all duration-500 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="h-full bg-[var(--bg-secondary)] border-l border-[var(--border-color)] shadow-[-20px_0_50px_rgba(0,0,0,0.3)] flex flex-col">
          
          <div className="p-8 border-b border-[var(--border-color)] flex items-center justify-between bg-[var(--bg-secondary)]">
            <div>
              <h2 className="text-xl font-black uppercase  tracking-tighter text-[var(--text-primary)]">
                My <span className="text-[var(--primary)]">Routine</span>
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Dumbbell size={12} className="text-[var(--primary)]" />
                <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">
                  {selectedExercises.length} Movements added
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-10 h-10 flex items-center justify-center bg-[var(--bg-tertiary)] hover:bg-[var(--danger)] hover:text-white rounded-2xl transition-all text-[var(--text-muted)] active:scale-90"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {selectedExercises.map((ex) => (
              <div key={ex.id} className="flex items-center gap-4 bg-[var(--bg-primary)] p-3 rounded-[1.5rem] border border-[var(--border-color)] group hover:border-[var(--primary-light)] transition-all animate-in fade-in slide-in-from-right duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex-shrink-0 overflow-hidden border border-[var(--border-color)]">
                  <img src={`/exercises/${ex.images?.[0]}`} alt="" className="w-full h-full object-cover rounded-2xl" />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[12px] font-black uppercase truncate text-[var(--text-primary)] leading-tight">{ex.name}</p>
                  <p className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-tighter">{ex.equipment}</p>
                </div>
                <button 
                  onClick={() => {
                    onRemove(ex);
                    if(selectedExercises.length === 1) setIsOpen(false);
                  }}
                  className="p-3 text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-500/10 rounded-xl transition-all active:scale-75"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>

          <div className="p-8 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] space-y-5">
        <div>
          <label className="text-[10px] font-black uppercase text-[var(--text-muted)] mb-2 flex items-center gap-2">
            <Dumbbell size={12} className="text-[var(--primary)]" /> Routine Title
          </label>
          <input
            className="input-style !bg-[var(--bg-primary)] border-[var(--border-color)] font-bold uppercase"
            placeholder="e.g., MORNING WORKOUT"
            value={planName}
            onChange={(e) => setPlanName(e.target.value.toUpperCase())}
          />
        </div>
        
        <button
          disabled={!planName || selectedExercises.length === 0}
          onClick={() => onSave({ planName, userName: "", userEmail: "" })}
          className="btn-primary w-full flex items-center justify-center gap-3 py-5 text-xs font-black tracking-[0.2em] shadow-[0_8px_25px_rgba(16,185,129,0.25)] disabled:grayscale disabled:opacity-30"
        >
          <Save size={18} strokeWidth={3} /> SAVE ROUTINE
        </button>
      </div>
        </div>
      </div>

      {/* Overlay Background */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] animate-in fade-in duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};