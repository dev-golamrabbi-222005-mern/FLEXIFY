"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import CoachCalendarView from "@/components/dashboard/coach-schedule/CoachCalendarView";
import UpcomingSessionsList from "@/components/dashboard/coach-schedule/UpcomingSessionsList";
import AddSessionModal, { SessionFormData } from "@/components/dashboard/coach-schedule/AddSessionModal";

export default function CoachSchedule() {
  const { data: session } = useSession();
  const { register, handleSubmit } = useForm<SessionFormData>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: trainees = [] } = useQuery({
    queryKey: ["trainees"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: sessions = [], refetch: refetchSession } = useQuery({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/sessions?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: upcomingSessions = [], refetch: refetchUpcoming } = useQuery({
    queryKey: ["upcomingSessions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/sessions/upcoming?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const handleAddSession = async (data: SessionFormData) => {
    const payload = {
      ...data,
      day: Number(data.day),
      month: Number(data.month),
      year: Number(data.year),
    };
    const res = await axios.post(`/api/coach/sessions/add`, payload);
    refetchSession();
    refetchUpcoming();
    if (res.data.acknowledged) toast.success("Session added successfully");
    else toast.error("Failed to add session");
    setIsModalOpen(false);
  };

  const formatTime12h = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    if (hourStr === undefined || minute === undefined) return time24;
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  return (
    <div className="max-w-full space-y-8 md:space-y-12 lg:space-y-16">
      <title>Schedule | Dashboard - Flexify</title>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
            Schedule
          </h1>
          <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
            Manage your availability and training sessions
          </p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 btn-primary">
          <Plus size={18} />
          Add Schedule
        </button>
      </div>

      <CoachCalendarView
        currentMonth={currentMonth}
        onPrevMonth={() => {
          const prev = new Date(currentMonth);
          prev.setMonth(prev.getMonth() - 1);
          setCurrentMonth(prev);
        }}
        onNextMonth={() => {
          const next = new Date(currentMonth);
          next.setMonth(next.getMonth() + 1);
          setCurrentMonth(next);
        }}
        sessions={sessions}
        formatTime12h={formatTime12h}
      />

      <UpcomingSessionsList upcomingSessions={upcomingSessions} formatTime12h={formatTime12h} />

      <AddSessionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={handleAddSession}
        trainees={trainees}
      />
    </div>
  );
}
