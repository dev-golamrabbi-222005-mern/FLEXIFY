"use client";

import { UserCheck, AlertTriangle, Users, Search, ArrowUpDown, Loader2, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Coach, AnalyticsData, UpdateStatusParams } from "@/types/coach";
import CoachManagementTable from "@/components/dashboard/admin/CoachManagementTable";

export default function AdminCoachCenter() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "active">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { data: analytics, isLoading: isStatsLoading } = useQuery<AnalyticsData>({
    queryKey: ["coach-analytics"],
    queryFn: async () => (await axios.get<AnalyticsData>("/api/admin/coach-stats")).data,
  });

  const { data: coaches = [], isLoading: isCoachesLoading, isFetching } = useQuery<Coach[]>({
    queryKey: ["admin-coaches", activeTab],
    queryFn: async () => {
      const status = activeTab === "pending" ? "pending" : "approved";
      return (await axios.get<Coach[]>(`/api/admin/coaches?status=${status}`)).data;
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: UpdateStatusParams) =>
      await axios.patch("/api/admin/coaches", { id, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-coaches"] });
      queryClient.invalidateQueries({ queryKey: ["coach-analytics"] });
      toast.success(`Coach ${variables.status} successfully`);
    },
    onError: () => toast.error("Action failed"),
  });

  const filteredCoaches = useMemo(() => {
    const result = coaches.filter(
      (c) =>
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return result.sort((a, b) => {
      const expA = a.experienceYears || 0;
      const expB = b.experienceYears || 0;
      return sortOrder === "asc" ? expA - expB : expB - expA;
    });
  }, [coaches, searchTerm, sortOrder]);

  if (isStatsLoading || (isCoachesLoading && !isFetching)) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="text-blue-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 text-[var(--text-primary)]">
      <title>Coach Center | Admin - Flexify</title>
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
            Coach Management
          </h1>
          <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
            Review applications and manage active coaches
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
            <input
              type="text"
              placeholder="Search by name/email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64 text-sm transition-all"
            />
          </div>
          <button
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-medium hover:bg-[var(--bg-tertiary)] transition"
          >
            <ArrowUpDown size={14} /> Exp: {sortOrder === "asc" ? "Low-High" : "High-Low"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <CoachStatCard title="Pending Apps" value={analytics?.stats?.pendingCount || 0} icon={Users} color="from-orange-400 to-amber-500" />
        <CoachStatCard title="Active Coaches" value={analytics?.stats?.approvedCount || 0} icon={UserCheck} color="from-green-500 to-emerald-500" />
        <CoachStatCard title="Total Warnings" value={analytics?.stats?.warningCount || 0} icon={AlertTriangle} color="from-red-500 to-pink-500" />
      </div>

      <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 md:flex-none px-8 py-4 text-sm font-bold transition-all ${
              activeTab === "pending"
                ? "border-b-2 border-blue-500 text-blue-500 bg-[var(--bg-secondary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 md:flex-none px-8 py-4 text-sm font-bold transition-all ${
              activeTab === "active"
                ? "border-b-2 border-blue-500 text-blue-500 bg-[var(--bg-secondary)]"
                : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"
            }`}
          >
            Active Coaches
          </button>
        </div>

        <CoachManagementTable
          coaches={filteredCoaches}
          activeTab={activeTab}
          onUpdateStatus={(id, status) => updateStatus.mutate({ id, status })}
          isPending={updateStatus.isPending}
        />
      </section>
    </div>
  );
}

function CoachStatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: LucideIcon; color: string }) {
  return (
    <div className="relative overflow-hidden group bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between shadow-sm hover:shadow-md transition-all">
      <div className="relative z-10">
        <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{title}</h4>
        <p className="mt-1 text-2xl font-black">{value}</p>
      </div>
      <div className={`relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={20} />
      </div>
      <div className="absolute -bottom-3 -right-3 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 select-none opacity-[0.08] dark:opacity-[0.12] text-[var(--text-primary)]" aria-hidden="true">
        <Icon size={76} strokeWidth={1.5} />
      </div>
    </div>
  );
}
