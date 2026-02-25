"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import CoachCard from "@/components/cards/coachCard/page";

const CoachesPage = () => {
  const { data: coaches, isLoading, isError } = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      const { data } = await axios.get("/data.json");
      return data;
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center font-black uppercase tracking-widest text-[var(--primary)]">Loading Flexify Coaches...</div>;
  if (isError) return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Error loading coaches data.</div>;

  return (
    <div className="min-h-screen py-12 px-6 max-w-7xl mx-auto">
      
        <h1 className="text-4xl mb-10 md:text-5xl font-black text-[var(--text-primary)] uppercase text-center  tracking-tighter">
          Our Expert <span className="text-[var(--primary)]">Coaches</span>
        </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {coaches?.map((coach: any) =><CoachCard key={coach._id} coach={coach} />)}
      </div>
    </div>
  );
};

export default CoachesPage;