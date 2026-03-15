"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { ChallengeExercise } from "./DayExerciseList";

// Extract YouTube video ID
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

interface Props {
  exercise: ChallengeExercise | null;
  onClose: () => void;
}

export function InfoModal({ exercise, onClose }: Props) {
  const videoId = getYouTubeId(exercise?.videos);

  return (
    <AnimatePresence>
      {exercise && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="w-full max-w-lg rounded-3xl overflow-hidden max-h-[85vh] overflow-y-auto"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            {/* Header */}
            <div
              className="sticky top-0 flex items-center justify-between px-5 py-4 border-b z-10"
              style={{
                borderColor: "var(--border-color)",
                background: "var(--bg-secondary)",
              }}
            >
              <h3
                className="font-black text-base truncate pr-4"
                style={{ color: "var(--text-primary)" }}
              >
                {exercise.name}
              </h3>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-[var(--bg-primary)] transition-colors shrink-0"
                style={{ color: "var(--text-secondary)" }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Video embed */}
              {videoId ? (
                <div className="rounded-2xl overflow-hidden aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div
                  className="rounded-2xl aspect-video flex items-center justify-center"
                  style={{ background: "var(--bg-primary)" }}
                >
                  <p
                    className="text-sm font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    No video available
                  </p>
                </div>
              )}

              {/* Sets / Reps / Rest */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Sets", val: exercise.sets },
                  { label: "Reps", val: exercise.reps },
                  { label: "Rest (s)", val: exercise.rest },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="text-center py-3 rounded-xl"
                    style={{
                      background: "rgba(244,121,32,0.08)",
                      border: "1px solid rgba(244,121,32,0.2)",
                    }}
                  >
                    <p
                      className="font-black text-xl leading-none"
                      style={{ color: "var(--primary)" }}
                    >
                      {s.val}
                    </p>
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider mt-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              {/* Instructions */}
              <div>
                <p
                  className="text-[11px] font-black uppercase tracking-widest mb-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  📋 Instructions
                </p>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  {exercise.instructions}
                </p>
              </div>

              {/* Muscles */}
              {exercise.muscles?.length > 0 && (
                <div>
                  <p
                    className="text-[11px] font-black uppercase tracking-widest mb-2"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    🎯 Muscles Worked
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {exercise.muscles.map((m) => (
                      <span
                        key={m}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold capitalize"
                        style={{
                          background: "var(--primary)15",
                          color: "var(--primary)",
                        }}
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Warning */}
              {exercise.warning && (
                <div
                  className="flex items-start gap-3 p-4 rounded-2xl"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    border: "1px solid rgba(239,68,68,0.25)",
                  }}
                >
                  <AlertTriangle
                    size={16}
                    className="shrink-0 mt-0.5"
                    style={{ color: "#ef4444" }}
                  />
                  <p className="text-sm" style={{ color: "#ef4444" }}>
                    <span className="font-black">Warning: </span>
                    {exercise.warning}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
