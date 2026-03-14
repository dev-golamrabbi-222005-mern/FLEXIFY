"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Level } from "@/lib/challengeUtils";

const LEVELS: { id: Level; label: string; emoji: string; desc: string; color: string }[] = [
  {
    id: "beginner",
    label: "Beginner",
    emoji: "🌱",
    desc: "New to working out. Light weights, basic movements.",
    color: "#22c55e",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    emoji: "⚡",
    desc: "Some experience. Ready to push harder.",
    color: "var(--primary)",
  },
  {
    id: "advance",
    label: "Advanced",
    emoji: "🔥",
    desc: "Experienced athlete. Max intensity.",
    color: "#ef4444",
  },
];

interface Props {
  open: boolean;
  challengeTitle: string;
  onSelect: (level: Level) => void;
  onClose: () => void;
}

export function LevelSelectModal({ open, challengeTitle, onSelect, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="w-full max-w-md rounded-3xl overflow-hidden"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div>
                <p
                  className="text-[10px] font-black uppercase tracking-widest mb-0.5"
                  style={{ color: "var(--primary)" }}
                >
                  Step 1 of 1
                </p>
                <h2
                  className="font-black text-lg tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {challengeTitle}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-6">
              <p
                className="text-sm mb-6"
                style={{ color: "var(--text-secondary)" }}
              >
                Choose your fitness level so we can tailor the workouts for you.
              </p>

              <div className="space-y-3">
                {LEVELS.map((lv, i) => (
                  <motion.button
                    key={lv.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    onClick={() => onSelect(lv.id)}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl text-left transition-all hover:scale-[1.02] active:scale-[0.98] group"
                    style={{
                      background: "var(--bg-primary)",
                      border: `1px solid var(--border-color)`,
                    }}
                    whileHover={{
                      borderColor: lv.color,
                      background: `${lv.color}08`,
                    }}
                  >
                    {/* Emoji circle */}
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${lv.color}15` }}
                    >
                      {lv.emoji}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-black text-base"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {lv.label}
                      </p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {lv.desc}
                      </p>
                    </div>

                    <span
                      className="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: lv.color }}
                    >
                      →
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
