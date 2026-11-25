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
  status: "approved" | "pending" | "rejected"| "warning";
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

export interface Trainee {
  _id?: string | ObjectId;
  id?: string;
  name: string;
  email: string;
  plan?: string;
  progress?: number;
  status?: "active" | "inactive" | "completed";
  joinedDate?: string;
  avatar?: string;
}

export interface Session {
  id?: string;
  _id?: string | ObjectId;
  traineeId: string;
  traineeName: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

export interface SessionFormData {
  traineeId: string;
  date: string;
  time: string;
  notes?: string;
}

export interface IReview {
  _id?: string | ObjectId;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string | Date;
}

export interface MonthlyEarning {
  month: string;
  earnings: number;
  sessions?: number;
  clients?: number;
}

export interface NewUsersWeekly {
  day: string;
  users: number;
}

export interface AnalyticsData {
  stats: {
    pendingCount: number;
    approvedCount: number;
    warningCount: number;
    totalSessions?: number;
  };
  performanceData: {
    month: string;
    sessions: number;
    clients: number;
  }[];
}

export interface UpdateStatusParams {
  id: string | ObjectId;
  status: "approved" | "warning" | "rejected" | "suspended";
}
