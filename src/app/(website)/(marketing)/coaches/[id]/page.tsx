"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Coach } from "@/types/coach";
import { CoachProfileSidebar } from "./CoachProfileSidebar";
import { CoachDetailsContent } from "./CoachDetailsContent";

export default function CoachDetails() {
  const params = useParams();
  const id = params?.id as string;

  const { data: coach, isLoading, isError } = useQuery<Coach>({
    queryKey: ["coach", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/coach/${id}`);
      return data;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-[var(--primary)] tracking-widest uppercase text-sm">
            Loading Coach Profile...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !coach) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[var(--bg-primary)]">
        <h2 className="text-2xl font-bold text-red-500">Coach Profile Not Found</h2>
        <Link
          href="/coaches"
          className="text-[var(--primary)] hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={18} /> Back to Coaches
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] selection:bg-[var(--primary)] selection:text-white">
      <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
        <img
          src={coach.profileImage || coach.imageUrl}
          className="object-cover w-full h-full scale-110 blur-md opacity-20"
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-4 md:px-6 mx-auto -mt-55 md:-mt-90 max-w-7xl lg:-mt-85 pb-8 md:pb-12 lg:pb-16">
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <CoachProfileSidebar coach={coach} />
          <CoachDetailsContent coach={coach} />
        </div>
      </div>
    </div>
  );
}
