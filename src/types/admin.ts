import { ObjectId } from "mongodb";

export interface DashboardStats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  pendingCoaches: number;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  time: string;
  type: "user" | "coach" | "payment" | "system";
}

export interface ChartData {
  name: string;
  users: number;
  revenue: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
  activities: Activity[];
  chartData: ChartData[];
}

export interface Plan {
  _id?: string | ObjectId;
  name: string;
  price: number;
  durationMonths: number;
  features: string[];
  popular?: boolean;
}

export interface Transaction {
  _id?: string | ObjectId;
  transactionId: string;
  userName: string;
  userEmail: string;
  planName: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  createdAt: string;
}

export interface AdminUser {
  _id: string | ObjectId;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended" | "pending";
  createdAt: string;
}

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "read" | "unread";
  createdAt: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalExercises: number;
  activeRoutines: number;
}
