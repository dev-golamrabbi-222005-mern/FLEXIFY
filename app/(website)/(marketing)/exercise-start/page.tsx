"use client";

import { useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Set {
  id: number;
  reps: number;
  weight: number;
  completed: boolean;
  actualReps?: number;
  actualWeight?: number;
}

interface MuscleGroup {
  name: string;
  role: "Primary" | "Secondary" | "Stabilizer";
}

interface Equipment {
  name: string;
  icon: string;
  optional?: boolean;
}

interface HistoryEntry {
  date: string;
  sets: { reps: number; weight: number }[];
  notes?: string;
}

type Tab = "Instructions" | "Muscle Groups" | "Equipment Needed" | "History";

// ─── Static Data ─────────────────────────────────────────────────────────────
const INSTRUCTIONS = [
  "Position the barbell on your upper traps. Keep your chest up and feet slightly wider than shoulder-width apart.",
  "Inhale, brace your core, and initiate the movement by sitting back into your hips while keeping your back straight.",
  "Lower yourself until your thighs are at least parallel to the floor.",
  "Exhale as you drive through your mid-foot to return to the starting position.",
  "Maintain tension throughout — do not lock out aggressively at the top.",
];

const MUSCLE_GROUPS: MuscleGroup[] = [
  { name: "Quadriceps", role: "Primary" },
  { name: "Gluteus Maximus", role: "Secondary" },
  { name: "Hamstrings", role: "Secondary" },
  { name: "Core", role: "Stabilizer" },
  { name: "Erector Spinae", role: "Stabilizer" },
  { name: "Adductors", role: "Stabilizer" },
];

const EQUIPMENT: Equipment[] = [
  { name: "Standard Barbell", icon: "🥇" },
  { name: "Power Rack", icon: "🏗️" },
  { name: "Weight Plates", icon: "⚖️" },
  { name: "Lifting Belt", icon: "🟤", optional: true },
  { name: "Knee Sleeves", icon: "🦵", optional: true },
];

const HISTORY: HistoryEntry[] = [
  {
    date: "Mar 6, 2026",
    sets: [
      { reps: 10, weight: 130 },
      { reps: 10, weight: 130 },
      { reps: 8, weight: 130 },
      { reps: 8, weight: 135 },
    ],
    notes: "Felt strong, depth was good.",
  },
  {
    date: "Feb 27, 2026",
    sets: [
      { reps: 10, weight: 125 },
      { reps: 10, weight: 125 },
      { reps: 9, weight: 125 },
      { reps: 8, weight: 125 },
    ],
  },
  {
    date: "Feb 20, 2026",
    sets: [
      { reps: 10, weight: 120 },
      { reps: 10, weight: 120 },
      { reps: 10, weight: 120 },
      { reps: 9, weight: 120 },
    ],
    notes: "Slightly fatigued from Monday.",
  },
  {
    date: "Feb 13, 2026",
    sets: [
      { reps: 8, weight: 115 },
      { reps: 8, weight: 115 },
      { reps: 8, weight: 115 },
      { reps: 7, weight: 115 },
    ],
  },
];

// ─── Breadcrumb ───────────────────────────────────────────────────────────────
function Breadcrumb() {
  return (
    <nav className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-3">
      {["Workouts", "Leg Day", "Barbell Squats"].map((crumb, i, arr) => (
        <span key={crumb} className="flex items-center gap-1.5">
          <span
            className={
              i === arr.length - 1
                ? "text-[var(--text-primary)] font-semibold"
                : "hover:text-[var(--primary)] cursor-pointer transition-colors"
            }
          >
            {crumb}
          </span>
          {i < arr.length - 1 && <span className="opacity-40">›</span>}
        </span>
      ))}
    </nav>
  );
}

// ─── Video Player ─────────────────────────────────────────────────────────────
function VideoPlayer() {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(26); // 0:45 of 2:15
  const [hovered, setHovered] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);

  const formatTime = (pct: number) => {
    const total = 135; // 2:15 in seconds
    const secs = Math.round((pct / 100) * total);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    setProgress(Math.max(0, Math.min(100, pct)));
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden bg-[#1a1a1a] aspect-video group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => setPlaying((p) => !p)}
    >
      {/* Placeholder visual */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#1e2028] to-[#2a2d35]">
        <div className="w-24 h-24 rounded-full border-2 border-[var(--primary)]/40 flex items-center justify-center mb-4 relative">
          <div className="absolute inset-0 rounded-full border border-[var(--primary)]/20 scale-125" />
          <span className="text-4xl">🏋️</span>
        </div>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
          Exercise Preview
        </p>
        <p className="text-white/30 text-[10px] tracking-widest mt-1">
          On-Stage Safe Work
        </p>
      </div>

      {/* Play/Pause overlay */}
      <div
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-200 ${hovered || !playing ? "opacity-100" : "opacity-0"}`}
      >
        <button
          className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center shadow-xl shadow-orange-500/30 hover:scale-110 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            setPlaying((p) => !p);
          }}
        >
          <span className="text-white text-xl ml-0.5">
            {playing ? "⏸" : "▶"}
          </span>
        </button>
      </div>

      {/* Controls bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-3 pt-8">
        <div
          ref={barRef}
          className="w-full h-1 bg-white/20 rounded-full cursor-pointer mb-2 relative"
          onClick={(e) => {
            e.stopPropagation();
            handleBarClick(e);
          }}
        >
          <div
            className="h-full bg-[var(--primary)] rounded-full relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow -mr-1.5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-white/60 text-[11px] font-mono">
            {formatTime(progress)}
          </span>
          <span className="text-white/40 text-[11px] font-mono">2:15</span>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Instructions ────────────────────────────────────────────────────────
function InstructionsTab() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [checked, setChecked] = useState<number[]>([]);

  const toggle = (i: number) =>
    setChecked((prev) =>
      prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
    );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_220px] gap-4">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span>📖</span>
          <h3 className="font-bold text-[var(--text-primary)]">
            How to perform
          </h3>
          <span className="ml-auto text-xs text-[var(--text-secondary)]">
            {checked.length}/{INSTRUCTIONS.length} steps reviewed
          </span>
        </div>
        <div className="space-y-3">
          {INSTRUCTIONS.map((step, i) => (
            <div
              key={i}
              onClick={() => {
                toggle(i);
                setExpanded(expanded === i ? null : i);
              }}
              className={`flex gap-3 p-3 rounded-xl cursor-pointer transition-all border
                ${
                  checked.includes(i)
                    ? "bg-[var(--primary)]/5 border-[var(--primary)]/20"
                    : "border-transparent hover:bg-[var(--bg-primary)]"
                }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-all
                ${checked.includes(i) ? "bg-[var(--primary)] text-white" : "bg-[var(--bg-primary)] text-[var(--text-secondary)] border border-[var(--border-color)]"}`}
              >
                {checked.includes(i) ? "✓" : i + 1}
              </div>
              <p
                className={`text-sm leading-relaxed transition-colors ${checked.includes(i) ? "text-[var(--text-secondary)] line-through" : "text-[var(--text-primary)]"}`}
              >
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Right side */}
      <div className="flex flex-col gap-3">
        {/* Target muscles mini */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span>🎯</span>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Target Muscles
            </h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {MUSCLE_GROUPS.map((m) => (
              <span
                key={m.name}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold
                ${m.role === "Primary" ? "bg-[var(--primary)]/10 text-[var(--primary)]" : "bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-secondary)]"}`}
              >
                {m.name}
                {m.role === "Primary" && (
                  <span className="ml-1 opacity-60 text-[9px]">(Primary)</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Equipment mini */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span>🔧</span>
            <h4 className="font-bold text-sm text-[var(--text-primary)]">
              Equipment
            </h4>
          </div>
          <div className="space-y-2">
            {EQUIPMENT.filter((e) => !e.optional).map((e) => (
              <div key={e.name} className="flex items-center gap-2">
                <span className="text-base">{e.icon}</span>
                <span className="text-xs font-semibold text-[var(--text-primary)]">
                  {e.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Muscle Groups ───────────────────────────────────────────────────────
function MuscleGroupsTab() {
  const roleColor: Record<string, string> = {
    Primary:
      "bg-[var(--primary)]/10 text-[var(--primary)] border-[var(--primary)]/20",
    Secondary: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Stabilizer: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const roleIcon: Record<string, string> = {
    Primary: "🔴",
    Secondary: "🟡",
    Stabilizer: "🔵",
  };

  return (
    <div className="space-y-4">
      {/* Body diagram placeholder + list */}
      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
        {/* Placeholder anatomy */}
        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5 flex flex-col items-center justify-center min-h-[220px]">
          <span className="text-6xl mb-3">🦵</span>
          <p className="text-xs text-[var(--text-secondary)] text-center font-medium">
            Posterior Chain
            <br />+ Quad Dominant
          </p>
        </div>

        <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5">
          <h3 className="font-bold text-[var(--text-primary)] mb-4">
            Muscles Activated
          </h3>

          {/* Legend */}
          <div className="flex gap-3 mb-4 flex-wrap">
            {["Primary", "Secondary", "Stabilizer"].map((r) => (
              <div key={r} className="flex items-center gap-1.5">
                <span className="text-xs">{roleIcon[r]}</span>
                <span className="text-xs font-semibold text-[var(--text-secondary)]">
                  {r}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {MUSCLE_GROUPS.map((m) => (
              <div
                key={m.name}
                className={`flex items-center justify-between p-3 rounded-xl border ${roleColor[m.role]}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{roleIcon[m.role]}</span>
                  <span className="text-sm font-semibold">{m.name}</span>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${roleColor[m.role]}`}
                >
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activation breakdown */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">
          Activation Breakdown
        </h3>
        <div className="space-y-3">
          {[
            { name: "Quadriceps", pct: 78, color: "var(--primary)" },
            { name: "Gluteus Maximus", pct: 62, color: "#f0a500" },
            { name: "Hamstrings", pct: 45, color: "#f0a500" },
            { name: "Core", pct: 35, color: "#4b9eff" },
            { name: "Erector Spinae", pct: 28, color: "#4b9eff" },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[var(--text-secondary)] w-32 shrink-0">
                {m.name}
              </span>
              <div className="flex-1 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${m.pct}%`, backgroundColor: m.color }}
                />
              </div>
              <span className="text-xs font-bold text-[var(--text-primary)] w-8 text-right">
                {m.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: Equipment Needed ────────────────────────────────────────────────────
function EquipmentTab() {
  const [userHas, setUserHas] = useState<string[]>([
    "Standard Barbell",
    "Power Rack",
    "Weight Plates",
  ]);

  const toggleHas = (name: string) =>
    setUserHas((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name],
    );

  const required = EQUIPMENT.filter((e) => !e.optional);
  const optional = EQUIPMENT.filter((e) => e.optional);
  const hasAll = required.every((e) => userHas.includes(e.name));

  return (
    <div className="space-y-4">
      {/* Readiness Banner */}
      <div
        className={`rounded-2xl p-4 border flex items-center gap-3 transition-all
        ${
          hasAll
            ? "bg-emerald-500/10 border-emerald-500/20"
            : "bg-amber-500/10 border-amber-500/20"
        }`}
      >
        <span className="text-2xl">{hasAll ? "✅" : "⚠️"}</span>
        <div>
          <p
            className={`font-bold text-sm ${hasAll ? "text-emerald-600" : "text-amber-600"}`}
          >
            {hasAll ? "You're fully equipped!" : "Missing required equipment"}
          </p>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            {hasAll
              ? "All required equipment is available. Ready to train."
              : `You need: ${required
                  .filter((e) => !userHas.includes(e.name))
                  .map((e) => e.name)
                  .join(", ")}`}
          </p>
        </div>
      </div>

      {/* Required */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">
          Required Equipment
        </h3>
        <div className="space-y-2.5">
          {required.map((e) => (
            <div
              key={e.name}
              onClick={() => toggleHas(e.name)}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all
                ${
                  userHas.includes(e.name)
                    ? "bg-[var(--primary)]/5 border-[var(--primary)]/20"
                    : "border-[var(--border-color)] hover:border-[var(--primary)]/30"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{e.icon}</span>
                <span className="font-semibold text-sm text-[var(--text-primary)]">
                  {e.name}
                </span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${userHas.includes(e.name) ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border-color)]"}`}
              >
                {userHas.includes(e.name) && (
                  <span className="text-white text-[10px]">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="font-bold text-[var(--text-primary)] mb-1">
          Optional / Recommended
        </h3>
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          These enhance safety and performance but aren't required.
        </p>
        <div className="space-y-2.5">
          {optional.map((e) => (
            <div
              key={e.name}
              onClick={() => toggleHas(e.name)}
              className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all
                ${
                  userHas.includes(e.name)
                    ? "bg-[var(--primary)]/5 border-[var(--primary)]/20"
                    : "border-dashed border-[var(--border-color)] hover:border-[var(--primary)]/30"
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{e.icon}</span>
                <div>
                  <span className="font-semibold text-sm text-[var(--text-primary)]">
                    {e.name}
                  </span>
                  <span className="ml-2 text-[10px] font-bold text-[var(--text-secondary)] bg-[var(--bg-primary)] px-1.5 py-0.5 rounded">
                    OPTIONAL
                  </span>
                </div>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                ${userHas.includes(e.name) ? "bg-[var(--primary)] border-[var(--primary)]" : "border-[var(--border-color)]"}`}
              >
                {userHas.includes(e.name) && (
                  <span className="text-white text-[10px]">✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tab: History ─────────────────────────────────────────────────────────────
function HistoryTab() {
  const [expanded, setExpanded] = useState<number>(0);

  const bestWeight = Math.max(
    ...HISTORY.flatMap((h) => h.sets.map((s) => s.weight)),
  );
  const totalVolume = (entry: HistoryEntry) =>
    entry.sets.reduce((sum, s) => sum + s.reps * s.weight, 0);

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Sessions Logged", value: HISTORY.length, unit: "" },
          { label: "Personal Best", value: `${bestWeight}`, unit: " lbs" },
          {
            label: "Avg Volume",
            value: Math.round(
              HISTORY.reduce((s, h) => s + totalVolume(h), 0) / HISTORY.length,
            ).toLocaleString(),
            unit: " lbs",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-4 text-center"
          >
            <p className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
              {stat.value}
              <span className="text-sm font-semibold text-[var(--primary)]">
                {stat.unit}
              </span>
            </p>
            <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Progress chart (simple bar) */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl p-5">
        <h3 className="font-bold text-[var(--text-primary)] mb-4">
          Volume Progress
        </h3>
        <div className="flex items-end gap-3 h-24">
          {HISTORY.slice()
            .reverse()
            .map((entry, i) => {
              const vol = totalVolume(entry);
              const maxVol = Math.max(...HISTORY.map(totalVolume));
              const pct = (vol / maxVol) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="w-full relative" style={{ height: "80px" }}>
                    <div
                      className="absolute bottom-0 w-full rounded-t-lg bg-[var(--primary)] transition-all duration-500"
                      style={{
                        height: `${pct}%`,
                        opacity: i === HISTORY.length - 1 ? 1 : 0.5 + i * 0.15,
                      }}
                    />
                  </div>
                  <p className="text-[9px] text-[var(--text-secondary)] text-center">
                    {entry.date.split(",")[0]}
                  </p>
                </div>
              );
            })}
        </div>
      </div>

      {/* Session logs */}
      <div className="space-y-3">
        {HISTORY.map((entry, i) => (
          <div
            key={i}
            className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden"
          >
            <button
              onClick={() => setExpanded(expanded === i ? -1 : i)}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-primary)]/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {entry.date}
                </span>
                {i === 0 && (
                  <span className="text-[10px] font-bold bg-[var(--primary)]/10 text-[var(--primary)] px-2 py-0.5 rounded-lg">
                    LATEST
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)]">
                  {entry.sets.length} sets ·{" "}
                  {totalVolume(entry).toLocaleString()} lbs total
                </span>
                <span
                  className={`text-[var(--text-secondary)] transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}
                >
                  ▾
                </span>
              </div>
            </button>

            {expanded === i && (
              <div className="px-4 pb-4 border-t border-[var(--border-color)] pt-3">
                <div className="grid grid-cols-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-2 px-2">
                  <span>Set</span>
                  <span>Reps</span>
                  <span>Weight</span>
                  <span>Volume</span>
                </div>
                <div className="space-y-1.5">
                  {entry.sets.map((s, j) => (
                    <div
                      key={j}
                      className="grid grid-cols-4 px-2 py-2 rounded-lg bg-[var(--bg-primary)]/50 text-sm"
                    >
                      <span className="font-bold text-[var(--text-secondary)]">
                        {j + 1}
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {s.reps}
                      </span>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {s.weight} lbs
                      </span>
                      <span className="font-semibold text-[var(--primary)]">
                        {(s.reps * s.weight).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                {entry.notes && (
                  <p className="mt-3 text-xs text-[var(--text-secondary)] italic bg-[var(--bg-primary)]/50 rounded-lg p-2.5">
                    📝 {entry.notes}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Edit Goal Modal ──────────────────────────────────────────────────────────
function EditGoalModal({
  sets,
  setSets,
  reps,
  setReps,
  weight,
  setWeight,
  onClose,
}: {
  sets: number;
  setSets: (n: number) => void;
  reps: number;
  setReps: (n: number) => void;
  weight: number;
  setWeight: (n: number) => void;
  onClose: () => void;
}) {
  const [localSets, setLocalSets] = useState(sets);
  const [localReps, setLocalReps] = useState(reps);
  const [localWeight, setLocalWeight] = useState(weight);

  const save = () => {
    setSets(localSets);
    setReps(localReps);
    setWeight(localWeight);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[var(--bg-secondary)] rounded-2xl w-full max-w-sm border border-[var(--border-color)] shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)]">
          <h2 className="font-bold text-[var(--text-primary)]">Edit Goal</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] w-7 h-7 flex items-center justify-center rounded-full hover:bg-[var(--bg-primary)] transition-colors"
          >
            ×
          </button>
        </div>
        <div className="p-5 space-y-4">
          {[
            {
              label: "Target Sets",
              val: localSets,
              set: setLocalSets,
              min: 1,
              max: 10,
            },
            {
              label: "Reps per Set",
              val: localReps,
              set: setLocalReps,
              min: 1,
              max: 30,
            },
            {
              label: "Weight (lbs)",
              val: localWeight,
              set: setLocalWeight,
              min: 0,
              max: 500,
            },
          ].map((field) => (
            <div key={field.label}>
              <label className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider block mb-2">
                {field.label}
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => field.set(Math.max(field.min, field.val - 1))}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  −
                </button>
                <input
                  type="number"
                  value={field.val}
                  onChange={(e) => field.set(Number(e.target.value))}
                  className="flex-1 text-center font-bold text-lg text-[var(--text-primary)] bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl py-2 outline-none focus:border-[var(--primary)]"
                />
                <button
                  onClick={() => field.set(Math.min(field.max, field.val + 1))}
                  className="w-9 h-9 rounded-xl border border-[var(--border-color)] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="p-5 pt-0 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-primary)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            className="flex-1 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:brightness-110 transition-all"
          >
            Save Goal
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ExerciseDetail() {
  const [activeTab, setActiveTab] = useState<Tab>("Instructions");
  const [currentSet, setCurrentSet] = useState(1);
  const [targetSets, setTargetSets] = useState(4);
  const [targetReps, setTargetReps] = useState(10);
  const [targetWeight, setTargetWeight] = useState(135);
  const [editGoalOpen, setEditGoalOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [completedSets, setCompletedSets] = useState<number[]>([]);

  const tabs: Tab[] = [
    "Instructions",
    "Muscle Groups",
    "Equipment Needed",
    "History",
  ];

  const handleStartSet = () => {
    if (!started) {
      setStarted(true);
      return;
    }
    if (currentSet <= targetSets) {
      setCompletedSets((prev) => [...prev, currentSet]);
      if (currentSet < targetSets) setCurrentSet((s) => s + 1);
      else setCurrentSet(targetSets + 1);
    }
  };

  const allDone = completedSets.length >= targetSets;

  return (
    <div className="py-2.5 px-0 font-['Sora']">
      <Breadcrumb />

      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Barbell Squats
          </h1>
          <div className="flex gap-2 mt-1.5">
            {["COMPOUND", "STRENGTH"].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-[var(--primary)]/10 text-[var(--primary)]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl px-3 py-2">
          <span className="text-[var(--primary)] text-sm">⏱️</span>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            Target: {targetSets} Sets
          </span>
        </div>
      </div>

      {/* ── Video ── */}
      <div className="mb-5">
        <VideoPlayer />
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-0 border-b border-[var(--border-color)] mb-5 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-all
              ${
                activeTab === tab
                  ? "border-[var(--primary)] text-[var(--primary)] font-bold"
                  : "border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <div className="mb-28">
        {activeTab === "Instructions" && <InstructionsTab />}
        {activeTab === "Muscle Groups" && <MuscleGroupsTab />}
        {activeTab === "Equipment Needed" && <EquipmentTab />}
        {activeTab === "History" && <HistoryTab />}
      </div>

      {/* ── Sticky Bottom Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-4 pt-3 bg-[var(--bg-primary)]/90 backdrop-blur-md border-t border-[var(--border-color)]">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            {/* Set progress dots */}
            <div className="flex gap-1.5 mb-1">
              {Array.from({ length: targetSets }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    completedSets.includes(i + 1)
                      ? "bg-[var(--primary)]"
                      : i + 1 === currentSet && started
                        ? "bg-[var(--primary)]/40 animate-pulse"
                        : "bg-[var(--border-color)]"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-[var(--text-secondary)]">
              {allDone ? "All sets complete! 🎉" : "Ready for your first set?"}
            </p>
            <p className="font-bold text-[var(--text-primary)] text-sm">
              {allDone
                ? `Completed ${targetSets} × ${targetReps} @ ${targetWeight} lbs`
                : `Set ${Math.min(currentSet, targetSets)}: ${targetReps} Reps @ ${targetWeight} lbs`}
            </p>
          </div>
          <div className="flex gap-2.5 shrink-0">
            <button
              onClick={() => setEditGoalOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] text-sm font-semibold text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all"
            >
              Edit Goal
            </button>
            {!allDone ? (
              <button
                onClick={handleStartSet}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-orange-500/20"
              >
                <span>▶</span>
                {!started ? "Start Set 1" : `Complete Set ${currentSet}`}
              </button>
            ) : (
              <button
                onClick={() => {
                  setCompletedSets([]);
                  setCurrentSet(1);
                  setStarted(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:brightness-110 transition-all"
              >
                ✓ Done — Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Goal Modal */}
      {editGoalOpen && (
        <EditGoalModal
          sets={targetSets}
          setSets={setTargetSets}
          reps={targetReps}
          setReps={setTargetReps}
          weight={targetWeight}
          setWeight={setTargetWeight}
          onClose={() => setEditGoalOpen(false)}
        />
      )}
    </div>
  );
}
