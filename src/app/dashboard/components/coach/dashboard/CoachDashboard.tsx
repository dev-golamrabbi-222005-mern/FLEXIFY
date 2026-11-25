"use client";

import { fadeUp, greeting } from "@/app/dashboard/components/dashboard-shared";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import React from "react";
import ClientList from "./ClientList";
import CoachTodayBanner from "./CoachTodayBanner";
import CoachKpiGrid from "./CoachKpiGrid";

export default function CoachDashboard({ name }: { name: string }) {
  const { data: session } = useSession();

  const formatTime12h = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    if (hourStr === undefined || minute === undefined) return time24;
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  const { data: weeklyNewUsers } = useQuery({
    queryKey: ["weeklyNewUsers"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/new-users-weekly?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: todaySessions } = useQuery({
    queryKey: ["todaySessions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/sessions/today?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: monthlyEarning } = useQuery({
    queryKey: ["monthlyEarning"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/earnings?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const res = await axios.get("/api/coach/reviews");
      return res.data;
    },
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const { data: trainees = [] } = useQuery({
    queryKey: ["trainees"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const avgCompletionRate =
    trainees.length > 0
      ? Math.round(trainees.reduce((sum: number, t: any) => sum + (t.progress | 0), 0) / trainees.length)
      : 0;

  const nextSession = todaySessions?.[0]?.time ? formatTime12h(todaySessions[0].time) : undefined;
  const currentMonthEarnings = monthlyEarning?.[monthlyEarning.length - 1]?.total || 0;

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16">
      <motion.div {...fadeUp(0)}>
        <p className="leading-relaxed mb-2 text-[var(--text-secondary)]">{greeting()}, Coach</p>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          {name} 💪
        </h1>
      </motion.div>

      <CoachTodayBanner todaySessions={todaySessions} formatTime12h={formatTime12h} />

      <CoachKpiGrid
        totalClients={trainees?.length || 0}
        newUsersThisWeek={weeklyNewUsers?.newUsersThisWeek}
        sessionsToday={todaySessions?.length || 0}
        nextSessionTime={nextSession}
        avgRating={avgRating}
        reviewsCount={reviews?.length || 0}
        monthlyEarnings={currentMonthEarnings}
        avgCompletionRate={avgCompletionRate}
      />

      <ClientList />
    </div>
  );
}
