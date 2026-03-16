import { ObjectId } from "mongodb";


export interface Certification {
  title: string;
  issuedBy: string;
  year: number;
}


export interface Pricing {
  monthly: number;
  perSession: number;
}


export interface Coach {
  _id: string | ObjectId; 
  name: string;           
  fullName: string;       
  email: string;
  phone: string;
  imageUrl: string;       
  profileImage: string;   
  password?: string;      
  role: "coach";          
  status: "approved" | "pending" | "rejected";
  gender: "male" | "female" | "other";
  
  bio: string;
  location: string;
  education: string;
  experienceYears: number;
  languages: string;     
  
  specialties: string;    
  maxClients: number;
  
  availableDays: string[];   
  trainingTypes: string[];    
  preferredClients: string[];
  
  certifications: Certification[]; 
  pricing: Pricing;               
  
  createdAt?: Date | string;
  updatedAt?: Date | string;
}