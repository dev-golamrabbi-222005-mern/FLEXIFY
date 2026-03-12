
export interface Exercise {
  id: string;
  name: string;
  bodyPart: string;
  equipment: string;
  level: string;
  primaryMuscles: string[]; 
  image?: string;
  images: string[];        
  instructions: string[];  
  category?: string;
}