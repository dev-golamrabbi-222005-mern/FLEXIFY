"use client";

import React, { useState } from "react";
import {
  CalendarDays,
  Clock,
  Save,
  Loader2,
  PlusCircle,
  Moon,
  Zap,
  ChevronRight,
  Edit3,
  X,
  Settings2,
} from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Swal from "sweetalert2";
import { DaySchedule } from "@/types/user";

type WeeklySchedule = Record<string, DaySchedule>;

interface RoutineOption {
  id: string;
  name: string;
}

interface ScheduleData {
  workoutDays: string;
  routines: RoutineOption[];
  currentSchedule: WeeklySchedule;
}
const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export default function SchedulePage() {
  const queryClient = useQueryClient();

  // States
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedSchedule, setEditedSchedule] = useState<WeeklySchedule>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [tempTask, setTempTask] = useState("");
  const [tempTime, setTempTime] = useState("06:00");

  const { data, isLoading } = useQuery<ScheduleData>({
    queryKey: ["user-schedule-data"],
    queryFn: async () => {
      const res = await axios.get("/api/user/schedule");
      return res.data;
    },
  });

  const getDisplayValue = (day: string): DaySchedule => {
    const val = editedSchedule[day] ?? data?.currentSchedule?.[day];
    if (typeof val === "string") return { routine: val, time: "06:00" };
    return val ?? { routine: "Rest Day", time: "06:00" };
  };

  const mutation = useMutation({
    mutationFn: (newSchedule: WeeklySchedule) =>
      axios.post("/api/user/schedule", { days: newSchedule }),
    onSuccess: () => {
      Swal.fire({
        title: "Success!",
        text: "Schedule updated successfully.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
        background: "var(--bg-secondary)",
        color: "var(--text-primary)",
        customClass: { popup: "rounded-2xl" },
      });
      setIsEditMode(false);
      setEditedSchedule({});
      queryClient.invalidateQueries({ queryKey: ["user-schedule-data"] });
    },
  });

  const openManualModal = (day: string) => {
    const current = getDisplayValue(day);
    setActiveDay(day);
    setTempTask(current.routine === "Rest Day" ? "" : current.routine);
    setTempTime(current.time);
    setIsModalOpen(true);
  };

  const saveManualTask = () => {
    if (activeDay) {
      setEditedSchedule((prev) => ({
        ...prev,
        [activeDay]: { routine: tempTask || "Rest Day", time: tempTime },
      }));
    }
    setIsModalOpen(false);
  };

  const handleSave = () => {
    const finalSchedule = {
      ...(data?.currentSchedule || {}),
      ...editedSchedule,
    };
    mutation.mutate(finalSchedule);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center py-40 text-[var(--primary)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );

  return (
    <div className="mt-10 max-w-full mx-auto px-4 pb-20 font-sans relative">
      {/* Custom Manual Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] w-full max-w-md rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Edit3 size={20} className="text-[var(--primary)]" />
                Custom Task: {activeDay}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-[var(--bg-primary)] rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <input
                autoFocus
                value={tempTask}
                onChange={(e) => setTempTask(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && saveManualTask()}
                placeholder="e.g. Swimming"
                className="input-style w-full h-14 rounded-2xl text-lg"
              />

              {/* ADDED: Time Input Field */}
              <div className="flex items-center gap-3 bg-[var(--bg-primary)] p-3 rounded-2xl border border-[var(--border-color)]">
                <Clock size={20} className="text-[var(--primary)]" />
                <input
                  type="time"
                  value={tempTime}
                  onChange={(e) => setTempTime(e.target.value)}
                  className="bg-transparent text-[var(--text-primary)] outline-none w-full font-bold"
                />
              </div>
            </div>
            <button
              onClick={saveManualTask}
              className="btn-primary w-full py-4 rounded-2xl font-bold"
            >
              Set Custom Task
            </button>
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
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter uppercase leading-none">
              Weekly Schedule
            </h1>
            <p className="text-[var(--text-secondary)] text-sm font-medium mt-1">
              Active Goal:{" "}
              <span className="text-[var(--primary)] font-bold">
                {data?.workoutDays} Days / Week
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {!isEditMode ? (
            <>
              <Link
                href="/dashboard/create-workout"
                className="flex-1 md:flex-none"
              >
                <button className="btn-secondary w-full flex items-center justify-center gap-2 border-dashed rounded-2xl py-3 px-6 text-sm font-bold">
                  <PlusCircle size={18} /> New Routine
                </button>
              </Link>
              <button
                onClick={() => setIsEditMode(true)}
                className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl py-3 px-6 text-sm font-bold shadow-lg shadow-emerald-500/10"
              >
                <Settings2 size={18} /> Edit Plan
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditMode(false);
                  setEditedSchedule({});
                }}
                className="btn-secondary flex-1 md:flex-none rounded-2xl py-3 px-6 text-sm font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={mutation.isPending}
                className="btn-primary flex-1 md:flex-none flex items-center justify-center gap-2 rounded-2xl py-3 px-8 text-sm font-bold shadow-lg shadow-emerald-500/10"
              >
                {mutation.isPending ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}
                Confirm Changes
              </button>
            </>
          )}
        </div>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {DAYS_OF_WEEK.map((day) => {
          const scheduleValue = getDisplayValue(day);
          const isRestDay = scheduleValue.routine === "Rest Day";

          return (
            <div
              key={day}
              className={`bg-[var(--bg-secondary)] border transition-all duration-300 p-6 rounded-2xl relative ${
                !isRestDay
                  ? "border-[var(--primary)] shadow-md"
                  : "border-[var(--border-color)] opacity-90"
              } ${
                isEditMode ? "ring-2 ring-[var(--primary)]/20 scale-[1.01]" : ""
              }`}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold uppercase tracking-tight">
                  {day}
                </h2>
                <div
                  className={`p-2 rounded-2xl ${
                    !isRestDay
                      ? "bg-[var(--primary-light)] text-[var(--primary)]"
                      : "bg-[var(--bg-primary)] text-[var(--text-muted)] border border-[var(--border-color)]"
                  }`}
                >
                  {!isRestDay ? <Zap size={18} /> : <Moon size={18} />}
                </div>
              </div>

              <div className="min-h-[80px] flex flex-col justify-center">
                {!isEditMode ? (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h3
                      className={`text-xl font-black leading-tight ${
                        isRestDay
                          ? "text-[var(--text-muted)]"
                          : "text-[var(--text-primary)]"
                      }`}
                    >
                      {scheduleValue.routine}
                    </h3>
                    <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] mt-2 font-bold">
                      {isRestDay ? "Recovery Day" : "Training Day"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 animate-in zoom-in-95 duration-200">
                    <select
                      value={
                        data?.routines?.some(
                          (r) => r.name === scheduleValue.routine
                        )
                          ? scheduleValue.routine
                          : isRestDay
                          ? "Rest Day"
                          : "Custom"
                      }
                      onChange={(e) => {
                        if (e.target.value === "Custom") openManualModal(day);
                        else
                          setEditedSchedule((prev) => ({
                            ...prev,
                            [day]: {
                              routine: e.target.value,
                              time: scheduleValue.time,
                            },
                          }));
                      }}
                      className="input-style cursor-pointer text-xs rounded-2xl w-full"
                    >
                      <option value="Rest Day">Rest Day</option>
                      {data?.routines?.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      ))}
                      <option value="Custom">Manual Entry...</option>
                    </select>
                    {!isRestDay && (
                      <button
                        onClick={() => openManualModal(day)}
                        className="w-full flex items-center justify-between p-2 text-[10px] font-bold text-[var(--primary)] bg-[var(--primary-light)]/30 rounded-xl"
                      >
                        Customize Text <Edit3 size={12} />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[var(--border-color)]/50 pt-4">
                <span
                  className={`text-[9px] font-black uppercase tracking-tighter ${
                    !isRestDay
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)]"
                  }`}
                >
                  {isRestDay ? "Free Time" : "Session Active"}
                </span>
                <div className="flex items-center gap-1 text-[10px] text-[var(--text-muted)] font-bold">
                  <Clock size={12} /> {scheduleValue.time}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {!isEditMode && (
        <div className="mt-12 text-center p-10 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-2xl">
          <p className="text-[var(--text-secondary)] font-medium mb-5">
            Need to adjust your training days or routines?
          </p>
          <button
            onClick={() => setIsEditMode(true)}
            className="btn-primary px-10 py-4 rounded-2xl font-bold inline-flex items-center gap-2 shadow-xl shadow-emerald-500/20"
          >
            <Settings2 size={20} /> Update Weekly Plan
          </button>
        </div>
      )}
    </div>
  );
}
