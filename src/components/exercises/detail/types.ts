export interface Exercise {
  _id?: string;
  id: string;
  name: string;
  force: string | null;
  level: "beginner" | "intermediate" | "expert";
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
}

export type PageState = "detail" | "session" | "complete";
export type Tab = "Instructions" | "Muscles" | "Equipment" | "History";

export const LEVEL_STYLE = {
  beginner: { bg: "#dcfce7", text: "#16a34a" },
  intermediate: { bg: "#fff3e0", text: "#f47920" },
  expert: { bg: "#fee2e2", text: "#dc2626" },
};

export function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}
