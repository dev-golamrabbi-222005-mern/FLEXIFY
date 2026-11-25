import { DaySchedule } from "./user";

export type WeeklySchedule = Record<string, DaySchedule>;

export interface RoutineOption {
  value: string;
  label: string;
}

export interface ScheduleData {
  schedule: WeeklySchedule;
}

export interface SessionSlot {
  id: string;
  day: string;
  time: string;
  trainerName?: string;
  traineeName?: string;
  status: "available" | "booked" | "completed" | "cancelled";
}

export interface CoachAvailability {
  day: string;
  slots: string[];
}
