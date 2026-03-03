"use client";
import React from "react";
import Image from "next/image";
import { MoveRight, Dumbbell, Zap } from "lucide-react";
import Link from "next/link";

interface Exercise {
  _id: string;
  name: string;
  level: string;
  equipment: string;
  images: string[];
}

const ExerciseCard = ({ exercise }: { exercise: Exercise }) => {
  const rawImage = exercise.images?.[0];
  
  const displayImage = rawImage 
    ? rawImage.startsWith('http') 
      ? rawImage 
      : `/exercises/${rawImage.startsWith('/') ? rawImage.slice(1) : rawImage}`
    : "/placeholder-exercise.jpg";
  return (
    <div className="group relative bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-2xl overflow-hidden hover:border-[var(--primary)] transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-xl">
      
      <div className="relative aspect-square overflow-hidden bg-[var(--bg-primary)]">
        <Image
          src={displayImage}
          alt={exercise.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-2 leading-tight uppercase tracking-tight">
            {exercise.name}
          </h3>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap gap-2">
            <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-[var(--bg-primary)] text-[var(--primary)] px-2.5 py-1 rounded-full border border-[var(--border-color)]">
              <Zap size={10} /> {exercise.level}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-black uppercase bg-[var(--bg-primary)] text-[var(--text-secondary)] px-2.5 py-1 rounded-full border border-[var(--border-color)]">
              <Dumbbell size={10} /> {exercise.equipment || "Bodyweight"}
            </span>
          </div>

          <Link href={`/exercises/${exercise._id}`} className="pt-2 flex items-center text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] group-hover:text-[var(--primary)] transition-all">
            View Details <MoveRight size={14} className="ml-2 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;