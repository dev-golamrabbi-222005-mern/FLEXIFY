"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  Mail,
  User,
  Clock,
  CheckCircle2,
  Inbox,
  MessageSquare,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  message: string;
  status: "pending" | "replied";
  createdAt: string;
  repliedAt?: string;
}

export default function ContactRequests() {
  const queryClient = useQueryClient();
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  const { data, isLoading } = useQuery<ContactMessage[]>({
    queryKey: ["contacts"],
    queryFn: async () => {
      const res = await axios.get("/api/contact");
      return res.data;
    },
  });

  // Calculate Stats for the top bar
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
    onMutate: (id: string) => {
      setLoadingIds((prev) => [...prev, id]);
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData<ContactMessage[]>(["contacts"], (old) =>
        old?.map((msg) =>
          msg._id === id
            ? {
                ...msg,
                status: "replied" as const,
                repliedAt: new Date().toISOString(),
              }
            : msg,
        ),
      );
    },
    onSettled: (_, __, id) => {
      setLoadingIds((prev) => prev.filter((item) => item !== id));
    },
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[var(--primary)]" />
        <p className="text-[var(--text-muted)] font-medium tracking-tight">
          Syncing with Flexify DB...
        </p>
      </div>
    );

  return (
    <div className="space-y-8 p-1">
      {/* Header & Stats Section */}
      <div className="flex flex-col md:flex-row md:items-center lg:items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-center md:text-start tracking-tighter text-[var(--text-primary)] mb-2 uppercase">
            User <span className="text-[var(--primary)]">Connect</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-center font-medium">
            Manage feedback and support inquiries.
          </p>
        </div>

        <div className="flex gap-4 md:flex-col lg:flex-row">
          <StatMiniCard
            label="Pending"
            value={stats.pending}
            color="var(--warning)"
            icon={<Clock size={22} />}
          />
          <StatMiniCard
            label="Replied"
            value={stats.replied}
            color="var(--primary)"
            icon={<CheckCircle2 size={22} />}
          />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {data && data.length > 0 ? (
          data.map((item) => {
            const isUpdating = loadingIds.includes(item._id);
            const isReplied = item.status === "replied";

            const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${item.email}&su=${encodeURIComponent(
              "Regarding your message",
            )}&body=${encodeURIComponent(
              `Hi ${item.name},\n\n\n\n\nThank you for reaching out.\n\nBest regards,\nAdmin`,
            )}`;

            return (
              <div
                key={item._id}
                className="card-glass group hover:border-[var(--primary)] transition-all duration-300 flex flex-col h-full"
              >
                <div className="flex-grow">
                  {/* Status & Date */}
                  <div className="flex items-center gap-2 text-[var(--text-muted)] text-xs font-bold uppercase tracking-widest">
                    <Clock size={14} />
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })
                      : "Recent" // Simple string fallback instead of a dynamic Date function
                    }
                  </div>

                  {/* User Info */}
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-[var(--primary)] border border-[var(--border-color)]">
                        <User size={16} />
                      </div>
                      <h3 className="text-xl font-bold text-[var(--text-primary)] leading-tight">
                        {item.name}
                      </h3>
                    </div>
                    <p className="text-sm text-[var(--primary)] font-semibold pl-10 opacity-90 truncate">
                      {item.email}
                    </p>
                  </div>

                  {/* Message Content */}
                  <div className="relative p-4 bg-[var(--bg-primary)] rounded-xl border border-[var(--border-color)] mb-6">
                    <MessageSquare
                      className="absolute -top-2 -left-2 text-[var(--border-color)]"
                      size={20}
                    />
                    <p className="text-[var(--text-secondary)] text-sm leading-relaxed italic">
                      "{item.message}"
                    </p>
                  </div>
                </div>

                {/* Actions Area */}
                <div className="mt-auto">
                  {!isReplied ? (
                    <div className="flex gap-3">
                      <button
                        onClick={() => markAsReplied.mutate(item._id)}
                        disabled={isUpdating}
                        className={`flex-[1.5] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                          isUpdating
                            ? "bg-[var(--bg-tertiary)] text-[var(--text-muted)] cursor-not-allowed"
                            : "bg-[var(--text-primary)] text-[var(--bg-primary)] hover:scale-[1.02] active:scale-95 shadow-lg"
                        }`}
                      >
                        {isUpdating ? (
                          <Loader2 className="animate-spin" size={18} />
                        ) : null}
                        {isUpdating ? "Updating..." : "Mark as Replied"}
                      </button>

                      <a
                        href={isUpdating ? undefined : gmailUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => isUpdating && e.preventDefault()}
                        className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all border-2 ${
                          isUpdating
                            ? "border-[var(--border-color)] text-[var(--text-muted)] cursor-not-allowed"
                            : "border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white"
                        }`}
                      >
                        <Mail size={18} />
                        Gmail
                      </a>
                    </div>
                  ) : (
                    item.repliedAt && (
                      <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--primary-dark)] bg-[var(--primary-light)] p-2.5 rounded-xl border border-[var(--primary)]/30">
                        <AlertCircle size={14} />
                        <span>
                          Replied on{" "}
                          {new Date(item.repliedAt).toLocaleString([], {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full py-24 card-glass flex flex-col items-center justify-center text-[var(--text-muted)]">
            <Inbox size={64} className="mb-4 opacity-10" />
            <p className="font-black uppercase tracking-[0.2em] text-lg">
              Inbox Clear
            </p>
            <p className="text-sm font-medium">No new messages to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: number;
  color: string;
  icon: React.ReactNode;
}

function StatMiniCard({ label, value, color, icon }: StatCardProps) {
  return (
    <div
      className="card-glass !p-3 flex items-center gap-4 min-w-[140px] border-b-4 transition-transform hover:translate-y-[-2px]"
      style={{ borderBottomColor: color }}
    >
      <div
        className="p-2.5 rounded-xl bg-[var(--bg-primary)] shadow-inner"
        style={{ color: color }}
      >
        {icon}
      </div>
      <div>
        <p className="text-xs font-black uppercase text-[var(--text-muted)] leading-none mb-1.5 tracking-wider">
          {label}
        </p>
        <p className="text-2xl font-black text-center leading-none text-[var(--text-primary)]">
          {value}
        </p>
      </div>
    </div>
  );
}
