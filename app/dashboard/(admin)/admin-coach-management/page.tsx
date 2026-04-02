"use client";

import { UserCheck, AlertTriangle, XCircle, CheckCircle, Loader2, Users, Search, ArrowUpDown, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Coach, AnalyticsData, UpdateStatusParams } from "@/types/coach";

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
    onError: () => toast.error("Action failed")
  });

  const filteredCoaches = useMemo(() => {
    const result = coaches.filter(c => 
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
    <div className="space-y-6 text-[var(--text-primary)]">
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
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
              size={16}
            />
            <input
              type="text"
              placeholder="Search by name/email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64 text-sm transition-all"
            />
          </div>
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="flex items-center gap-2 px-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl text-sm font-medium hover:bg-[var(--bg-tertiary)] transition"
          >
            <ArrowUpDown size={14} />
            Exp: {sortOrder === "asc" ? "Low-High" : "High-Low"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Pending Apps"
          value={analytics?.stats?.pendingCount || 0}
          icon={Users}
          color="from-orange-400 to-amber-500"
        />
        <StatCard
          title="Active Coaches"
          value={analytics?.stats?.approvedCount || 0}
          icon={UserCheck}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Total Warnings"
          value={analytics?.stats?.warningCount || 0}
          icon={AlertTriangle}
          color="from-red-500 to-pink-500"
        />
      </div>

      <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="flex border-b border-[var(--border-color)] bg-[var(--bg-secondary)]/30">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 md:flex-none px-8 py-4 text-sm font-bold transition-all ${activeTab === "pending" ? "border-b-2 border-blue-500 text-blue-500 bg-[var(--bg-secondary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"}`}
          >
            Applications
          </button>
          <button
            onClick={() => setActiveTab("active")}
            className={`flex-1 md:flex-none px-8 py-4 text-sm font-bold transition-all ${activeTab === "active" ? "border-b-2 border-blue-500 text-blue-500 bg-[var(--bg-secondary)]" : "text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)]"}`}
          >
            Active Coaches
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-secondary)] text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Coach Profile</th>
                  <th className="px-6 py-4">Specialty</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {filteredCoaches.length > 0 ? (
                  filteredCoaches.map((coach) => (
                    <tr
                      key={coach._id.toString()}
                      className="hover:bg-[var(--bg-tertiary)] transition-colors text-sm"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold">{coach.fullName}</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {coach.email}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-[var(--text-primary)] font-medium bg-[var(--bg-secondary)] px-2 py-1 rounded-md text-xs">
                          {coach.specialties || "General"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-blue-500">
                        {coach.experienceYears || 0} Years
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-[10px] font-black uppercase ${
                            coach.status === "pending"
                              ? "bg-amber-500/10 text-amber-500"
                              : coach.status === "warning"
                                ? "bg-red-500/10 text-red-500"
                                : "bg-green-500/10 text-green-500"
                          }`}
                        >
                          {coach.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {activeTab === "pending" ? (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: coach._id.toString(),
                                    status: "approved",
                                  })
                                }
                                className="p-2 text-green-500 bg-green-500/10 rounded-xl hover:bg-green-500/20 transition"
                                disabled={updateStatus.isPending}
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: coach._id.toString(),
                                    status: "rejected",
                                  })
                                }
                                className="p-2 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition"
                                disabled={updateStatus.isPending}
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: coach._id.toString(),
                                    status: "warning",
                                  })
                                }
                                className="p-2 text-amber-500 bg-amber-500/10 rounded-xl hover:bg-amber-500/20 transition"
                                title="Warning"
                                disabled={updateStatus.isPending}
                              >
                                <AlertTriangle size={18} />
                              </button>
                              <button
                                onClick={() =>
                                  updateStatus.mutate({
                                    id: coach._id.toString(),
                                    status: "suspended",
                                  })
                                }
                                className="p-2 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition"
                                title="Suspend"
                                disabled={updateStatus.isPending}
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="p-16 text-center text-[var(--text-secondary)] font-medium"
                    >
                      No records found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon; 
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-[var(--card-bg)] p-5 rounded-2xl border border-[var(--border-color)] flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
      <div>
        <h4 className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{title}</h4>
        <p className="mt-1 text-2xl font-black">{value}</p>
      </div>
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
        <Icon size={20} />
      </div>
    </div>
  );
}