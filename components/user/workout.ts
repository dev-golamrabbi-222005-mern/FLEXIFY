export type TrackingType = 'WEIGHT_REPS' | 'REPS' | 'TIME';

export interface SetData {
  id: string;
  weight: string;
  reps: string;
  seconds: string;
  previous: string;
  isCompleted: boolean;
}

export interface Exercise {
  _id: string;      
  id?: string;          
  name: string;
  bodyPart?: string;
  equipment?: string;
  level?: string;
  primaryMuscles?: string[]; 
  secondaryMuscles?: string[]; 
  image?: string;
  images?: string[];         
  instructions?: string[];   
  category?: string;
  trackingType: TrackingType;
  sets: SetData[];     
}

export interface WorkoutResponse {
  success: boolean;
  data: {
    planName: string;
    exercises: Exercise[];
  };
}

export interface ExerciseSet {
  reps: number;
  weight: number;
  time: string;
}


export interface LogExercise { 
  exerciseName: string;
  sets: ExerciseSet[];
}

export interface WorkoutLog {
  _id: string;
  planName: string;
  duration: number;
  createdAt: string;
  exercises: LogExercise[];
}

export interface WeeklyStat {
  day: string;
  workout: number;
  calories: number;
}


export interface UserRoutine {
  _id: string;
  routineName: string;
  userEmail: string;
  exercises: string[]; 
  createdAt: string;
}

export interface DefaultPackagesResponse {
  beginner: Exercise[];
  intermediate: Exercise[];
  advanced: Exercise[];
}

export interface TodayGoal {
  planName: string;
  progress: number;
  isCompleted: boolean;
  totalExercises: number;
}