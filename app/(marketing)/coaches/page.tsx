"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    <div className="min-h-screen py-12 px-4 max-w-7xl mx-auto">
      
        <h1 className="text-4xl mb-10 md:text-5xl font-black text-[var(--text-primary)] uppercase text-center  tracking-tighter">
          Our Expert <span className="text-[var(--primary)]">Coaches</span>
        </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {coaches?.map((coach: any) =>(
          <div key={coach._id} className="p-4 border border-[var(--border-color)] rounded-2xl bg-[var(--bg-secondary)]">
            <h2 className="text-xl font-bold">{coach.fullName}</h2>
            <p className="text-[var(--text-secondary)]">{coach.specialties}</p>
            <p className="text-sm font-semibold text-[var(--primary)]">${coach.pricing.monthly}/MO</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoachesPage;