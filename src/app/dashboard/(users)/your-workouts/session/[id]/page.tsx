"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { useWorkoutSession } from "@/components/workouts/session/useWorkoutSession";
import { RestOverlay } from "@/components/workouts/session/RestOverlay";
import { InfoModal } from "@/components/workouts/session/InfoModal";
import { SessionHeader } from "@/components/workouts/session/SessionHeader";
import { SessionActiveExercise } from "@/components/workouts/session/SessionActiveExercise";
import { SessionBottomBar } from "@/components/workouts/session/SessionBottomBar";

export default function WorkoutSessionPage() {
  const {
    router,
    exIdx,
    setExIdx,
    exercises,
    phase,
    setPhase,
    restLeft,
    setRestLeft,
    totalRest,
    elapsed,
    running,
    setRunning,
    isSaving,
    infoOpen,
    setInfoOpen,
    isLoading,
    current,
    isLastExercise,
    completedSets,
    totalSets,
    allSetsDone,
    currentSetNum,
    progress,
    handleToggleSet,
    handleChangeSet,
    handleAddSet,
    handleFinish,
  } = useWorkoutSession();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 bg-[var(--bg-primary)]">
        <Loader2 size={32} className="animate-spin text-[var(--primary)]" />
        <p className="text-[11px] font-black uppercase tracking-widest text-[var(--text-muted)]">
          Loading session...
        </p>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4 pb-28">
      <title>Your Session | Dashboard - Flexify</title>
      <SessionHeader
        elapsed={elapsed}
        running={running}
        isRest={phase === "rest"}
        onQuit={() => router.back()}
        progress={progress}
        exIdx={exIdx}
        totalExercises={exercises.length}
        name={current.name}
        completedSets={completedSets}
        totalSets={totalSets}
        currentSetNum={currentSetNum}
      />

      <SessionActiveExercise
        current={current}
        completedSets={completedSets}
        totalSets={totalSets}
        elapsed={elapsed}
        onOpenInfo={() => setInfoOpen(true)}
        onToggleSet={handleToggleSet}
        onChangeSet={handleChangeSet}
        onAddSet={handleAddSet}
      />

      <SessionBottomBar
        running={running}
        onToggleRunning={() => setRunning((r) => !r)}
        isSaving={isSaving}
        allSetsDone={allSetsDone}
        isLastExercise={isLastExercise}
        onNext={() => {
          if (isLastExercise) handleFinish();
          else {
            setExIdx((i) => i + 1);
            setPhase("exercise");
          }
        }}
        onFinish={handleFinish}
      />

      {phase === "rest" && (
        <RestOverlay
          restLeft={restLeft}
          totalRest={totalRest}
          nextLabel={isLastExercise ? "Finish workout!" : `Next: ${exercises[exIdx + 1]?.name ?? "Exercise"}`}
          onSkip={() => {
            setPhase("exercise");
            setRestLeft(0);
          }}
        />
      )}

      <InfoModal exercise={infoOpen ? current : null} onClose={() => setInfoOpen(false)} />
    </div>
  );
}
