"use client";
import React from "react";
import { User, MapPin, Award, ArrowRight } from "lucide-react";

const CoachCard = ({ coach }: { coach: any }) => {
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
            <User size={18} className="text-[var(--primary)]" /> {coach.fullName}
          </h3>
          <p className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mt-1">
            <MapPin size={14} /> {coach.location}
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm font-semibold">
           <span className="flex items-center gap-1 bg-[var(--bg-primary)] px-2 py-1 rounded-lg border border-[var(--border-color)]">
              <Award size={14} className="text-[var(--primary)]" /> {coach.experienceYears}Y Exp
           </span>
           <span className="text-[var(--text-secondary)] uppercase text-[10px] tracking-widest bg-[var(--border-color)] px-2 py-1 rounded-lg">
              {coach.trainingTypes[0]}
           </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {coach.specialties.split(",").slice(0, 3).map((s: string) => (
            <span key={s} className="text-[10px] font-black uppercase text-[var(--primary)]">
              #{s.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="p-5 pt-0">
        <button className="w-full btn-primary flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs group">
          View Profile <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};

export default CoachCard;