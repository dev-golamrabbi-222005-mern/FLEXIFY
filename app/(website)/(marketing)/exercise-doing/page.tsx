"use client";

import { useEffect, useState } from "react";

export default function WorkoutSessionPage() {
  const exercise = "Dumbbell Goblet Squats";

  const targetSets = 4;
  const targetReps = 15;

  const [setsCompleted, setSetsCompleted] = useState(2);

  const [seconds, setSeconds] = useState(24);
  const [minutes, setMinutes] = useState(0);

  const progress = Math.round((setsCompleted / targetSets) * 100);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => {
        if (s === 59) {
          setMinutes((m) => m + 1);
          return 0;
        }
        return s + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const finishSet = () => {
    if (setsCompleted < targetSets) {
      setSetsCompleted((s) => s + 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Header */}

      <div className="mb-8">
        <p className="text-orange-500 text-sm font-semibold">
          CURRENTLY ACTIVE
        </p>

        <h1 className="text-3xl font-bold">{exercise}</h1>

        <p className="text-gray-500">
          Set {setsCompleted + 1} of {targetSets}
        </p>
      </div>

      {/* Timer */}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold">
            {String(minutes).padStart(2, "0")}
          </p>
          <p className="text-xs mt-2 text-gray-500">MINUTES</p>
        </div>

        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-orange-500">
            {String(seconds).padStart(2, "0")}
          </p>
          <p className="text-xs mt-2 text-gray-500">SECONDS</p>
        </div>
      </div>

      {/* Stats Cards */}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Sets Completed */}
        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-xs text-gray-500 mb-2">SETS COMPLETED</p>

          <p className="text-3xl font-bold">{setsCompleted}</p>
        </div>

        {/* Target Sets */}
        <div className="bg-gray-100 rounded-xl p-6">
          <p className="text-xs text-gray-500 mb-2">TARGET SETS</p>

          <p className="text-3xl font-bold">{targetSets}</p>
        </div>
      </div>

      {/* Target Reps */}

      <div className="bg-gray-100 rounded-xl p-6 mb-6">
        <p className="text-xs text-gray-500 mb-2">TARGET REPS</p>

        <p className="text-3xl font-bold">{targetReps}</p>
      </div>

      {/* Progress */}

      <div className="bg-orange-50 rounded-xl p-6 mb-6">
        <div className="flex justify-between mb-2">
          <p className="font-semibold">Set Progress</p>

          <p className="text-orange-500 font-bold">{progress}%</p>
        </div>

        <div className="w-full h-3 bg-orange-200 rounded-full">
          <div
            className="h-3 bg-orange-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <p>{targetSets - setsCompleted} sets remaining</p>

          <p>{targetSets} Total Goal</p>
        </div>
      </div>

      {/* AI Coach */}

      <div className="bg-blue-950 text-white p-6 rounded-xl mb-8">
        <p className="font-semibold mb-2">AI Form Coach</p>

        <ul className="text-sm space-y-1">
          <li>
            ✔ Keep your chest up and core engaged throughout the movement.
          </li>

          <li>⚠ Notice: You are leaning slightly too far forward.</li>
        </ul>
      </div>

      {/* Buttons */}

      <div className="grid grid-cols-2 gap-4">
        <button className="py-4 rounded-xl bg-gray-200 font-semibold">
          Pause
        </button>

        <button
          onClick={finishSet}
          className="py-4 rounded-xl bg-orange-500 text-white font-semibold"
        >
          Finish Set
        </button>
      </div>
    </div>
  );
}
