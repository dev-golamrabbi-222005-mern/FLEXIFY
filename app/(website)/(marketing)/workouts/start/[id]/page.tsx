"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";

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

    // backend session id
    const [sessionId, setSessionId] = useState<string | null>(null);

    const { data: exercise, isLoading } = useQuery({
        queryKey: ["exercise", id],
        queryFn: async () => {
            const res = await axios.get(`/api/exercises/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    // -----------------------------
    // START WORKOUT SESSION
    // -----------------------------
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
                Swal.fire("Workout start failed", error.message, "error");
            }
        };

        startWorkout();
    }, [exercise]);

    // -----------------------------
    // REST TIMER
    // -----------------------------
    useEffect(() => {
        if (!isResting) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [isResting]);

    useEffect(() => {
        if (timeLeft !== 0) return;

        setIsResting(false);
        setRep(0);
        setTimeLeft(REST_TIME);

        setSetNumber((prev) => {
            if (prev < TOTAL_SETS) {
                return prev + 1;
            }
            return prev;
        });

    }, [timeLeft]);

    if (isLoading || !exercise) {
        return <div className="p-10 text-center">Loading Workout...</div>;
    }

    const nextInstruction = () => {
        if (step < exercise.instructions.length - 1) {
            setStep(step + 1);
        }
    };

    // -----------------------------
    // REP BUTTON LOGIC
    // -----------------------------
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
            Swal.fire("Progress update failed", error.message, "error");
        }

        if (newRep === REPS) {
            if (setNumber === TOTAL_SETS) {
                setCompleted(true);

                try {
                    if (sessionId) {
                        await axios.patch("/api/workouts/complete", {
                            sessionId,
                        });
                    }
                } catch (error) {
                    Swal.fire("Workout completion failed", error.message, "error");
                }
            } else {
                setTimeLeft(REST_TIME);
                setIsResting(true);
            }
        }
    };

    // -----------------------------
    // WORKOUT COMPLETE SCREEN
    // -----------------------------
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

                <h2 className="mb-4 text-xl font-semibold">
                Step {step + 1}
                </h2>

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

                <h2 className="mb-2 text-lg font-semibold">
                Rep Counter
                </h2>

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
                <div className="p-6 text-center bg-(--primary) rounded-xl">

                <h2 className="mb-2 text-lg font-semibold">
                    Rest Time
                </h2>

                <p className="text-3xl font-bold">
                    {timeLeft}s
                </p>

                </div>
            )}

            {/* Progress */}
            <div className="p-6 bg-(--bg-secondary) rounded-xl shadow">

                <h2 className="mb-3 font-semibold">
                Workout Progress
                </h2>

                <div className="w-full h-3 bg-gray-200 rounded-full">

                <div
                    className="h-3 rounded-full bg-(--primary)"
                    style={{
                    width: `${((setNumber - 1 + rep / REPS) / TOTAL_SETS) * 100}%`,
                    }}
                />

                </div>

            </div>

        </div>
    );
}