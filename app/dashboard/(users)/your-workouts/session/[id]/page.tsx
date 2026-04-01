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
  Zap,
  Target,
  Pause,
  Plus,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Exercise, WorkoutResponse } from "@/components/user/workout";
import { toast } from "react-toastify";
import RestTimer from "@/components/user/RestTimer";

// ── Constants matching my-challenges ─────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

// Same level style as challenges exercise session
const LEVEL_STYLE: Record<string, { bg: string; text: string }> = {
  beginner: { bg: "#dcfce7", text: "#16a34a" },
  intermediate: { bg: "#fff3e0", text: "#f47920" },
  expert: { bg: "#fee2e2", text: "#dc2626" },
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

// ── Exercise image — identical to challenges session ──────────────────────────
function ExerciseImage({ images, name }: { images?: string[]; name: string }) {
  // These will now reset automatically when the 'key' changes
  const [idx, setIdx] = useState(0);
  const [err, setErr] = useState(false);

  const src = images?.[idx] ? `/exercises/${images[idx]}` : null;

  return (
    <div
      // Adding 'key={name}' solves the cascading render error.
      // Whenever the exercise name changes, React destroys this instance
      // and creates a new one, resetting idx to 0 and err to false.
      key={name}
      className="relative w-full overflow-hidden rounded-2xl"
      style={{ background: "var(--bg-primary)", aspectRatio: "16/9" }}
    >
      {src && !err ? (
        <>
          <img
            src={src}
            alt={name}
            className="w-full h-full object-contain"
            onError={() => {
              // Try the next image in the array if the current one fails
              if (idx < (images?.length ?? 0) - 1) {
                setIdx((i) => i + 1);
              } else {
                setErr(true);
              }
            }}
          />

          {/* Pagination Dots */}
          {images && images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className="rounded-full transition-all"
                  style={{
                    width: i === idx ? 18 : 6,
                    height: 6,
                    background:
                      i === idx ? "var(--primary)" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Bottom Gradient Overlay */}
          <div
            className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, var(--bg-secondary), transparent)",
            }}
          />
        </>
      ) : (
        /* Fallback State (Error or No Image) */
        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
          <span className="text-5xl">🏋️</span>
          <p
            className="text-xs font-bold"
            style={{ color: "var(--text-secondary)" }}
          >
            {name}
          </p>
        </div>
      )}
    </div>
  );
}

// ── Set row — green accent matching challenges ─────────────────────────────────
function SetRow({
  set,
  setIdx,
  exIdx,
  trackingType,
  onToggle,
  onChange,
}: {
  set: {
    id?: string;
    weight?: string;
    reps?: string;
    seconds?: string;
    previous?: string;
    isCompleted?: boolean;
  };
  setIdx: number;
  exIdx: number;
  trackingType?: string;
  onToggle: (exIdx: number, setIdx: number) => void;
  onChange: (exIdx: number, setIdx: number, field: string, val: string) => void;
}) {
  const done = !!set.isCompleted;
  const isTime = trackingType === "TIME";

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: setIdx * 0.05 }}
      className="grid items-center gap-2 py-2.5 px-3 rounded-xl transition-all"
      style={{
        gridTemplateColumns: "28px 1fr 1fr 36px",
        // ✅ green tint when done — matches challenges
        background: done ? "rgba(16,185,129,0.06)" : "var(--bg-primary)",
        border: `1px solid ${done ? "rgba(16,185,129,0.25)" : "var(--border-color)"}`,
        opacity: done ? 0.85 : 1,
      }}
    >
      <span
        className="text-xs font-black text-center"
        style={{ color: done ? "var(--primary)" : "var(--text-secondary)" }}
      >
        {setIdx + 1}
      </span>

      <input
        type="number"
        placeholder={isTime ? "sec" : "kg"}
        value={isTime ? (set.seconds ?? "") : (set.weight ?? "")}
        onChange={(e) =>
          onChange(exIdx, setIdx, isTime ? "seconds" : "weight", e.target.value)
        }
        disabled={done}
        className="w-full text-center text-sm font-black rounded-lg px-2 py-1.5 outline-none transition-all"
        style={{
          background: "var(--bg-secondary)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
        }}
      />

      {!isTime ? (
        <input
          type="number"
          placeholder="reps"
          value={set.reps ?? ""}
          onChange={(e) => onChange(exIdx, setIdx, "reps", e.target.value)}
          disabled={done}
          className="w-full text-center text-sm font-black rounded-lg px-2 py-1.5 outline-none transition-all"
          style={{
            background: "var(--bg-secondary)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
          }}
        />
      ) : (
        <div />
      )}

      <button
        onClick={() => onToggle(exIdx, setIdx)}
        className="w-8 h-8 flex items-center justify-center rounded-xl transition-all hover:scale-110"
        style={{
          background: done ? "var(--primary)" : "var(--bg-secondary)",
          border: `1px solid ${done ? "var(--primary)" : "var(--border-color)"}`,
        }}
      >
        <CheckCircle2 size={15} color={done ? "#fff" : "var(--border-color)"} />
      </button>
    </motion.div>
  );
}

