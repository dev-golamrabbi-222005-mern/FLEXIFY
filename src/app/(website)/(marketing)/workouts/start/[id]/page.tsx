"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { WorkoutActiveSessionCard } from "./WorkoutActiveSessionCard";

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

  const handleError = (error: unknown) => {
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
        handleError(error);
      }
    };

    startWorkout();
  }, [exercise]);

  useEffect(() => {
    if (!isResting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsResting(false);
          setRep(0);
          setSetNumber((s) => (s < TOTAL_SETS ? s + 1 : s));
          return REST_TIME;
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
      handleError(error);
    }

    if (newRep === REPS) {
      if (setNumber === TOTAL_SETS) {
        setCompleted(true);
        try {
          if (sessionId) {
            await axios.patch("/api/workouts/complete", { sessionId });
          }
        } catch (error) {
          handleError(error);
        }
      } else {
        setTimeLeft(REST_TIME);
        setIsResting(true);
      }
    }
  };

  if (completed) {
    return (
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="max-w-md p-10 text-center bg-[var(--bg-secondary)] rounded-2xl shadow-xl">
          <h1 className="mb-4 text-4xl font-bold text-[var(--success)]">
            Workout Complete 🎉
          </h1>
          <p className="mb-6 text-[var(--text-secondary)]">
            Great job finishing your workout!
          </p>
          <p className="mb-2">Total Sets: {TOTAL_SETS}</p>
          <p>Total Reps: {TOTAL_SETS * REPS}</p>
        </div>
      </div>
    );
  }

  return (
    <WorkoutActiveSessionCard
      exercise={exercise}
      step={step}
      setNumber={setNumber}
      totalSets={TOTAL_SETS}
      rep={rep}
      repsTarget={REPS}
      isResting={isResting}
      timeLeft={timeLeft}
      onNextInstruction={nextInstruction}
      onAddRep={addRep}
    />
  );
}
