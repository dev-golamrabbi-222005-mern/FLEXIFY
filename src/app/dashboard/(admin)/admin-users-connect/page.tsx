"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Clock, CheckCircle2, Loader2 } from "lucide-react";
import ContactMessageCard, { ContactMessageItem } from "@/components/dashboard/admin/ContactMessageCard";

export default function ContactRequests() {
  const queryClient = useQueryClient();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery<ContactMessageItem[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get("/api/contact");
      return res.data;
    },
  });

  const stats = useMemo(() => {
    const total = data?.length || 0;
    const pending = data?.filter((m) => m.status !== "replied").length || 0;
    const replied = total - pending;
    return { total, pending, replied };
  }, [data]);

  const markAsReplied = useMutation({
    mutationFn: async (id: string) => {
      await axios.patch(`/api/contact/${id}`, { status: "replied" });
    },
    onMutate: (id: string) => setLoadingIds((prev) => [...prev, id]),
    onSuccess: (_, id) => {
      queryClient.setQueryData<ContactMessageItem[]>(["contacts"], (old) =>
        old?.map((msg) =>
          msg._id === id ? { ...msg, status: "replied" as const, repliedAt: new Date().toISOString() } : msg
        )
      );
    },
    onSettled: (_, __, id) => setLoadingIds((prev) => prev.filter((item) => item !== id)),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-muted)] font-medium tracking-tight">Syncing with Flexify DB...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 p-1">
      <title>User Connect | Admin - Flexify</title>
      <div className="flex flex-col md:flex-row md:items-center lg:items-start justify-between gap-6">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
            User <span className="text-[var(--primary)]">Connect</span>
          </h1>
          <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
            Manage feedback and support inquiries.
          </p>
        </div>

        <div className="flex gap-4 md:flex-col lg:flex-row">
          <StatMiniCard label="Pending" value={stats.pending} color="var(--warning)" icon={<Clock size={22} />} />
          <StatMiniCard label="Replied" value={stats.replied} color="var(--primary)" icon={<CheckCircle2 size={22} />} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {data && data.length > 0 ? (
          data.map((item) => (
            <ContactMessageCard
              key={item._id}
              item={item}
              isUpdating={loadingIds.includes(item._id)}
              onMarkAsReplied={(id) => markAsReplied.mutate(id)}
            />
          ))
        ) : (
          <div className="col-span-full py-16 text-center text-[var(--text-muted)]">No messages yet.</div>
        )}
      </div>
    </div>
  );
}

function StatMiniCard({ label, value, color, icon }: { label: string; value: number; color: string; icon: React.ReactNode }) {
  return (
    <div className="card-glass p-4 flex items-center gap-4 min-w-[140px]">
      <div className="p-2.5 rounded-xl bg-[var(--bg-secondary)]" style={{ color }}>{icon}</div>
      <div>
        <p className="text-2xl font-black">{value}</p>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">{label}</p>
      </div>
    </div>
  );
}
