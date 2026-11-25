// src/app/(website)/(marketing)/exercises/[id]/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { Exercise, PageState } from "@/components/exercises/detail/types";
import { DetailView } from "@/components/exercises/detail/DetailView";
import { SessionView } from "@/components/exercises/detail/SessionView";
import { CompleteView } from "@/components/exercises/detail/CompleteView";
import { EditGoalSheet } from "@/components/exercises/detail/EditGoalSheet";

export default function WorkoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const router = useRouter();
  const [ex, setEx] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<PageState>("detail");
  const [targetSets, setTargetSets] = useState(4);
  const [targetReps, setTargetReps] = useState(10);
  const [targetWeight, setTargetWeight] = useState(60);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [completedDuration, setCompletedDuration] = useState(0);
  const [completedSets, setCompletedSets] = useState(0);

  useEffect(() => {
    fetch(`/api/exercises/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setEx(d.exercise);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleComplete = useCallback((duration: number, sets: number) => {
    setCompletedDuration(duration);
    setCompletedSets(sets);
    setState("complete");
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "var(--primary)" }}
        />
      </div>
    );
  }

  if (!ex) {
    return (
      <div className="text-center py-20">
        <p className="text-4xl mb-3">❌</p>
        <p className="font-bold" style={{ color: "var(--text-primary)" }}>
          Exercise not found
        </p>
        <button
          onClick={() => router.push("/dashboard/exercise")}
          className="mt-4 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: "var(--primary)" }}
        >
          Back to Exercises
        </button>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <AnimatePresence mode="wait">
        {state === "detail" && (
          <motion.div
            key="detail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <DetailView
              ex={ex}
              targetSets={targetSets}
              targetReps={targetReps}
              targetWeight={targetWeight}
              onEditGoal={() => setEditGoalOpen(true)}
              onStart={() => setState("session")}
            />
          </motion.div>
        )}

        {state === "session" && (
          <motion.div
            key="session"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <SessionView
              ex={ex}
              targetSets={targetSets}
              targetReps={targetReps}
              targetWeight={targetWeight}
              onComplete={handleComplete}
              onQuit={() => setState("detail")}
            />
          </motion.div>
        )}

        {state === "complete" && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <CompleteView
              ex={ex}
              sets={completedSets}
              reps={targetReps}
              weight={targetWeight}
              duration={completedDuration}
              onReset={() => setState("detail")}
              onNext={() => router.push("/dashboard/exercise")}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {editGoalOpen && (
          <EditGoalSheet
            sets={targetSets}
            reps={targetReps}
            weight={targetWeight}
            onSave={(s, r, w) => {
              setTargetSets(s);
              setTargetReps(r);
              setTargetWeight(w);
            }}
            onClose={() => setEditGoalOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
