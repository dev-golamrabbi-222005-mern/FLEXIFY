"use server";

import { dbConnect } from "@/lib/dbConnect";
import bcrypt from "bcrypt";
import { ObjectId } from "mongodb";

// Fitness Profile Interface
export interface FitnessProfile {
  age: number;
  gender: string;
  height: number;
  weight: number;
  goal: string;
  activityLevel: string;
  workoutDays: string;
  sleepHours: number;
  waterIntake: number;
  injuries?: string;
  medicalCondition?: string;
  dietType: string;
}

export interface Certification {
  title: string;
  issuedBy: string;
  year: number;
}

export interface DbUser {
  _id?: ObjectId | string;
  provider?: string;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  imageUrl?: string;
  role: "user" | "coach" | "admin" | ""; 
  status: "pending" | "approved" | "none" | "rejected";
  
  // Fitness Data
  fitnessProfile?: FitnessProfile;
  
  // Coach Specific Data
  fullName?: string;
  bio?: string;
  location?: string;
  specialties?: string;
  experienceYears?: number;
  certifications?: Certification[];
  education?: string;
  trainingTypes?: string[];
  availableDays?: string[];
  preferredClients?: string[];
  languages?: string;
  pricing?: {
    monthly: number;
    perSession: number;
  };
  maxClients?: number;
  isProfileComplete?: boolean;
  
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserPayload {
  email: string;
  phone?: string;
  imageUrl?: string;
  password?: string;
  role?: string;
  name?: string;
}
export const postUser = async (payload: UserPayload) => {
  const { email, password, name, phone, imageUrl, role } = payload;
  
  const collection = await dbConnect<DbUser>("users");

  const isExist = await collection.findOne({ email });
  if (isExist) {
    return { success: false, message: "Email already exists" };
  }

  const hashedPassword = password ? await bcrypt.hash(password, 14) : undefined;

  const newUser: DbUser = {
    name: name || "",
    email: email,
    phone: phone || "",
    imageUrl: imageUrl || "",
    password: hashedPassword,
    role: "",       
    status: "none",
    updatedAt: new Date(),
  };

  const result = await collection.insertOne(newUser);

  if (result.acknowledged) {
    return { success: true, message: "Registration successful." };
  }
  return { success: false, message: "Something went wrong." };
};

export const loginUser = async (payload: UserPayload) => {
  const { email, password } = payload;
  if (!email || !password) return null;

  const collection = await dbConnect<DbUser>("users");
  const user = await collection.findOne({ email });

  if (!user || !user.password) return null;

  const isMatched = await bcrypt.compare(password, user.password);
  if (!isMatched) return null;

  return {
    ...user,
    _id: user._id?.toString(),
  };
};