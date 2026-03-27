"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

export default function WorkoutSessionPage() {
  const params = useParams();
  const id = params.id as string;

  const TOTAL_SETS = 3;
  const REPS = 12;
  const REST_TIME = 60;

  const startedRef = useRef(false);

  const [rep, setRep] = useState(0);
  const [setNumber, setSetNumber] = useState(1);
  const [step, setStep] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [timeLeft, setTimeLeft] = useState(REST_TIME);
  const [completed, setCompleted] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Helper to handle TypeScript "unknown" errors safely
  const handleError = (error: unknown, title: string) => {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    toast.error(message);
  };

  const { data: exercise, isLoading } = useQuery({
    queryKey: ["exercise", id],
    queryFn: async () => {
      const res = await axios.get(`/api/exercises/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // 1. START WORKOUT SESSION
  useEffect(() => {
    if (!exercise || startedRef.current) return;
    startedRef.current = true;

    const startWorkout = async () => {
      try {
        const res = await axios.post("/api/workouts/start", {
          exerciseId: exercise._id,
          totalSets: TOTAL_SETS,
          totalReps: REPS,
        });
        setSessionId(res.data.sessionId);
      } catch (error) {
        handleError(error, "Workout start failed");
      }
    };

    startWorkout();
  }, [exercise]);

  // 2. COMBINED REST TIMER (Fixes Cascading Render)
  useEffect(() => {
    if (!isResting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // When timer hits 0, we do all resets HERE instead of a separate useEffect
          setIsResting(false);
          setRep(0);
          setSetNumber((s) => (s < TOTAL_SETS ? s + 1 : s));
          return REST_TIME; // Reset internal state for next rest
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isResting]);

  if (isLoading || !exercise) {
    return <div className="p-10 text-center">Loading Workout...</div>;
  }

  const nextInstruction = () => {
    if (step < exercise.instructions.length - 1) {
      setStep(step + 1);
    }
  };

  // 3. REP BUTTON LOGIC
  const addRep = async () => {
    if (isResting || rep >= REPS) return;
    const newRep = rep + 1;
    setRep(newRep);

    try {
      if (sessionId) {
        await axios.patch("/api/workouts/progress", {
          sessionId,
          set: setNumber,
          rep: newRep,
        });
      }
    } catch (error) {
      handleError(error, "Progress update failed");
    }

    if (newRep === REPS) {
      if (setNumber === TOTAL_SETS) {
        setCompleted(true);
        try {
          if (sessionId) {
            await axios.patch("/api/workouts/complete", { sessionId });
          }
        } catch (error) {
          handleError(error, "Workout completion failed");
        }
      } else {
        setTimeLeft(REST_TIME);
        setIsResting(true);
      }
    }
  };

  // ... (rest of your JSX remains the same)
  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-md p-10 text-center bg-(--bg-secondary) rounded-2xl shadow-xl">
          <h1 className="mb-4 text-4xl font-bold text-(--success)">
            Workout Complete 🎉
          </h1>
          <p className="mb-6 text-(--text-secondary)">
            Great job finishing your workout!
          </p>
          <p className="mb-2">Total Sets: {TOTAL_SETS}</p>
          <p>Total Reps: {TOTAL_SETS * REPS}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="mb-2 text-3xl font-bold text-(--text-primary)">
          {exercise.name}
        </h1>
        <p className="text-(--text-secondary)">
          Set {setNumber} / {TOTAL_SETS}
        </p>
      </div>

      {/* Instruction Step */}
      <div className="p-6 bg-(--bg-secondary) rounded-xl shadow">
        <h2 className="mb-4 text-xl font-semibold">Step {step + 1}</h2>
        <p className="mb-6 text-(--text-primary)">
          {exercise.instructions[step]}
        </p>
        <button
          onClick={nextInstruction}
          className="px-4 py-2 text-white rounded bg-(--primary)"
        >
          Next Instruction
        </button>
      </div>

      {/* Rep Counter */}
      <div className="p-6 text-center bg-(--bg-secondary) rounded-xl shadow">
        <h2 className="mb-2 text-lg font-semibold">Rep Counter</h2>
        <p className="mb-4 text-3xl font-bold text-(--primary)">
          {rep} / {REPS}
        </p>
        <button
          onClick={addRep}
          disabled={isResting || rep === REPS}
          className="px-6 py-3 text-white rounded-lg bg-(--primary)"
        >
          +1 Rep
        </button>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="p-6 text-center bg-(--primary) rounded-xl text-white">
          <h2 className="mb-2 text-lg font-semibold">Rest Time</h2>
          <p className="text-3xl font-bold">{timeLeft}s</p>
        </div>
      )}

      {/* Progress Bar */}
      <div className="p-6 bg-(--bg-secondary) rounded-xl shadow">
        <h2 className="mb-3 font-semibold">Workout Progress</h2>
        <div className="w-full h-3 bg-gray-200 rounded-full">
          <div
            className="h-3 rounded-full bg-(--primary) transition-all duration-300"
            style={{
              width: `${((setNumber - 1 + rep / REPS) / TOTAL_SETS) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
