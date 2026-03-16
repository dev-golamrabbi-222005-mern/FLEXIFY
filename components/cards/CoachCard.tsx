"use client";

import React from "react";

import { User, MapPin, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
<<<<<<< HEAD
=======
import { Coach } from "@/types/coach";
>>>>>>> 1c4356f41d776fe2dc14ba5bebb6695ec2a09291

type CoachCardProps = {
  coach: Coach;
};

const CoachCard = ({ coach }: CoachCardProps) => {
  console.log(coach);
  return (
    <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl shadow-sm overflow-hidden flex flex-col transition-all hover:border-[var(--primary)] group">
      <div className="relative h-56 w-full">
        <img
          src={coach.profileImage}
          alt={coach.fullName}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute bottom-3 left-3 bg-[var(--primary)] text-white px-3 py-1 rounded-lg text-sm font-black shadow-lg">
          ${coach.pricing.monthly}/MO
        </div>
      </div>

      <div className="p-5 flex-grow space-y-4">
        <div>
          <h3 className="text-xl font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <User size={18} className="text-[var(--primary)]" />{" "}
            {coach.fullName}
          </h3>

          <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
            <MapPin size={14} /> {coach.location}
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold">
          <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border-color)]">
            <Award size={14} className="text-[var(--primary)]" />{" "}
            {coach.experienceYears}Y Exp
          </span>

          <span className="text-[var(--text-secondary)] uppercase text-[10px] tracking-widest bg-[var(--border-color)] px-2 py-1 rounded-lg">
            {coach.trainingTypes?.[0] && (
              <span className="text-[var(--text-secondary)] uppercase text-[10px] tracking-widest bg-[var(--border-color)] px-2 py-1 rounded-lg">
                {coach.trainingTypes[0]}
              </span>
            )}
          </span>
        </div>

        <div className="flex flex-wrap gap-2 text-[10px] font-bold text-[var(--primary)]">
  {coach.specialties ? (
    coach.specialties
      .split(",")
      .slice(0, 3)
      .map((s: string) => (
        <span key={s} className="bg-[var(--primary)]/10 px-2 py-0.5 rounded-full">
          #{s.trim()}
        </span>
      ))
  ) : (
    <span>#GeneralFitness</span>
  )}
</div>
      </div>

      <div className="p-5 pt-0">
<<<<<<< HEAD
        <Link href={`/coaches/${coach._id}`} className="w-full btn-primary flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs group">
          View Profile{" "}
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
=======
        <Link href={`/coaches/${coach._id}`} className="w-full ...">
  View Profile <ArrowRight size={14} />
</Link>
>>>>>>> 1c4356f41d776fe2dc14ba5bebb6695ec2a09291
      </div>
    </div>
  );
};

export default CoachCard;
