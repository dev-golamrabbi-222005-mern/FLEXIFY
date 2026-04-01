"use client";

import { fadeUp, SectionHeader } from "@/app/dashboard/page";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
interface Client {
  day: number;
  month: number;
  year: number;
  time: string;
  clientEmail: string;
  clientInfo?: {
    name: string;
    imageUrl: string;
    phone: string;
    plan: string;
  };
}

const ClientList = () => {
  const { data: session } = useSession();
  const { data: upcomingSessions = [] } = useQuery<Client[]>({
    queryKey: ["upcomingSessions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/sessions/upcoming?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  const formatTime12h = (time24: string) => {
    const [hourStr, minute] = time24.split(":");
    if (hourStr === undefined || minute === undefined) return time24;
    let hour = Number(hourStr);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour.toString().padStart(2, "0")}:${minute} ${ampm}`;
  };

  return (
    <motion.div
      {...fadeUp(0.3)}
      className="p-5 rounded-2xl"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <SectionHeader title="Upcoming Sessions" action="View All" link="/dashboard/coach-schedule" />
      <div className="space-y-2">
        {upcomingSessions?.map((c: Client, i: number) => {

          return (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <img src={c?.clientInfo?.imageUrl} alt={c?.clientInfo?.name}
                  className="flex items-center justify-center text-sm font-black text-white bg-center bg-cover rounded-full w-9 h-9"
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c?.clientInfo?.name}
                  </p>
                  <p
                    className="text-[11px] capitalize"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {c?.clientInfo?.plan} · Next at {c?.day}/{c?.month}/{c?.year} {formatTime12h(c?.time)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ClientList;
