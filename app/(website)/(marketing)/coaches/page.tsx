"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import BecomeCoachCTA from "./BecomeCoachCTA";
import CoachCard from "@/components/cards/CoachCard";
import { ObjectId } from "mongodb";

export type Coach = {
  _id: string; // frontend always uses string
  name: string;
  profileImage?: string;
  imageUrl?: string;
  location?: string;
  experienceYears?: number;
  trainingTypes?: string[];
  specialties?: string;
  pricing?: {
    monthly?: number;
  };
};

// This type represents the raw MongoDB response
export type CoachDB = Omit<Coach, "_id"> & { _id: ObjectId };

const CoachesPage = () => {
const {
  data: coaches,
  isLoading,
  isError,
} = useQuery({
  queryKey: ["coaches"],
  queryFn: async () => {
    const { data } = await axios.get<CoachDB[]>("/api/coach");
    // convert _id to string for frontend usage
    return data.map((coach) => ({ ...coach, _id: coach._id.toString() }));
  },
});

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-[var(--primary)]">
        Loading Flexify Coaches...
      </div>
    );
  if (isError)
    return (
      <div className="flex items-center justify-center min-h-screen font-bold text-red-500">
        Error loading coaches data.
      </div>
    );

  return (
    <div className="min-h-screen px-6 mx-auto mt-8 md:mt-12 mb-10 max-w-7xl">
      <title>Coaches - Flexify</title>

      <h1 className="text-3xl mb-10 md:text-5xl font-bold text-[var(--text-primary)] text-center tracking-tighter">
        Our Expert <span className="text-[var(--primary)]">Coaches</span>
      </h1>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {coaches?.map((coach: Coach) => (
          <CoachCard key={coach._id} coach={coach} />
        ))}
      </div>
      <BecomeCoachCTA />
    </div>
  );
};

export default CoachesPage;
