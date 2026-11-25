"use client";

import React from "react";
import { User, Award, Briefcase, GraduationCap, CheckCircle2, Calendar } from "lucide-react";
import { Coach, Certification } from "@/types/coach";

interface CoachDetailsContentProps {
  coach: Coach;
}

export function CoachDetailsContent({ coach }: CoachDetailsContentProps) {
  return (
    <main className="flex-1 w-full space-y-8">
      <section className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-[var(--text-primary)]">
          <User className="text-[var(--primary)]" /> BIOGRAPHY
        </h2>
        <p className="text-[var(--text-secondary)] leading-relaxed text-lg font-medium opacity-90">
          {coach.bio}
        </p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-color)]">
          <h3 className="flex items-center gap-3 mb-5 text-lg font-black text-[var(--text-primary)]">
            <Award className="text-[var(--primary)]" /> SPECIALTIES
          </h3>
          <div className="flex flex-wrap gap-2">
            {coach.specialties?.split(",").map((s) => (
              <span
                key={s}
                className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
              >
                #{s.trim()}
              </span>
            ))}
          </div>
        </section>

        <section className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-color)]">
          <h3 className="flex items-center gap-3 mb-5 text-lg font-black text-[var(--text-primary)]">
            <Briefcase className="text-[var(--primary)]" /> TRAINING MODES
          </h3>
          <div className="flex flex-wrap gap-2">
            {coach.trainingTypes?.map((type) => (
              <span
                key={type}
                className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl text-xs font-black uppercase tracking-wider border border-[var(--primary)]/20"
              >
                {type}
              </span>
            ))}
          </div>
        </section>
      </div>

      <section className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-color)]">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-5">
            <h3 className="flex items-center gap-3 text-lg font-black text-[var(--text-primary)]">
              <GraduationCap className="text-[var(--primary)]" /> EDUCATION
            </h3>
            <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
              <p className="text-[var(--text-primary)] font-bold text-lg">{coach.education}</p>
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="flex items-center gap-3 text-lg font-black text-[var(--text-primary)]">
              <CheckCircle2 className="text-[var(--primary)]" /> CERTIFICATIONS
            </h3>
            <div className="space-y-4">
              {coach.certifications?.map((cert: Certification, idx: number) => (
                <div
                  key={idx}
                  className="flex gap-4 items-start p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]"
                >
                  <div className="w-2 h-2 rounded-full bg-[var(--primary)] mt-2 shrink-0" />
                  <div>
                    <p className="font-bold text-[var(--text-primary)] leading-tight">{cert.title}</p>
                    <p className="text-xs text-[var(--text-muted)] font-medium mt-1 uppercase tracking-tighter">
                      {cert.issuedBy} • {cert.year}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-color)]">
        <h3 className="flex items-center gap-3 mb-6 text-lg font-black text-[var(--text-primary)]">
          <Calendar className="text-[var(--primary)]" /> AVAILABILITY
        </h3>
        <div className="flex flex-wrap gap-3">
          {coach.availableDays?.map((day) => (
            <div key={day} className="relative group">
              <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 font-black text-sm">
                {day}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-[var(--text-muted)] font-medium">
          * Note: Working hours may vary. Please contact the coach for exact session timings.
        </p>
      </section>
    </main>
  );
}
