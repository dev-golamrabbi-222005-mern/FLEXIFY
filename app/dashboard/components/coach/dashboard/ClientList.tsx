"use client";

import { fadeUp, SectionHeader } from "@/app/dashboard/page";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

// 1. Define the Client interface
interface Client {
  name: string;
  plan: string;
  image: string;
  nextSession: string;
  status: "excellent" | "on-track" | "needs-attention";
}

// 2. Explicitly type the statusStyle object
const statusStyle: Record<
  Client["status"],
  { bg: string; color: string; label: string }
> = {
  excellent: { bg: "#dcfce7", color: "#16a34a", label: "Excellent" },
  "on-track": { bg: "#dbeeff", color: "#2563eb", label: "On Track" },
  "needs-attention": {
    bg: "#fee2e2",
    color: "#dc2626",
    label: "Needs Attention",
  },
};

const ClientList = () => {
  const { data: session } = useSession();
  // 3. Add <Client[]> to useQuery
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res.data;
    },
  });

  return (
    <motion.div
      {...fadeUp(0.3)}
      className="p-5 rounded-2xl"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-color)",
      }}
    >
      <SectionHeader title="Your Clients" action="View All" />
      <div className="space-y-2">
        {clients?.map((c: Client, i: number) => {
          // 4. Safe lookup using the defined status
          const s = statusStyle[c.status];

          return (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b last:border-0"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <img src={c?.image} alt={c?.name}
                  className="flex items-center justify-center text-sm font-black text-white bg-center bg-cover rounded-full w-9 h-9"
                />
                <div>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {c?.name}
                  </p>
                  <p
                    className="text-[11px]"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {c?.plan} · {c?.nextSession}
                  </p>
                </div>
              </div>
              <span
                className="text-[10px] font-black px-2.5 py-1 rounded-full"
                style={{
                  background: s?.bg || "var(--bg-secondary)",
                  color: s?.color || "var(--text-muted)",
                }}
              >
                {s?.label || "Unknown"}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ClientList;
