"use client";

import React from "react";
import { Edit3, X, Clock } from "lucide-react";

interface CustomTaskModalProps {
  isOpen: boolean;
  activeDay: string | null;
  tempTask: string;
  setTempTask: (v: string) => void;
  tempTime: string;
  setTempTime: (v: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export default function CustomTaskModal({
  isOpen,
  activeDay,
  tempTask,
  setTempTask,
  tempTime,
  setTempTime,
  onSave,
  onClose,
}: CustomTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-md rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <Edit3 size={20} className="text-[var(--primary)]" />
            Custom Task: {activeDay}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <input
            autoFocus
            value={tempTask}
            onChange={(e) => setTempTask(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSave()}
            placeholder="e.g. Swimming"
            className="input-style w-full h-14 rounded-2xl text-lg"
          />
          <div className="flex items-center gap-3 bg-[var(--bg-primary)] p-3 rounded-2xl border border-[var(--border-color)]">
            <Clock size={20} className="text-[var(--primary)]" />
            <input
              type="time"
              value={tempTime}
              onChange={(e) => setTempTime(e.target.value)}
              className="bg-transparent text-[var(--text-primary)] outline-none w-full font-bold"
            />
          </div>
        </div>
        <button onClick={onSave} className="btn-primary w-full py-4 rounded-2xl font-bold">
          Set Custom Task
        </button>
      </div>
    </div>
  );
}
