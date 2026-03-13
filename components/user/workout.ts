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