"use client";

import React from "react";

interface ExerciseData {
  name: string;
  instructions: string[];
}

interface WorkoutActiveSessionCardProps {
  exercise: ExerciseData;
  step: number;
  setNumber: number;
  totalSets: number;
  rep: number;
  repsTarget: number;
  isResting: boolean;
  timeLeft: number;
  onNextInstruction: () => void;
  onAddRep: () => void;
}

export function WorkoutActiveSessionCard({
  exercise,
  step,
  setNumber,
  totalSets,
  rep,
  repsTarget,
  isResting,
  timeLeft,
  onNextInstruction,
  onAddRep,
}: WorkoutActiveSessionCardProps) {
  return (
    <div className="max-w-4xl p-6 mx-auto space-y-8">
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-[var(--text-primary)]">
          {exercise.name}
        </h1>
        <p className="text-[var(--text-secondary)]">
          Set {setNumber} / {totalSets}
        </p>
      </div>

      <div className="p-6 bg-[var(--bg-secondary)] rounded-xl shadow">
        <h2 className="mb-4 text-xl font-semibold">Step {step + 1}</h2>
        <p className="mb-6 text-[var(--text-primary)]">
          {exercise.instructions[step]}
        </p>
        <button
          onClick={onNextInstruction}
          className="px-4 py-2 text-white rounded bg-[var(--primary)] cursor-pointer"
        >
          Next Instruction
        </button>
      </div>

      <div className="p-6 text-center bg-[var(--bg-secondary)] rounded-xl shadow">
        <h2 className="mb-2 text-lg font-semibold">Rep Counter</h2>
        <p className="mb-4 text-3xl font-bold text-[var(--primary)]">
          {rep} / {repsTarget}
        </p>
        <button
          onClick={onAddRep}
          disabled={isResting || rep === repsTarget}
          className="px-6 py-3 text-white rounded-lg bg-[var(--primary)] cursor-pointer disabled:opacity-50"
        >
          +1 Rep
        </button>
      </div>

      {isResting && (
        <div className="p-6 text-center bg-[var(--primary)] rounded-xl text-white">
          <h2 className="mb-2 text-lg font-semibold">Rest Time</h2>
          <p className="text-3xl font-bold">{timeLeft}s</p>
        </div>
      )}

      <div className="p-6 bg-[var(--bg-secondary)] rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Workout Progress</h2>
        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
          <div
            className="h-3 rounded-full bg-[var(--primary)] transition-all duration-300"
            style={{
              width: `${((setNumber - 1 + rep / repsTarget) / totalSets) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
