"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import CoachCard from "@/components/cards/CoachCard";
import { Coach } from "./coachFilterConstants";

interface CoachGridListProps {
  coaches?: Coach[];
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
}

export function CoachGridList({
  coaches,
  isLoading,
  isFetching,
  isError,
}: CoachGridListProps) {
  return (
    <div className="relative mb-12 md:mb-16 lg:mb-20 min-h-[400px]">
      {(isLoading || isFetching) && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-start pt-20 bg-[var(--bg-primary)] bg-opacity-60 backdrop-blur-[2px] transition-all">
          <Loader2
            className="animate-spin text-[var(--primary)] mb-4"
            size={40}
          />
          <p className="text-xs font-black uppercase tracking-widest text-[var(--text-primary)]">
            Updating Coaches...
          </p>
        </div>
      )}

      {isError ? (
        <div className="flex items-center justify-center py-20 font-bold text-red-500">
          Error loading coaches data.
        </div>
      ) : (
        <>
          {coaches && coaches.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {coaches.map((coach) => (
                <CoachCard key={coach._id} coach={coach} />
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-20">
                <p className="text-[var(--text-secondary)] font-medium">
                  No coaches found matching your criteria.
                </p>
              </div>
            )
          )}
        </>
      )}
    </div>
  );
}
