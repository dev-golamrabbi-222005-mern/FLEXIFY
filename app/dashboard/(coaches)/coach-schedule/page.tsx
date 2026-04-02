
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Trainee {
  _id: string;
  name: string;
  userEmail: string;
  image: string;
  plan: string;
  status: string;
  progress: number;
  joined: string;
  avatar: string;
}

interface Session {
  day: number;
  month: number;
  year: number;
  time: string;
  type: string;
  clientEmail: string;
  clientInfo?: {
    name: string;
    imageUrl: string;
    phone: string;
    plan: string;
  };
}

interface SessionFormData {
  day: string;
  month: string;
  year: string;
  time: string;
  client: string;
  clientEmail: string;
  type: string;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CoachSchedule() {
  const {data: session} = useSession();
  const {register, handleSubmit} = useForm<SessionFormData>();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDay = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const calendarDays: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const { data: trainees = [] } = useQuery<Trainee[]>({
    queryKey: ["trainees"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: sessions = [], refetch: refetchSession } = useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/sessions?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: upcomingSessions = [], refetch: refetchUpcoming } = useQuery<Session[]>({
    queryKey: ["upcomingSessions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/sessions/upcoming?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const handleAddSession = async(data: SessionFormData) => {
    const payload = {
      ...data,
      day: Number(data.day),
      month: Number(data.month),
      year: Number(data.year),
    };
    const res = await axios.post(`/api/coach/sessions/add`, payload);
    refetchSession();
    refetchUpcoming();
    if(res.data.acknowledged){
      toast.success("Session added successfully");
    }
    else{
      toast.error("Failed to add session");
    }
  }

  const formatTime12h = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    if (hourStr === undefined || minute === undefined) return time24;
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  return (
    <>
      <div className="max-w-full space-y-8">
        <title>Schedule | Dashboard - Flexify</title>

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              Schedule
            </h1>

            <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
              Manage your availability and training sessions
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-2 btn-primary"
          >
            <Plus size={18} />
            Add Schedule
          </button>
        </div>

        {/* Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-glass"
        >
          {/* Month header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                const prevMonth = new Date(currentMonth);
                prevMonth.setMonth(prevMonth.getMonth() - 1);
                setCurrentMonth(prevMonth);
              }}
              className="p-2 rounded-lg hover:bg-gray-500/10"
              title="Previous month"
            >
              <ChevronLeft size={20} />
            </button>

            <h2
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {monthName}
            </h2>

            <button
              onClick={() => {
                const nextMonth = new Date(currentMonth);
                nextMonth.setMonth(nextMonth.getMonth() + 1);
                setCurrentMonth(nextMonth);
              }}
              className="p-2 rounded-lg hover:bg-gray-500/10"
              title="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Week Days */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((d) => (
              <div
                key={d}
                className="py-2 text-xs font-medium text-center"
                style={{ color: "var(--text-muted)" }}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, i) => {
              const daySessions = day
                ? sessions.filter(
                    (s: Session) =>
                      s.day === day &&
                      s.month === currentMonth.getMonth() + 1 &&
                      s.year === currentMonth.getFullYear(),
                  )
                : [];

              return (
                <div
                  key={i}
                  className="min-h-[85px] p-2 rounded-xl"
                  style={{
                    border: "1px solid var(--border-color)",
                    background: "var(--bg-secondary)",
                  }}
                >
                  {day && (
                    <>
                      {/* Day Number */}
                      <span
                        className="text-xs font-semibold"
                        style={{
                          color:
                            day === new Date().getDate()
                              ? "white"
                              : "var(--text-primary)",
                          background:
                            day === new Date().getDate()
                              ? "var(--primary)"
                              : "transparent",
                          padding:
                            day === new Date().getDate() ? "2px 6px" : "0",
                          borderRadius:
                            day === new Date().getDate() ? "999px" : "0",
                        }}
                      >
                        {day}
                      </span>

                      {/* Sessions */}
                      {daySessions.map((s, j) => (
                        <div
                          key={j}
                          className="mt-1 px-2 py-1 rounded text-[10px] truncate"
                          style={{
                            background: "var(--primary-light)",
                            color: "var(--primary)",
                          }}
                        >
                          {formatTime12h(s.time)} –{" "}
                          {s?.clientInfo?.name?.split(" ")[0]}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Sessions */}
        <motion.div
          className="card-glass"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3
            className="mb-4 font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Upcoming Sessions
          </h3>

          <div className="space-y-3">
            {upcomingSessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {s?.clientInfo?.name}
                  </span>

                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {s.type}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className="font-mono text-xs"
                    style={{ color: "var(--primary)" }}
                  >
                    {formatTime12h(s.time)}
                  </span>

                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(s.year, s.month - 1).toLocaleString("default", {
                      month: "long",
                    })}{" "}
                    {s.day}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="w-full max-w-lg p-8 border shadow-2xl bg-(--bg-primary) rounded-3xl border-white/50 backdrop-saturate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2">
                    <Calendar size={24} className="text-(--primary)" />
                  </div>
                  <h2 className="text-xl font-bold text-(--text-primary)">
                    Create Session
                  </h2>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 transition-colors rounded-full hover:bg-gray-100"
                  aria-label="Close modal"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(handleAddSession)}
                className="grid grid-cols-1 gap-6 md:grid-cols-2"
              >
                <div>
                  <label className="block mb-2 text-sm font-medium">Day</label>
                  <select
                    {...register("day")}
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  >
                    {[...Array(31)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Month
                  </label>
                  <select
                    {...register("month")}
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Year</label>
                  <select
                    {...register("year")}
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  >
                    {[...Array(11)].map((_, i) => (
                      <option key={i} value={i + new Date().getFullYear()}>
                        {i + new Date().getFullYear()}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Time</label>
                  <input
                    type="time"
                    {...register("time")}
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Client
                  </label>
                  <select
                    {...register("clientEmail")}
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  >
                    {trainees.map((t, i) => (
                      <option key={i} value={t.userEmail}>
                        {t.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Type</label>
                  <input
                    {...register("type")}
                    type="text"
                    className="w-full border p-3 rounded-lg bg-[var(--bg-primary)] focus:ring-2 focus:ring-[var(--primary)] outline-none"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="bg-[var(--primary)] text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    Add Session
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}