export interface SetData {
  id?: string;
  weight?: string;
  reps?: string;
  seconds?: string;
  previous?: string;
  isCompleted?: boolean;
}

export interface SessionExercise {
  _id?: string;
  id?: string;
  name: string;
  trackingType?: string;
  instructions?: string[] | string;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
  images?: string[];
  sets: SetData[];
}

export interface WorkoutResponse {
  success: boolean;
  data: {
    planName: string;
    exercises: SessionExercise[];
  };
}

export const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export function fmt(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}
