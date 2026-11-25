"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coach, CoachSelectModalProps, ease } from "./coach-select/types";
import { DetailView } from "./coach-select/DetailView";
import { ConfirmView } from "./coach-select/ConfirmView";
import { CoachListView } from "./coach-select/CoachListView";

export type { Coach };

export function CoachSelectModal({
  open,
  eliteBasePrice,
  onClose,
  onProceedToPayment,
}: CoachSelectModalProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailCoach, setDetailCoach] = useState<Coach | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setDetailCoach(null);
        setSelectedCoach(null);
        setError(null);
      }, 0);
      return () => clearTimeout(t);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      if (!cancelled) setLoading(true);
      try {
        const res = await fetch("/api/coach");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const raw: Coach[] = Array.isArray(data)
          ? data
          : data.coaches ?? data.data ?? [];
        if (!cancelled) setCoaches(raw);
      } catch (err) {
        console.error("[CoachSelectModal] fetch error:", err);
        if (!cancelled) setError("Failed to load coaches. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [open]);

  const activeView = detailCoach ? "detail" : selectedCoach ? "confirm" : "list";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: 20 }}
            transition={{ duration: 0.35, ease }}
            className="w-full max-w-lg rounded-3xl overflow-hidden flex flex-col"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              height: "88vh",
              maxHeight: "88vh",
            }}
          >
            <AnimatePresence mode="wait">
              {activeView === "detail" && detailCoach && (
                <DetailView
                  key="detail"
                  coach={detailCoach}
                  base={eliteBasePrice}
                  onBack={() => setDetailCoach(null)}
                  onGetCoach={() => {
                    setSelectedCoach(detailCoach);
                    setDetailCoach(null);
                  }}
                />
              )}

              {activeView === "confirm" && selectedCoach && (
                <ConfirmView
                  key="confirm"
                  coach={selectedCoach}
                  base={eliteBasePrice}
                  onBack={() => setSelectedCoach(null)}
                  onProceed={() =>
                    onProceedToPayment(selectedCoach, eliteBasePrice + selectedCoach.charge)
                  }
                />
              )}

              {activeView === "list" && (
                <CoachListView
                  coaches={coaches}
                  eliteBasePrice={eliteBasePrice}
                  loading={loading}
                  error={error}
                  onClose={onClose}
                  onSelectDetail={(coach) => setDetailCoach(coach)}
                  onSelectCoach={(coach) => setSelectedCoach(coach)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
