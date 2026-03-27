"use client";

import React, { useState } from "react";
import { 
  CalendarDays, Clock, Save, Loader2, 
  PlusCircle, Moon, Zap, ChevronRight, Edit3, X, Settings2
} from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

interface RoutineOption { id: string; name: string; }
interface ScheduleData {
  workoutDays: string;
  routines: RoutineOption[];
  currentSchedule: Record<string, string>;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const queryClient = useQueryClient();
  
  // States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [tempTask, setTempTask] = useState("");

  const { data, isLoading } = useQuery<ScheduleData>({
    queryKey: ["user-schedule-data"],
    queryFn: async () => {
      const res = await axios.get("/api/user/schedule");
      return res.data;
    }
  });

  const getDisplayValue = (day: string) => {
    return editedSchedule[day] ?? data?.currentSchedule?.[day] ?? "Rest Day";
  };

  const mutation = useMutation({
    mutationFn: (newSchedule: Record<string, string>) => 
      axios.post("/api/user/schedule", { days: newSchedule }),
    onSuccess: () => {
      toast.success("Schedule updated successfully.");
      setIsEditMode(false);
      setEditedSchedule({});
      queryClient.invalidateQueries({ queryKey: ["user-schedule-data"] });
    }
  });

  const openManualModal = (day: string) => {
    const currentValue = getDisplayValue(day);
    setActiveDay(day);
    setTempTask(currentValue === "Rest Day" ? "" : currentValue);
    setIsModalOpen(true);
  };

  const saveManualTask = () => {
    if (activeDay) {
      setEditedSchedule(prev => ({ ...prev, [activeDay]: tempTask || "Rest Day" }));
    }
    setIsModalOpen(false);
  };

  const handleSave = () => {
    const finalSchedule = { ...(data?.currentSchedule || {}), ...editedSchedule };
    mutation.mutate(finalSchedule);
  };

  if (isLoading) return (
    <div className="flex justify-center items-center py-40 text-[var(--primary)]">
      <Loader2 className="animate-spin" size={40} />
    </div>
  );

  return (
    <div className="relative max-w-full px-4 pb-20 mx-auto mt-10 font-sans">
       <title>Schedule | Dashboard - Flexify</title>
      
      {/* Custom Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="flex items-center gap-2 text-xl font-bold">
                <Edit3 size={20} className="text-[var(--primary)]" />
                Custom Task: {activeDay}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <input 
              autoFocus
              value={tempTask}
              onChange={(e) => setTempTask(e.target.value)}
              placeholder="e.g. Swimming, 5km Run"
              className="w-full mb-6 text-lg input-style h-14 rounded-2xl"
              onKeyDown={(e) => e.key === 'Enter' && saveManualTask()}
            />
            <button onClick={saveManualTask} className="w-full py-4 font-bold btn-primary rounded-2xl">Set Custom Task</button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-6 bg-[var(--bg-secondary)] p-6 md:p-8 rounded-2xl border border-[var(--border-color)] shadow-sm">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="p-3 bg-[var(--primary-light)] dark:bg-emerald-500/10 rounded-2xl text-[var(--primary)]">
            <CalendarDays size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black leading-none tracking-tighter uppercase md:text-3xl">Weekly Schedule</h1>
            <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">
              Active Goal: <span className="text-[var(--primary)] font-bold">{data?.workoutDays} Days / Week</span> 
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap w-full gap-3 md:w-auto">
          {!isEditMode ? (
            <>
              <Link href="/dashboard/create-workout" className="flex-1 md:flex-none">
                <button className="flex items-center justify-center w-full gap-2 px-6 py-3 text-sm font-bold border-dashed btn-secondary rounded-2xl">
                  <PlusCircle size={18} /> New Routine
                </button>
              </Link>
              <button 
                onClick={() => setIsEditMode(true)}
                className="flex items-center justify-center flex-1 gap-2 px-6 py-3 text-sm font-bold shadow-lg btn-primary md:flex-none rounded-2xl shadow-emerald-500/10"
              >
                <Settings2 size={18} /> Edit Plan
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => { setIsEditMode(false); setEditedSchedule({}); }}
                className="flex-1 px-6 py-3 text-sm font-bold btn-secondary md:flex-none rounded-2xl"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={mutation.isPending}
                className="flex items-center justify-center flex-1 gap-2 px-8 py-3 text-sm font-bold shadow-lg btn-primary md:flex-none rounded-2xl shadow-emerald-500/10"
              >
                {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Confirm Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
        {DAYS_OF_WEEK.map((day) => {
          const scheduleValue = getDisplayValue(day);
          const isRestDay = scheduleValue === "Rest Day";
          
          return (
            <div 
              key={day} 
              className={`bg-[var(--bg-secondary)] border transition-all duration-300 p-6 rounded-2xl relative ${
                !isRestDay ? "border-[var(--primary)] shadow-md" : "border-[var(--border-color)] opacity-90"
              } ${isEditMode ? "ring-2 ring-[var(--primary)]/20 scale-[1.01]" : ""}`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold tracking-tight uppercase">{day}</h2>
                <div className={`p-2 rounded-2xl ${!isRestDay ? "bg-[var(--primary-light)] text-[var(--primary)]" : "bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)]"}`}>
                  {!isRestDay ? <Zap size={18} /> : <Moon size={18} />}
                </div>
              </div>

              <div className="min-h-[80px] flex flex-col justify-center">
                {!isEditMode ? (
                  <div className="duration-300 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className={`text-xl font-black leading-tight ${isRestDay ? "text-[var(--text-muted)]" : "text-[var(--text-primary)]"}`}>
                      {scheduleValue}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mt-2 font-bold">
                      {isRestDay ? "Recovery Day" : "Training Day"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 duration-200 animate-in zoom-in-95">
                    <select 
                      value={data?.routines?.some(r => r.name === scheduleValue) ? scheduleValue : (isRestDay ? "Rest Day" : "Custom")}
                      onChange={(e) => {
                        if(e.target.value === "Custom") openManualModal(day);
                        else setEditedSchedule(prev => ({ ...prev, [day]: e.target.value }));
                      }}
                      className="w-full text-xs cursor-pointer input-style rounded-2xl"
                    >
                      <option value="Rest Day">Rest Day</option>
                      {data?.routines?.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                      <option value="Custom">Manual Entry...</option>
                    </select>
                    {!isRestDay && (
                      <button onClick={() => openManualModal(day)} className="w-full flex items-center justify-between p-2 text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-light)]/30 rounded-xl">
                        Customize Text <Edit3 size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color)]/50 pt-4">
                 <span className={`text-[9px] font-black uppercase tracking-tighter ${!isRestDay ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>
                   {isRestDay ? "Free Time" : "Session Active"}
                 </span>
                 <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-bold">
                   <Clock size={12} /> 06:00 AM
                 </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isEditMode && (
        <div className="mt-12 text-center p-10 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-2xl">
          <p className="text-[var(--text-secondary)] font-medium mb-5">Need to adjust your training days or routines?</p>
          <button 
            onClick={() => setIsEditMode(true)}
            className="inline-flex items-center gap-2 px-10 py-4 font-bold shadow-xl btn-primary rounded-2xl shadow-emerald-500/20"
          >
            <Settings2 size={20} /> Update Weekly Plan
          </button>
        </div>
      )}
    </div>
  );
}