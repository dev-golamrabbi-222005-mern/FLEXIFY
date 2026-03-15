// lib/challengeUtils.ts

export type ChallengeType = "upper-body" | "lower-body";
export type Level = "beginner" | "intermediate" | "advance";

// ── Tag definitions per challenge type ───────────────────────────────────────
export const UPPER_BODY_TAGS = ["arm", "chest", "abs", "shoulder"] as const;
export const LOWER_BODY_TAGS = ["thigh", "butt", "calfs"] as const;

export type UpperTag = (typeof UPPER_BODY_TAGS)[number];
export type LowerTag = (typeof LOWER_BODY_TAGS)[number];
export type Tag = UpperTag | LowerTag;

// ── Tag labels for display ────────────────────────────────────────────────────
export const TAG_LABELS: Record<Tag, string> = {
  arm:      "💪 Arms",
  chest:    "🏋️ Chest",
  abs:      "🔥 Abs",
  shoulder: "🦾 Shoulders",
  thigh:    "🦵 Thighs",
  butt:     "🍑 Glutes",
  calfs:    "🦶 Calves",
};

export const TAG_EMOJI: Record<Tag, string> = {
  arm:      "💪",
  chest:    "🏋️",
  abs:      "🔥",
  shoulder: "🦾",
  thigh:    "🦵",
  butt:     "🍑",
  calfs:    "🦶",
};

// ── Day schedule: which tag to train on each day of the week (1-indexed) ─────
// Upper body: 4 tags across 7 days, day 7 = light abs
export const UPPER_BODY_WEEK_SCHEDULE: (UpperTag | "rest")[] = [
  "arm",      // Day 1
  "chest",    // Day 2
  "abs",      // Day 3
  "shoulder", // Day 4
  "arm",      // Day 5
  "chest",    // Day 6
  "abs",      // Day 7 (lighter day)
];

// Lower body: 3 tags across 7 days, day 7 = light thighs
export const LOWER_BODY_WEEK_SCHEDULE: (LowerTag | "rest")[] = [
  "thigh",  // Day 1
  "butt",   // Day 2
  "calfs",  // Day 3
  "thigh",  // Day 4
  "butt",   // Day 5
  "calfs",  // Day 6
  "thigh",  // Day 7 (lighter day)
];

export interface DayPlan {
  day: number;          // absolute day number (1–28)
  week: number;         // week number (1–4)
  dayOfWeek: number;    // day within week (1–7)
  tag: Tag;
  tagLabel: string;
  tagEmoji: string;
  isLightDay: boolean;  // day 7 of each week
}

// ── Generate full 4-week plan ─────────────────────────────────────────────────
export function generatePlan(type: ChallengeType): DayPlan[] {
  const schedule =
    type === "upper-body" ? UPPER_BODY_WEEK_SCHEDULE : LOWER_BODY_WEEK_SCHEDULE;

  const plan: DayPlan[] = [];

  for (let week = 1; week <= 4; week++) {
    for (let dow = 1; dow <= 7; dow++) {
      const tag = schedule[dow - 1] as Tag;
      const day = (week - 1) * 7 + dow;
      plan.push({
        day,
        week,
        dayOfWeek: dow,
        tag,
        tagLabel: TAG_LABELS[tag],
        tagEmoji: TAG_EMOJI[tag],
        isLightDay: dow === 7,
      });
    }
  }

  return plan;
}

// ── Calorie estimation per exercise ──────────────────────────────────────────
export function estimateCalories(sets: number, reps: number, restSecs: number): number {
  // rough MET-based estimate: ~0.1 kcal per rep, plus rest factor
  return Math.round(sets * reps * 0.1 + (sets * restSecs * 0.05));
}

// ── Format seconds to MM:SS ───────────────────────────────────────────────────
export function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Progress record stored in MongoDB ────────────────────────────────────────
export interface DayProgress {
  day: number;
  week: number;
  tag: Tag;
  completedAt: Date;
  durationSecs: number;
  caloriesBurned: number;
  exercisesDone: number;
}

export interface ChallengeProgress {
  userEmail: string;
  type: ChallengeType;
  level: Level;
  startedAt: Date;
  completedDays: DayProgress[];
}
