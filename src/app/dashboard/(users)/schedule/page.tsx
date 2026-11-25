"use client";

import React, { useState } from "react";
import { Loader2, Settings2 } from "lucide-react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import type { DaySchedule } from "@/types";
import ScheduleHeader from "@/components/dashboard/schedule/ScheduleHeader";
import ScheduleDayCard from "@/components/dashboard/schedule/ScheduleDayCard";
import CustomTaskModal from "@/components/dashboard/schedule/CustomTaskModal";

type WeeklySchedule = Record<string, DaySchedule>;

interface ScheduleData {
  workoutDays: string;
  routines: { id: string; name: string }[];
  currentSchedule: WeeklySchedule;
}

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function SchedulePage() {
  const queryClient = useQueryClient();
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
    mutationFn: (newSchedule: WeeklySchedule) => axios.post("/api/user/schedule", { days: newSchedule }),
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
    const finalSchedule = { ...(data?.currentSchedule || {}), ...editedSchedule };
    mutation.mutate(finalSchedule);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-40 text-[var(--primary)]">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-full relative space-y-8 md:space-y-12 lg:space-y-16">
      <title>Schedule | Dashboard - Flexify</title>
      <CustomTaskModal
        isOpen={isModalOpen}
        activeDay={activeDay}
        tempTask={tempTask}
        setTempTask={setTempTask}
        tempTime={tempTime}
        setTempTime={setTempTime}
        onSave={saveManualTask}
        onClose={() => setIsModalOpen(false)}
      />

      <ScheduleHeader
        workoutDays={data?.workoutDays}
        isEditMode={isEditMode}
        isPending={mutation.isPending}
        onEditModeToggle={() => setIsEditMode(true)}
        onCancel={() => {
          setIsEditMode(false);
          setEditedSchedule({});
        }}
        onConfirm={handleSave}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
        {DAYS_OF_WEEK.map((day) => (
          <ScheduleDayCard
            key={day}
            day={day}
            scheduleValue={getDisplayValue(day)}
            isEditMode={isEditMode}
            routines={data?.routines}
            onCustomModalOpen={openManualModal}
            onRoutineSelect={(d, routineName) => {
              setEditedSchedule((prev) => ({
                ...prev,
                [d]: { routine: routineName, time: getDisplayValue(d).time },
              }));
            }}
          />
        ))}
      </div>

      {!isEditMode && (
        <div className="mt-12 text-center p-10 bg-[var(--bg-secondary)] border border-dashed border-[var(--border-color)] rounded-2xl">
          <p className="text-[var(--text-secondary)] font-medium mb-5">
            Need to adjust your training days or routines?
          </p>
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
