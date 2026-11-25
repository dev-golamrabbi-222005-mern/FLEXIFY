"use client";
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Play,
  Clock,
  Save,
  ChevronLeft,
  CheckCircle2,
  Pause,
  Info,
  Plus,
  Zap,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Exercise, WorkoutResponse } from "@/components/user/workout";
import { toast } from "react-toastify";

// ── Constants ─────────────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];
const RADIUS = 40;
const CIRC = 2 * Math.PI * RADIUS;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

interface SetData {
  id?: string;
  weight?: string;
  reps?: string;
  seconds?: string;
  previous?: string;
  isCompleted?: boolean;
}

// ── Rest Overlay — SVG ring ───────────────────────────────────────────────────
function RestOverlay({
  restLeft,
  totalRest,
  nextLabel,
  onSkip,
}: {
  restLeft: number;
  totalRest: number;
  nextLabel: string;
  onSkip: () => void;
}) {
  const restPct = totalRest > 0 ? restLeft / totalRest : 0;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ type: "spring", stiffness: 300, damping: 26 }}
          className="w-full max-w-xs rounded-3xl p-8 text-center"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-widest mb-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Rest Time
          </p>
          <p
            className="text-sm font-semibold mb-6"
            style={{ color: "var(--primary)" }}
          >
            {nextLabel}
          </p>
          <div className="relative w-28 h-28 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48"
                cy="48"
                r={RADIUS}
                fill="none"
                stroke="var(--border-color)"
                strokeWidth="6"
              />
              <motion.circle
                cx="48"
                cy="48"
                r={RADIUS}
                fill="none"
                stroke="var(--primary)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                animate={{ strokeDashoffset: CIRC * restPct }}
                transition={{ duration: 0.8 }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="font-black text-3xl leading-none"
                style={{
                  color:
                    restLeft === 0 ? "var(--primary)" : "var(--text-primary)",
                }}
              >
                {restLeft === 0 ? "GO!" : restLeft}
              </span>
              {restLeft > 0 && (
                <span
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: "var(--text-secondary)" }}
                >
                  sec
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onSkip}
            className="w-full py-3 rounded-2xl font-black text-sm text-white hover:brightness-110 transition-all"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
            }}
          >
            Skip Rest →
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Set input row ─────────────────────────────────────────────────────────────
function SetInputRow({
  set,
  setIdx,
  trackingType,
  onToggle,
  onChange,
}: {
  set: SetData;
  setIdx: number;
  trackingType?: string;
  onToggle: (setIdx: number) => void;
  onChange: (setIdx: number, field: string, val: string) => void;
}) {
  const done = !!set.isCompleted;
  const isTime = trackingType === "TIME";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: setIdx * 0.04 }}
      className="grid items-center gap-3 px-5 py-3 rounded-2xl backdrop-blur-md"
      style={{
        gridTemplateColumns: "32px 1fr 1fr 40px",
        background: done ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.03)",
        boxShadow: done
          ? "0 4px 20px rgba(16,185,129,0.15)"
          : "0 4px 20px rgba(0,0,0,0.15)",
        border: "1px solid rgba(255,255,255,0.06)",
        opacity: done ? 0.8 : 1,
      }}
    >
      {/* Index */}
      <span
        className="text-sm font-semibold text-center"
        style={{
          color: done ? "var(--primary)" : "var(--text-secondary)",
        }}
      >
        {setIdx + 1}
      </span>

      {/* Weight / Time */}
      <input
        type="number"
        placeholder={isTime ? "sec" : "kg"}
        value={isTime ? (set.seconds ?? "") : (set.weight ?? "")}
        onChange={(e) =>
          onChange(setIdx, isTime ? "seconds" : "weight", e.target.value)
        }
        disabled={done}
        className="w-full text-center text-sm font-semibold rounded-xl px-3 py-2 outline-none transition-all focus:scale-[1.02]"
        style={{
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "var(--text-primary)",
        }}
      />

      {/* Reps */}
      {!isTime ? (
        <input
          type="number"
          placeholder="reps"
          value={set.reps ?? ""}
          onChange={(e) => onChange(setIdx, "reps", e.target.value)}
          disabled={done}
          className="w-full text-center text-sm font-semibold rounded-xl px-3 py-2 outline-none transition-all focus:scale-[1.02]"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "var(--text-primary)",
          }}
        />
      ) : (
        <div />
      )}

      {/* Toggle Button */}
      <button
        onClick={() => onToggle(setIdx)}
        className="w-12 h-12 flex items-center justify-center cursor-pointer rounded-xl transition-all duration-200 active:scale-95"
        style={{
          background: done
            ? "linear-gradient(135deg, #10b981, #34d399)"
            : "var(--primary-light)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: done ? "0 4px 12px rgba(16,185,129,0.4)" : "none",
        }}
      >
        <CheckCircle2 size={18} color={done ? "#FFFFFF" : "#000000"} />
      </button>
    </motion.div>
  );
}

