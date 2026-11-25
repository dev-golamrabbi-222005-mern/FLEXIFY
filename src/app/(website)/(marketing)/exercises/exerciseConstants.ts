export interface ExerciseItem {
  _id: string;
  name: string;
  level: string;
  equipment: string;
  images: string[];
}

export const MUSCLES = [
  "Abdominals",
  "Hamstrings",
  "Biceps",
  "Shoulders",
  "Chest",
  "Quads",
  "Triceps",
];

export const LEVELS = ["Beginner", "Intermediate", "Expert"];

export const EQUIPMENTS = [
  "Body only",
  "Dumbbell",
  "Barbell",
  "Machine",
  "Kettlebells",
];
