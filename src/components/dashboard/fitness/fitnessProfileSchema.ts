import * as z from "zod";

export const profileSchema = z.object({
  age: z.number().min(10).max(100),
  gender: z.enum(["Male", "Female", "Other"]),
  height: z.number().min(50),
  weight: z.number().min(20),
  goal: z.string().min(1, "Required"),
  activityLevel: z.string().min(1, "Required"),
  workoutDays: z.string().min(1, "Required"),
  sleepHours: z.number().min(1).max(24),
  waterIntake: z.number().min(0),
  injuries: z.string().optional(),
  medicalCondition: z.string().optional(),
  dietType: z.string().min(1, "Required"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export interface ApiErrorResponse {
  message: string;
}