// ── Info Modal ────────────────────────────────────────────────────────────────
function InfoModal({
  exercise,
  onClose,
}: {
  exercise: Exercise | null;
  onClose: () => void;
}) {
  if (!exercise) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end justify-center p-4"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.3, ease }}
          className="w-full max-w-md rounded-3xl p-6 space-y-4"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between">
            <h3
              className="font-black text-base"
              style={{ color: "var(--text-primary)" }}
            >
              {exercise.name}
            </h3>
            <button
              onClick={onClose}
              className="text-[var(--text-secondary)] hover:text-[var(--primary)]"
            >
              ✕
            </button>
          </div>
          {exercise.instructions && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {(Array.isArray(exercise.instructions)
                ? exercise.instructions
                : [exercise.instructions]
              ).map((ins: string, i: number) => (
                <div key={i} className="flex gap-2.5">
                  <span
                    className="font-black text-xs shrink-0 mt-0.5"
                    style={{ color: "var(--primary)" }}
                  >
                    {i + 1}.
                  </span>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {ins}
                  </p>
                </div>
              ))}
            </div>
          )}
          {exercise.primaryMuscles && exercise.primaryMuscles.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {exercise.primaryMuscles.map((m: string) => (
                <span
                  key={m}
                  className="px-2 py-0.5 rounded-lg text-[10px] font-black capitalize"
                  style={{
                    background: "rgba(16,185,129,0.1)",
                    color: "var(--primary)",
                  }}
                >
                  {m}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WorkoutSessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [exIdx, setExIdx] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [phase, setPhase] = useState<"exercise" | "rest">("exercise");
  const [restLeft, setRestLeft] = useState(0);
  const [totalRest, setTotalRest] = useState(30);
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [imgErr, setImgErr] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const { data: routineData, isLoading } = useQuery<WorkoutResponse>({
    queryKey: ["session-routine", id],
    queryFn: async () => {
      const res = await axios.get(`/api/routines/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Init exercises
  useEffect(() => {
    if (routineData?.success && exercises.length === 0) {
      const initial = routineData.data.exercises.map((ex) => ({
        ...ex,
        sets:
          ex.sets && ex.sets.length > 0
            ? ex.sets.map((s) => ({
                ...s,
                isCompleted: false,
                previous: s.previous || "-",
              }))
            : [
                {
                  id: crypto.randomUUID(),
                  weight: "",
                  reps: "",
                  seconds: "",
                  previous: "-",
                  isCompleted: false,
                },
              ],
      }));
      setExercises(initial);
    }
  }, [routineData, exercises.length]);

  // Elapsed timer
  useEffect(() => {
    if (!running || phase === "rest") return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [running, phase]);

  // Rest countdown
  const advanceAfterRest = () => {
    setPhase("exercise");
    setRestLeft(0);
  };
  useEffect(() => {
    if (phase !== "rest") return;
    if (restLeft <= 0) {
      const t = setTimeout(() => advanceAfterRest(), 0);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRestLeft((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, restLeft]);

  // Reset image on exercise change
  useEffect(() => {
    setImgErr(false);
    setImgIdx(0);
  }, [exIdx]);

  const current = exercises[exIdx];
  const isLastExercise = exIdx >= exercises.length - 1;
  const completedSets = current?.sets?.filter((s) => s.isCompleted).length ?? 0;
  const totalSets = current?.sets?.length ?? 0;
  const allSetsDone = completedSets === totalSets && totalSets > 0;
  const currentSetNum = Math.min(completedSets + 1, totalSets);
  const progress = totalSets > 0 ? completedSets / totalSets : 0;

  const handleToggleSet = (setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        return {
          ...ex,
          sets: ex.sets.map((s, j) => {
            if (j !== setIdx) return s;
            const isNow = !s.isCompleted;
            if (isNow) {
              setTotalRest(30);
              setRestLeft(30);
              setTimeout(() => setPhase("rest"), 50);
            }
            return { ...s, isCompleted: isNow };
          }),
        };
      }),
    );
  };

  const handleChangeSet = (setIdx: number, field: string, val: string) => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: ex.sets.map((s, j) =>
                j === setIdx ? { ...s, [field]: val } : s,
              ),
            },
      ),
    );
  };

  const handleAddSet = () => {
    setExercises((prev) =>
      prev.map((ex, i) =>
        i !== exIdx
          ? ex
          : {
              ...ex,
              sets: [
                ...ex.sets,
                {
                  id: crypto.randomUUID(),
                  weight: "",
                  reps: "",
                  seconds: "",
                  previous: "-",
                  isCompleted: false,
                },
              ],
            },
      ),
    );
  };

  const handleNextExercise = () => {
    if (isLastExercise) handleFinish();
    else {
      setExIdx((i) => i + 1);
      setPhase("exercise");
    }
  };

  const handleFinish = async () => {
    const completedExercises = exercises
      .map((ex) => ({
        exerciseId: (ex._id || ex.id)?.toString(),
        name: ex.name,
        trackingType: ex.trackingType,
        sets: ex.sets.filter((s) => s.isCompleted),
      }))
      .filter((ex) => ex.sets.length > 0);

    if (completedExercises.length === 0) {
      toast.warning("Please complete at least one set before finishing!", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    setIsSaving(true);
    try {
      const res = await axios.post("/api/routines/finish", {
        routineId: id,
        planName: routineData?.data?.planName,
        duration: elapsed,
        exercises: completedExercises,
        date: new Date().toISOString(),
      });
      if (res.data.success) {
        toast.success("Workout saved! Keep it up 💪");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save workout session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || (routineData && exercises.length === 0)) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 gap-3"
        style={{ background: "var(--bg-primary)" }}
      >
        <Loader2
          size={32}
          className="animate-spin"
          style={{ color: "var(--primary)" }}
        />
        <p
          className="text-[11px] font-black uppercase tracking-widest animate-pulse"
          style={{ color: "var(--text-muted)" }}
        >
          Loading session...
        </p>
      </div>
    );
  }

  if (!current) return null;

  const imgSrc =
    !imgErr && current.images?.[imgIdx]
      ? `/exercises/${current.images[imgIdx]}`
      : null;
  const nextLabel = isLastExercise
    ? "Get ready to finish!"
    : `Next: ${exercises[exIdx + 1]?.name ?? "exercise"}`;

  return (
    <div className="space-y-4 pb-24s">
      <title>Your Session | Dashboard - Flexify</title>

      {/* ── Top bar — same as SessionView ── */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => setQuitConfirm(true)}
          className="flex items-center gap-1.5 text-sm font-semibold transition-colors hover:text-[var(--primary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <ChevronLeft size={16} /> Quit
        </button>
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
          }}
        >
          <Clock
            size={13}
            className={running && phase !== "rest" ? "animate-pulse" : ""}
            style={{ color: "var(--primary)" }}
          />
          <span
            className="font-black text-sm tabular-nums"
            style={{ color: "var(--text-primary)" }}
          >
            {fmt(elapsed)}
          </span>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: "var(--border-color)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: "var(--primary)" }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>

      {/* ── Currently Active label + exercise name — same as SessionView ── */}
      <div>
        <p
          className="text-[11px] font-black uppercase tracking-widest mb-0.5"
          style={{ color: "var(--primary)" }}
        >
          Exercise {exIdx + 1} of {exercises.length} · Currently Active
        </p>
        <h1
          className="font-black tracking-tight"
          style={{
            fontSize: "clamp(20px, 4vw, 28px)",
            color: "var(--text-primary)",
          }}
        >
          {current.name}
        </h1>

        {/* Set dots — same as SessionView */}
        <div className="flex items-center gap-2 mt-2">
          {current.sets.map((_, i) => (
            <motion.div
              key={i}
              animate={{
                scale: i + 1 === currentSetNum ? 1.3 : 1,
                backgroundColor:
                  i < completedSets
                    ? "var(--primary)"
                    : i + 1 === currentSetNum
                      ? "var(--primary)"
                      : "var(--border-color)",
                opacity: i < completedSets ? 0.5 : 1,
              }}
              className="w-2.5 h-2.5 rounded-full transition-all"
            />
          ))}
          <span
            className="text-xs font-bold ml-1"
            style={{ color: "var(--text-secondary)" }}
          >
            Set {currentSetNum} of {totalSets}
          </span>
        </div>
      </div>

      {/* ── Big timer card — same as SessionView ── */}
      <div
        className="rounded-3xl p-4 text-center relative overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        {/* Faint set number watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <span
            className="font-black"
            style={{ fontSize: 120, color: "var(--primary)", lineHeight: 1 }}
          >
            {String(completedSets + 1)}
          </span>
        </div>
        <p
          className="text-[10px] font-black uppercase tracking-widest mb-1 relative z-10"
          style={{ color: "var(--text-secondary)" }}
        >
          Elapsed Time
        </p>
        <div className="relative z-10 flex items-baseline justify-center gap-3">
          <div className="text-center">
            <p
              className="font-black tabular-nums"
              style={{
                fontSize: 44,
                lineHeight: 1,
                color: "var(--text-primary)",
              }}
            >
              {String(Math.floor(elapsed / 60)).padStart(2, "0")}
            </p>
            <p
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              min
            </p>
          </div>
          <span
            className="font-black text-3xl pb-4"
            style={{ color: "var(--border-color)" }}
          >
            :
          </span>
          <div className="text-center">
            <p
              className="font-black tabular-nums"
              style={{ fontSize: 44, lineHeight: 1, color: "var(--primary)" }}
            >
              {String(elapsed % 60).padStart(2, "0")}
            </p>
            <p
              className="text-[10px] font-black uppercase tracking-wider"
              style={{ color: "var(--text-secondary)" }}
            >
              sec
            </p>
          </div>
        </div>
      </div>

      {/* ── Image + Info button ── */}
      <div
        key={exIdx}
        className="relative rounded-2xl overflow-hidden"
        style={{ aspectRatio: "16/9" }}
      >
        {imgSrc ? (
          <>
            <img
              src={imgSrc}
              alt={current.name}
              className="w-full h-full object-cover"
              onError={() => {
                if (imgIdx < (current.images?.length ?? 0) - 1)
                  setImgIdx((i) => i + 1);
                else setImgErr(true);
              }}
            />
            {current.images && current.images.length > 1 && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {current.images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === imgIdx ? 18 : 6,
                      height: 6,
                      background:
                        i === imgIdx
                          ? "var(--primary)"
                          : "rgba(255,255,255,0.45)",
                    }}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div
            className="w-full h-full flex flex-col items-center justify-center gap-2"
            style={{ background: "var(--bg-secondary)" }}
          >
            <span className="text-5xl">🏋️</span>
            <p
              className="text-xs font-bold"
              style={{ color: "var(--text-secondary)" }}
            >
              {current.name}
            </p>
          </div>
        )}
        <div
          className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
          style={{
            background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
          }}
        />
        <button
          onClick={() => setInfoOpen(true)}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110"
          style={{
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
          }}
        >
          <Info size={16} />
        </button>
      </div>

      {/* ── Stats row — same emoji cards as SessionView ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: "✅", label: "Sets Done", val: completedSets, isStr: false },
          { icon: "⚡", label: "Total Sets", val: totalSets, isStr: false },
          {
            icon: "🏋️",
            label: "Exercises",
            val: exercises.length,
            isStr: false,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl p-4 text-center"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
            }}
          >
            <span className="text-xl block mb-1">{s.icon}</span>
            <p
              className="font-black text-xl leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {s.val}
            </p>
            <p
              className="text-[10px] font-bold uppercase tracking-wider mt-0.5"
              style={{ color: "var(--text-secondary)" }}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Set inputs card ── */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div
          className="grid text-[9px] font-black uppercase tracking-widest px-4 py-2.5 border-b"
          style={{
            gridTemplateColumns: "28px 1fr 1fr 36px",
            color: "var(--text-secondary)",
            gap: "0.5rem",
            borderColor: "var(--border-color)",
          }}
        >
          <span className="text-center">SET</span>
          <span className="text-center">
            {current.trackingType === "TIME" ? "TIME (s)" : "WEIGHT (kg)"}
          </span>
          {current.trackingType !== "TIME" && (
            <span className="text-center">REPS</span>
          )}
          <span className="text-center">✓</span>
        </div>
        <div className="p-3 space-y-2">
            {current.sets.map((set, si) => (
              <SetInputRow
                key={set.id ?? si}
                set={set}
                setIdx={si}
                trackingType={current.trackingType}
                onToggle={handleToggleSet}
                onChange={handleChangeSet}
              />
            ))}
          <button
            onClick={handleAddSet}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all hover:bg-[var(--primary)]/10"
            style={{
              border: "1.5px dashed var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <Plus size={12} /> Add Set
          </button>
        </div>
      </div>

      {/* ── Progress card — same as SessionView ── */}
      <div
        className="rounded-2xl p-4"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <p
            className="text-sm font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            Set Progress
          </p>
          <p className="text-sm font-black" style={{ color: "var(--primary)" }}>
            {Math.round(progress * 100)}%
          </p>
        </div>
        <div
          className="h-3 w-full rounded-full"
          style={{ background: "var(--border-color)" }}
        >
          <motion.div
            className="h-3 rounded-full"
            style={{ background: "var(--primary)" }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease }}
          />
        </div>
        <div
          className="flex justify-between text-[11px] mt-1.5"
          style={{ color: "var(--text-secondary)" }}
        >
          <span>{totalSets - completedSets} sets remaining</span>
          <span>{totalSets} total</span>
        </div>
      </div>

      {/* ── Muscles ── */}
      {(current.primaryMuscles?.length ?? 0) > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {current.primaryMuscles?.map((m) => (
            <span
              key={m}
              className="px-2 py-0.5 rounded-lg text-[10px] font-black capitalize"
              style={{
                background: "rgba(16,185,129,0.1)",
                color: "var(--primary)",
              }}
            >
              {m}
            </span>
          ))}
          {current.secondaryMuscles?.map((m) => (
            <span
              key={m}
              className="px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              {m}
            </span>
          ))}
        </div>
      )}

      {/* ── AI Tips card — same dark card as SessionView ── */}
      <div
        className="rounded-2xl p-5"
        style={{ background: "#0f172a", border: "1px solid #1e293b" }}
      >
        <p className="font-bold text-sm text-white mb-3 flex items-center gap-2">
          <Zap size={14} style={{ color: "var(--primary)" }} /> AI Form Coach
        </p>
        <ul className="space-y-2">
          <li className="text-sm flex items-start gap-2 text-white/75">
            <span className="shrink-0 mt-0.5 text-emerald-400">✔</span>
            Keep your core engaged and maintain proper posture throughout the
            movement.
          </li>
          <li className="text-sm flex items-start gap-2 text-white/75">
            <span className="shrink-0 mt-0.5 text-amber-400">⚠</span>
            Control the eccentric (lowering) phase — don&apos;t rush through it.
          </li>
        </ul>
      </div>

      {/* ── Sticky bottom — 2-col same as SessionView ── */}
      <div
        className="fixed bottom-0 left-0 md:left-64 right-0 z-40 px-4 pb-5 pt-3"
        style={{
          background: "var(--bg-primary)",
          borderTop: "1px solid var(--border-color)",
        }}
      >
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          <button
            onClick={() => setRunning((r) => !r)}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-all"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            {running ? (
              <>
                <Pause size={16} /> Pause
              </>
            ) : (
              <>
                <Play size={16} /> Resume
              </>
            )}
          </button>
          <motion.button
            onClick={
              isSaving
                ? undefined
                : allSetsDone
                  ? handleNextExercise
                  : handleFinish
            }
            disabled={isSaving}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white disabled:opacity-60"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
            }}
          >
            {isSaving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving…
              </>
            ) : allSetsDone ? (
              <>
                <CheckCircle2 size={16} />{" "}
                {isLastExercise ? "Finish Workout" : "Next Exercise →"}
              </>
            ) : (
              <>
                <Save size={16} /> Finish Workout
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* ── Rest Overlay ── */}
      {phase === "rest" && (
        <RestOverlay
          restLeft={restLeft}
          totalRest={totalRest}
          nextLabel={nextLabel}
          onSkip={advanceAfterRest}
        />
      )}

      {/* ── Quit confirm ── */}
      <AnimatePresence>
        {quitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(4px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="rounded-2xl p-6 w-full max-w-xs text-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <p className="text-3xl mb-3">⚠️</p>
              <p
                className="font-black text-base mb-1"
                style={{ color: "var(--text-primary)" }}
              >
                Quit workout?
              </p>
              <p
                className="text-sm mb-5"
                style={{ color: "var(--text-secondary)" }}
              >
                Your progress for today will be lost.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setQuitConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                >
                  Keep Going
                </button>
                <button
                  onClick={() => router.back()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-red-500"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InfoModal
        exercise={infoOpen ? current : null}
        onClose={() => setInfoOpen(false)}
      />
    </div>
  );
}
