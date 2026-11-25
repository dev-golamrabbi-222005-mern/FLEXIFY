"use client";

import React from "react";
import { MapPin } from "lucide-react";
import { Coach } from "@/types/coach";

interface CoachProfileSidebarProps {
  coach: Coach;
}

export function CoachProfileSidebar({ coach }: CoachProfileSidebarProps) {
  return (
    <aside className="w-full lg:w-[380px] lg:sticky lg:top-24">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
        <div className="aspect-[4/5] overflow-hidden">
          <img
            src={coach.profileImage || coach.imageUrl}
            className="object-cover w-full h-full transition-transform duration-700 hover:scale-105"
            alt={coach.name}
          />
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-[var(--text-primary)] leading-tight">
              {coach.name}
            </h1>
            <p className="text-[var(--primary)] font-semibold flex items-center gap-2">
              <MapPin size={18} /> {coach.location}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] text-center">
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">
                Exp.
              </p>
              <p className="text-xl font-black text-[var(--text-primary)]">
                {coach.experienceYears}Y
              </p>
            </div>
            <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] text-center">
              <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">
                Slots
              </p>
              <p className="text-xl font-black text-[var(--text-primary)]">
                {coach.maxClients}
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)] font-bold">Monthly Plan</span>
              <span className="text-2xl font-black text-[var(--primary)]">
                ${coach.pricing?.monthly}
              </span>
            </div>
            <button className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--primary)]/20 cursor-pointer">
              Hire Coach Now
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
