"use client";
import React, { useState, useEffect } from "react";
import { Timer, X, Plus, Minus } from "lucide-react";

interface RestTimerProps {
  onClose: () => void;
}

export default function RestTimer({ onClose }: RestTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onClose();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onClose]);

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Timer size={18} />
            <span className="font-black uppercase tracking-widest text-[10px]">Rest Phase</span>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-muted)] hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <h3 className="text-6xl font-black tabular-nums tracking-tighter text-[var(--text-primary)]">
            {timeLeft}<span className="text-lg text-[var(--primary)] ml-1">s</span>
          </h3>
          
          <div className="flex gap-4 mt-6">
            <button 
              onClick={() => setTimeLeft((prev) => Math.max(0, prev - 10))} 
              className="w-12 h-12 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors active:scale-90"
            >
              <Minus size={18} />
            </button>
            <button 
              onClick={() => setTimeLeft((prev) => prev + 10)} 
              className="w-12 h-12 rounded-xl border border-[var(--border-color)] flex items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors active:scale-90"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        <button 
          onClick={onClose} 
          className="w-full bg-[var(--primary)] text-[var(--bg-primary)] py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 hover:opacity-90 active:scale-95 transition-all"
        >
          Skip Rest
        </button>
      </div>
    </div>
  );
}