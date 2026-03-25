"use client";

import { UserCheck, AlertTriangle, Activity, XCircle, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, LineChart, Line, CartesianGrid } from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import Swal from "sweetalert2";
import { Coach, AnalyticsData, UpdateStatusParams } from "@/types/coach";

export default function CoachManagementPage() {
  const queryClient = useQueryClient();

  const { data: analytics, isLoading: isStatsLoading } = useQuery<AnalyticsData>({
    queryKey: ["coach-analytics"],
    queryFn: async () => (await axios.get<AnalyticsData>("/api/admin/coach-stats")).data,
  });

  const { data: coaches = [], isLoading: isCoachesLoading } = useQuery<Coach[]>({
    queryKey: ["admin-coaches"],
    queryFn: async () => (await axios.get<Coach[]>("/api/admin/coaches?status=approved")).data,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: UpdateStatusParams) => 
      await axios.patch("/api/admin/coaches", { id, status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-coaches"] });
      queryClient.invalidateQueries({ queryKey: ["coach-analytics"] });
      Swal.fire({ title: "Success", text: "Status Updated", icon: "success", timer: 1500, showConfirmButton: false });
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      Swal.fire({ title: "Error", text: error.response?.data?.message || "Failed", icon: "error" });
    }
  });

  if (isStatsLoading || isCoachesLoading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  const stats = [
    { title: "Approved Coaches", value: analytics?.stats?.approvedCount || 0, icon: UserCheck, color: "from-green-500 to-emerald-500" },
    { title: "System Status", value: "Active", icon: Activity, color: "from-blue-500 to-indigo-500" },
    { title: "Warnings Issued", value: analytics?.stats?.warningCount || 0, icon: AlertTriangle, color: "from-red-500 to-orange-500" },
  ];

  return (
    <div className=" gap-2 space-y-4 bg-[var(--bg-primary)] text-[var(--text-primary)]">
       <title>Coach-Management | Dashboard - Flexify</title>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white mb-4`}>
              <stat.icon size={24} />
            </div>
            <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.title}</h4>
            <p className="text-3xl font-black mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="mb-6 font-bold text-lg">Monthly Performance</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="month" fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }} />
                <Line type="monotone" dataKey="sessions" stroke="#3b82f6" strokeWidth={3} dot={{ fill: "#3b82f6", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="mb-6 font-bold text-lg">Engagement Growth</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" opacity={0.5} />
                <XAxis dataKey="month" fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                <YAxis fontSize={12} stroke="var(--text-secondary)" axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'var(--bg-tertiary)', opacity: 0.4}} contentStyle={{ background: "var(--card-bg)", borderRadius: "12px", border: "1px solid var(--border-color)" }} />
                <Bar dataKey="clients" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <section className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[var(--border-color)] flex justify-between items-center">
          <h2 className="text-xl font-bold">Approved Coaches</h2>
          <span className="text-xs text-[var(--text-secondary)] font-bold bg-[var(--bg-secondary)] px-3 py-1 rounded-full uppercase">Total: {coaches.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[var(--bg-secondary)] text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">
              <tr>
                <th className="px-6 py-4">Coach</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-color)]">
              {coaches.map((coach) => (
                <tr key={coach._id.toString()} className="hover:bg-[var(--bg-tertiary)] transition-colors text-sm">
                  <td className="px-6 py-4 font-bold">{coach.fullName}</td>
                  <td className="px-6 py-4 text-[var(--text-secondary)]">{coach.maxClients} Clients</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${coach.status === 'warning' ? 'bg-orange-500/10 text-orange-500' : 'bg-green-500/10 text-green-500'}`}>
                      {coach.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => updateStatus.mutate({ id: coach._id, status: "warning" })} className="p-2 text-orange-500 hover:bg-orange-500/10 rounded-xl transition" disabled={updateStatus.isPending}><AlertTriangle size={18} /></button>
                      <button onClick={() => updateStatus.mutate({ id: coach._id, status: "rejected" })} className="p-2 text-red-500 hover:bg-red-500/10 rounded-xl transition" disabled={updateStatus.isPending}><XCircle size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}