// ── Exercise card — green accent, same as challenges ──────────────────────────
function SessionExerciseCard({
  exercise,
  exIdx,
  onToggle,
  onChange,
  onAddSet,
}: {
  exercise: Exercise;
  exIdx: number;
  onToggle: (exIdx: number, setIdx: number) => void;
  onChange: (exIdx: number, setIdx: number, field: string, val: string) => void;
  onAddSet: (exIdx: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const completedCount =
    exercise.sets?.filter((s) => s.isCompleted).length ?? 0;
  const totalSets = exercise.sets?.length ?? 0;
  const allDone = completedCount === totalSets && totalSets > 0;
  const lc = LEVEL_STYLE[exercise.level ?? "beginner"] ?? {
    bg: "#f1f5f9",
    text: "#64748b",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: exIdx * 0.07, duration: 0.4, ease }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--bg-secondary)",
        // ✅ green glow when done — matches challenges card style
        border: `1px solid ${allDone ? "rgba(16,185,129,0.35)" : "var(--border-color)"}`,
        boxShadow: allDone ? "0 0 0 1px rgba(16,185,129,0.1)" : "none",
      }}
    >
      {/* ── Colored top strip — same as challenges cards ── */}
      <div
        className="h-1.5 w-full"
        style={{
          background: allDone ? "var(--primary)" : "var(--border-color)",
        }}
      />

      {/* Header */}
      <button
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-[var(--bg-primary)]/40 transition-colors"
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
          style={{
            background: allDone ? "var(--primary)" : "var(--bg-primary)",
            border: `1px solid ${allDone ? "var(--primary)" : "var(--border-color)"}`,
            color: allDone ? "#fff" : "var(--text-secondary)",
          }}
        >
          {allDone ? <CheckCircle2 size={15} /> : exIdx + 1}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className="font-black text-sm leading-tight truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {exercise.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-[10px] font-black px-1.5 py-0.5 rounded"
              style={{ background: lc.bg, color: lc.text }}
            >
              {exercise.level}
            </span>
            {exercise.equipment && (
              <span
                className="text-[10px] font-semibold capitalize"
                style={{ color: "var(--text-secondary)" }}
              >
                {exercise.equipment}
              </span>
            )}
          </div>
        </div>

        <div className="text-right shrink-0">
          <p
            className="font-black text-sm"
            style={{
              color: allDone ? "var(--primary)" : "var(--text-primary)",
            }}
          >
            {completedCount}/{totalSets}
          </p>
          <p
            className="text-[9px] font-bold uppercase tracking-wider"
            style={{ color: "var(--text-secondary)" }}
          >
            sets
          </p>
        </div>

        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] shrink-0"
          style={{ color: "var(--text-secondary)" }}
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3">
              <ExerciseImage images={exercise.images} name={exercise.name} />

              {/* Muscle chips — green primary, muted secondary — same as challenges */}
              {(exercise.primaryMuscles?.length ?? 0) > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {exercise.primaryMuscles?.map((m) => (
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
                  {exercise.secondaryMuscles?.map((m) => (
                    <span
                      key={m}
                      className="px-2 py-0.5 rounded-lg text-[10px] font-semibold capitalize"
                      style={{
                        background: "var(--bg-primary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}

              {/* Column headers */}
              <div
                className="grid text-[9px] font-black uppercase tracking-widest px-3"
                style={{
                  gridTemplateColumns: "28px 1fr 1fr 36px",
                  color: "var(--text-secondary)",
                  gap: "0.5rem",
                }}
              >
                <span className="text-center">SET</span>
                <span className="text-center">
                  {exercise.trackingType === "TIME"
                    ? "TIME (s)"
                    : "WEIGHT (kg)"}
                </span>
                {exercise.trackingType !== "TIME" && (
                  <span className="text-center">REPS</span>
                )}
                <span className="text-center">✓</span>
              </div>

              <div className="space-y-2">
                {exercise.sets?.map((set, si) => (
                  <SetRow
                    key={set.id ?? si}
                    set={set}
                    setIdx={si}
                    exIdx={exIdx}
                    trackingType={exercise.trackingType}
                    onToggle={onToggle}
                    onChange={onChange}
                  />
                ))}
              </div>

              <button
                onClick={() => onAddSet(exIdx)}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-black transition-all hover:bg-[var(--primary)]/10"
                style={{
                  border: "1.5px dashed var(--border-color)",
                  color: "var(--text-secondary)",
                }}
              >
                <Plus size={12} /> Add Set
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function WorkoutSessionPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const [showRestTimer, setShowRestTimer] = useState(false);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [quitConfirm, setQuitConfirm] = useState(false);

  const { data: routineData, isLoading } = useQuery<WorkoutResponse>({
    queryKey: ["session-routine", id],
    queryFn: async () => {
      const res = await axios.get(`/api/routines/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  // Timer — pauses when paused flag is set
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setSecondsElapsed((p) => p + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  // Init exercises from routine data
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

  const handleToggle = (exIdx: number, setIdx: number) => {
    setExercises((prev) =>
      prev.map((ex, i) => {
        if (i !== exIdx) return ex;
        return {
          ...ex,
          sets: ex.sets.map((set, j) => {
            if (j !== setIdx) return set;
            const isNowCompleted = !set.isCompleted;
            if (isNowCompleted) setTimeout(() => setShowRestTimer(true), 50);
            return { ...set, isCompleted: isNowCompleted };
          }),
        };
      }),
    );
  };

  const handleChange = (
    exIdx: number,
    setIdx: number,
    field: string,
    val: string,
  ) => {
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

  const handleAddSet = (exIdx: number) => {
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
     const payload = {
        routineId: id,
        planName: routineData?.data?.planName,
        duration: secondsElapsed,
        exercises: completedExercises,
        date: new Date().toISOString(),
      };

      // এবার সেই payload টি পাঠান
      const res = await axios.post("/api/routines/finish", payload);

      if (res.data.success) {
        toast.success("Workout saved successfully! Keep it up.");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save workout session. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const totalSets = exercises.reduce((s, ex) => s + (ex.sets?.length ?? 0), 0);
  const doneSets = exercises.reduce(
    (s, ex) => s + (ex.sets?.filter((st) => st.isCompleted).length ?? 0),
    0,
  );
  const progress = totalSets > 0 ? doneSets / totalSets : 0;

  // ── Loading ───────────────────────────────────────────────────────────────
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

  return (
    <div
      className="min-h-screen pb-36"
      style={{
        background: "var(--bg-primary)",
        fontFamily: "'Sora', sans-serif",
      }}
    >
      <title>Your Session | Dashboard - Flexify</title>

      {/* ── Sticky Header — green border matching challenges ── */}
      <header
        className="sticky -top-16 z-40 px-4 py-3"
        style={{
          background: "var(--bg-primary)",
          borderBottom: "2px solid var(--primary)", // ✅ green not orange
          backdropFilter: "blur(16px)",
          boxShadow: "0 4px 24px rgba(16,185,129,0.08)", // ✅ green glow
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              onClick={() => setQuitConfirm(true)}
              className="flex items-center gap-1 text-sm font-semibold shrink-0 hover:text-[var(--primary)] transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              <ChevronLeft size={16} /> Quit
            </button>
            <div
              className="w-px h-5 shrink-0"
              style={{ background: "var(--border-color)" }}
            />
            <div className="flex items-center gap-2 min-w-0">
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: "rgba(16,185,129,0.12)" }} // ✅ green
              >
                <Play
                  size={13}
                  fill="var(--primary)"
                  style={{ color: "var(--primary)" }}
                />
              </div>
              <p
                className="font-black text-sm truncate"
                style={{ color: "var(--text-primary)" }}
              >
                {routineData?.data?.planName ?? "Workout"}
              </p>
            </div>
          </div>

          {/* Center: timer — same style as challenges session */}
          <div className="flex flex-col items-center shrink-0">
            <div className="flex items-center gap-1 mb-0.5">
              <Clock
                size={10}
                className={paused ? "" : "animate-pulse"}
                style={{ color: "var(--primary)" }}
              />
              <span
                className="text-[8px] font-black uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}
              >
                {paused ? "Paused" : "Duration"}
              </span>
            </div>
            <span
              className="font-black tabular-nums text-sm tracking-widest"
              style={{ color: "var(--text-primary)" }}
            >
              {fmt(secondsElapsed)}
            </span>
          </div>

          {/* Right: pause + finish */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setPaused((p) => !p)}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              {paused ? <Play size={13} /> : <Pause size={13} />}
            </button>

            <motion.button
              onClick={handleFinish}
              disabled={isSaving}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-black text-xs text-white disabled:opacity-60"
              style={{
                background: "var(--primary)",
                boxShadow: "0 3px 14px rgba(16,185,129,0.4)", // ✅ green
              }}
            >
              {isSaving ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Save size={12} />
              )}
              {isSaving ? "Saving…" : "Finish"}
            </motion.button>
          </div>
        </div>

        {/* Progress bar — green */}
        <div className="max-w-2xl mx-auto mt-2.5">
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--border-color)" }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--primary)" }}
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.5, ease }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span
              className="text-[9px] font-black uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              {doneSets} sets done
            </span>
            <span
              className="text-[9px] font-black"
              style={{ color: "var(--primary)" }}
            >
              {Math.round(progress * 100)}%
            </span>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Quick stats — same 3-card layout as challenges */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Target, label: "Exercises", val: exercises.length },
            { icon: Zap, label: "Sets Done", val: doneSets },
            { icon: Clock, label: "Elapsed", val: fmt(secondsElapsed) },
          ].map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
              }}
            >
              <s.icon
                size={14}
                className="mx-auto mb-1.5"
                style={{ color: "var(--primary)" }}
              />
              <p
                className="font-black text-lg leading-none"
                style={{ color: "var(--text-primary)" }}
              >
                {s.val}
              </p>
              <p
                className="text-[9px] font-black uppercase tracking-wider mt-1"
                style={{ color: "var(--text-muted)" }}
              >
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {exercises.map((ex, idx) => (
          <SessionExerciseCard
            key={ex._id ?? `ex-${idx}`}
            exercise={ex}
            exIdx={idx}
            onToggle={handleToggle}
            onChange={handleChange}
            onAddSet={handleAddSet}
          />
        ))}
      </main>

      {showRestTimer && <RestTimer onClose={() => setShowRestTimer(false)} />}

      {/* ── Quit confirm modal — same style as challenges ── */}
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-xs rounded-2xl p-6 text-center"
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
                Your current progress will be lost.
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
                  className="flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-red-500 hover:brightness-110"
                >
                  Quit
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Sticky bottom bar — green, matching challenges ── */}
      <div
        className="sticky bottom-0 z-40 px-4 pb-5 pt-3"
        style={{
          background: "var(--bg-primary)",
          borderTop: "2px solid var(--primary)", // ✅ green
          boxShadow: "0 -8px 32px rgba(16,185,129,0.1)", // ✅ green
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ background: "var(--primary)" }}
              />
              <p
                className="text-[10px] font-black uppercase tracking-wider"
                style={{ color: "var(--primary)" }}
              >
                Session Active
              </p>
            </div>
            <p
              className="font-black text-base leading-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {doneSets}/{totalSets} sets · {fmt(secondsElapsed)}
            </p>
          </div>

          <motion.button
            onClick={handleFinish}
            disabled={isSaving}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 28px rgba(16,185,129,0.5)",
            }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm text-white disabled:opacity-60"
            style={{
              background: "var(--primary)",
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)", // ✅ green
            }}
          >
            {isSaving ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Save size={14} />
            )}
            {isSaving ? "Saving…" : "Finish Workout"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
