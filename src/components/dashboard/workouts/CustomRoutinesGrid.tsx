"use client";

import { motion } from "framer-motion";
import { History, Dumbbell, CalendarDays, PlusCircle } from "lucide-react";
import { WorkoutCard } from "@/components/cards/SuggestedWorkoutCard";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

export interface CustomRoutineItem {
  _id: string;
  planName: string;
  exercises: any[];
  createdAt: string;
}

interface CustomRoutinesGridProps {
  myRoutines?: CustomRoutineItem[];
}

export default function CustomRoutinesGrid({ myRoutines }: CustomRoutinesGridProps) {
  const customCount = myRoutines?.length ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45, ease }}
    >
      <div className="flex items-center gap-3 mb-6 pt-8">
        <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
        <div className="flex items-center gap-2">
          <History size={22} style={{ color: "var(--primary)" }} />
          <p className="text-3xl font-bold uppercase tracking-[0.1em]">My Custom Routines</p>
        </div>
        <div className="h-px flex-1" style={{ background: "var(--border-color)" }} />
      </div>

      {customCount > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myRoutines!.map((routine, i) => (
            <motion.div
              key={routine._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32 + i * 0.07, duration: 0.4, ease }}
              className="rounded-3xl overflow-hidden"
              style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
            >
              <div className="h-1.5 w-full" style={{ background: "var(--primary)" }} />
              <div className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    <Dumbbell size={18} style={{ color: "var(--primary)" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-base leading-tight truncate" style={{ color: "var(--text-primary)" }}>
                      {routine.planName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <CalendarDays size={10} style={{ color: "var(--text-muted)" }} />
                      <p className="text-[10px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        {new Date(routine.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shrink-0"
                    style={{
                      background: "rgba(16,185,129,0.1)",
                      color: "var(--primary)",
                      border: "1px solid rgba(16,185,129,0.2)",
                    }}
                  >
                    {routine.exercises.length} ex
                  </span>
                </div>

                <WorkoutCard
                  id={routine._id}
                  title={routine.planName}
                  exercises={routine.exercises}
                  createdAt={routine.createdAt}
                  type="custom"
                />
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="text-center py-16 rounded-3xl"
          style={{ border: "2px dashed var(--border-color)", background: "var(--bg-secondary)" }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)" }}
          >
            <PlusCircle size={24} style={{ color: "var(--primary)" }} />
          </div>
          <p className="font-black text-base mb-1" style={{ color: "var(--text-primary)" }}>No custom routines yet</p>
          <p className="text-sm max-w-xs mx-auto" style={{ color: "var(--text-secondary)" }}>
            Create your first custom routine to get started.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}
