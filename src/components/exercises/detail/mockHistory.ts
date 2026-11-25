export interface HistorySession {
  date: string;
  sets: { reps: number; weight: number }[];
  notes?: string;
}

export const MOCK_HISTORY: HistorySession[] = [
  {
    date: "Mar 6, 2026",
    sets: [
      { reps: 10, weight: 65 },
      { reps: 10, weight: 65 },
      { reps: 8, weight: 65 },
    ],
    notes: "Felt strong.",
  },
  {
    date: "Feb 27, 2026",
    sets: [
      { reps: 10, weight: 60 },
      { reps: 10, weight: 60 },
      { reps: 9, weight: 60 },
    ],
  },
  {
    date: "Feb 20, 2026",
    sets: [
      { reps: 8, weight: 55 },
      { reps: 8, weight: 55 },
      { reps: 8, weight: 55 },
    ],
    notes: "Warm-up felt off.",
  },
];
