"use client";

import React, { use } from "react"; // Next.js 15 recommendation
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { 
  User, MapPin, Award, Calendar, 
  CheckCircle2, Briefcase, GraduationCap,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Coach, Certification } from "@/types/coach";

const CoachDetails = () => {
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

  // Loading State
  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-[var(--primary)] tracking-widest uppercase text-sm">Loading Coach Profile...</p>
      </div>
    </div>
  );

  // Error or Not Found State
  if (isError || !coach) return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-[var(--bg-primary)]">
      <h2 className="text-2xl font-bold text-red-500">Coach Profile Not Found</h2>
      <Link href="/coaches" className="text-[var(--primary)] hover:underline flex items-center gap-2">
        <ArrowLeft size={18} /> Back to Coaches
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]  selection:bg-[var(--primary)] selection:text-white">
      {/* ─── Hero / Header Section ─── */}
      <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
        <img 
          src={coach?.profileImage || coach?.imageUrl} 
          className="object-cover w-full h-full scale-110 blur-md opacity-20" 
          alt="background"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent" />
      </div>

      <div className="relative z-10 px-4 md:px-6 mx-auto -mt-55 md:-mt-90 max-w-7xl lg:-mt-85 pb-8 md:pb-12 lg:pb-16">
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          
          {/* ─── Left Sidebar: Main Profile Card ─── */}
          <aside className="w-full lg:w-[380px] lg:sticky lg:top-24">
            <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden shadow-2xl shadow-black/10">
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={coach?.profileImage || coach?.imageUrl} 
                  className="object-cover w-full h-full transition-transform duration-700 hover:scale-105" 
                  alt={coach?.name} 
                />
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-black text-[var(--text-primary)] leading-tight">{coach?.name}</h1>
                  <p className="text-[var(--primary)] font-semibold flex items-center gap-2">
                    <MapPin size={18} /> {coach?.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] text-center">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Exp.</p>
                    <p className="text-xl font-black text-[var(--text-primary)]">{coach?.experienceYears}Y</p>
                  </div>
                  <div className="bg-[var(--bg-primary)] p-4 rounded-2xl border border-[var(--border-color)] text-center">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase font-black tracking-widest mb-1">Slots</p>
                    <p className="text-xl font-black text-[var(--text-primary)]">{coach?.maxClients}</p>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--text-secondary)] font-bold">Monthly Plan</span>
                    <span className="text-2xl font-black text-[var(--primary)]">${coach?.pricing?.monthly}</span>
                  </div>
                  <button className="w-full py-4 bg-[var(--primary)] text-white rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-[var(--primary)]/20">
                    Hire Coach Now
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* ─── Right Content Area ─── */}
          <main className="flex-1 w-full space-y-8">
            
            {/* Bio Section */}
            <section className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-color)] shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-[var(--text-primary)]">
                <User className="text-[var(--primary)]" /> BIOGRAPHY
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed text-lg font-medium opacity-90">
                {coach?.bio}
              </p>
            </section>

            {/* Expertise Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <section className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-color)]">
                <h3 className="flex items-center gap-3 mb-5 text-lg font-black">
                  <Award className="text-[var(--primary)]" /> SPECIALTIES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coach?.specialties?.split(",").map((s) => (
                    <span key={s} className="px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      #{s.trim()}
                    </span>
                  ))}
                </div>
              </section>

              <section className="bg-[var(--bg-secondary)] p-8 rounded-2xl border border-[var(--border-color)]">
                <h3 className="flex items-center gap-3 mb-5 text-lg font-black">
                  <Briefcase className="text-[var(--primary)]" /> TRAINING MODES
                </h3>
                <div className="flex flex-wrap gap-2">
                  {coach?.trainingTypes?.map((type) => (
                    <span key={type} className="px-4 py-2 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl text-xs font-black uppercase tracking-wider border border-[var(--primary)]/20">
                      {type}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            {/* Academic & Professional */}
            <section className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-color)]">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-5">
                  <h3 className="flex items-center gap-3 text-lg font-black">
                    <GraduationCap className="text-[var(--primary)]" /> EDUCATION
                  </h3>
                  <div className="p-5 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
                    <p className="text-[var(--text-primary)] font-bold text-lg">{coach?.education}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <h3 className="flex items-center gap-3 text-lg font-black">
                    <CheckCircle2 className="text-[var(--primary)]" /> CERTIFICATIONS
                  </h3>
                  <div className="space-y-4">
                    {coach?.certifications?.map((cert: Certification, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start p-4 bg-[var(--bg-primary)] rounded-2xl border border-[var(--border-color)]">
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

            {/* Schedule Section */}
            <section className="bg-[var(--bg-secondary)] p-8 md:p-10 rounded-2xl border border-[var(--border-color)]">
              <h3 className="flex items-center gap-3 mb-6 text-lg font-black">
                <Calendar className="text-[var(--primary)]" /> AVAILABILITY
              </h3>
              <div className="flex flex-wrap gap-3">
                {coach?.availableDays?.map((day) => (
                  <div key={day} className="relative group">
                    <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-[var(--bg-primary)] border border-[var(--border-color)] group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition-all duration-300 font-black text-sm">
                      {day}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-sm text-[var(--text-muted)] font-medium ">
                * Note: Working hours may vary. Please contact the coach for exact session timings.
              </p>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CoachDetails;