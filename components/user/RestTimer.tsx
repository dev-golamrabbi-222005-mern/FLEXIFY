"use client";
import React, { useState, useEffect, useRef } from "react";
import { Timer, X, Plus, Minus } from "lucide-react";

interface RestTimerProps {
  onClose: () => void;
}

export default function RestTimer({ onClose }: RestTimerProps) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [targetTime, setTargetTime] = useState<number>(60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = (type: "tick" | "warning" | "finish") => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      const now = context.currentTime;

      if (type === "tick") {
        oscillator.frequency.setValueAtTime(400, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.05, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
      } else if (type === "warning") {
        oscillator.frequency.setValueAtTime(600, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.08, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
      } else {
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(0.1, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        oscillator.start(now);
        oscillator.stop(now + 0.5);
        if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      }
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime((prev) => {
        const nextTime = prev + 1;
        const remaining = targetTime - nextTime;

        if (remaining === 4 || remaining === 3) playSound("tick");
        if (remaining === 2 || remaining === 1) playSound("warning");
        if (remaining === 0) playSound("finish");

        return nextTime;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [targetTime]);

  useEffect(() => {
    if (currentTime >= targetTime) {
      onClose();
    }
  }, [currentTime, targetTime, onClose]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-[32px] p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-[var(--primary)]">
            <Timer size={18} className={targetTime - currentTime <= 5 ? "animate-ping" : "animate-pulse"} />
            <span className="font-black uppercase tracking-widest text-[10px]">Rest Phase</span>
          </div>
          <button onClick={onClose} className="p-1.5 bg-[var(--bg-tertiary)] rounded-full text-[var(--text-muted)] hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center justify-center py-6">
          <div className="flex items-baseline gap-2">
            <h3 className={`text-6xl font-black tabular-nums tracking-tighter transition-all duration-300 ${targetTime - currentTime <= 5 ? "text-[var(--primary)] scale-110" : "text-[var(--text-primary)]"}`}>
              {formatTime(currentTime)}
            </h3>
            <span className="text-2xl font-bold text-[var(--text-muted)]">/</span>
            <span className="text-2xl font-black tabular-nums text-[var(--primary)]">
              {formatTime(targetTime)}
            </span>
          </div>

          <div className="w-full h-1.5 bg-[var(--bg-tertiary)] rounded-full mt-6 overflow-hidden">
            <div 
              className="h-full bg-[var(--primary)] transition-all duration-1000 ease-linear"
              style={{ width: `${Math.min((currentTime / targetTime) * 100, 100)}%` }}
            />
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setTargetTime((prev) => Math.max(10, prev - 10))}
              className="w-14 h-12 rounded-xl border border-[var(--border-color)] flex flex-col items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors active:scale-95"
            >
              <Minus size={16} />
              <span className="text-[8px] font-bold">-10s</span>
            </button>

            <button 
              onClick={() => setTargetTime((prev) => prev + 10)}
              className="w-14 h-12 rounded-xl border border-[var(--border-color)] flex flex-col items-center justify-center hover:bg-[var(--bg-tertiary)] transition-colors active:scale-95"
            >
              <Plus size={16} />
              <span className="text-[8px] font-bold">+10s</span>
            </button>
          </div>
        </div>

        <button onClick={onClose} className="w-full bg-[var(--primary)] text-[var(--bg-primary)] py-3.5 rounded-2xl font-black uppercase tracking-widest text-xs mt-4 active:scale-95 transition-all shadow-lg shadow-[var(--primary)]/20">
          Skip Rest
        </button>
      </div>
    </div>
  );
}