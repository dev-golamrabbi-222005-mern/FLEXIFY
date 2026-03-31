"use client";

import React from "react";
import {
  UserCheck,
  AlertTriangle,
  Activity,
  XCircle,
  CheckCircle,
  Loader2,
  Users,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Coach, AnalyticsData, UpdateStatusParams } from "@/types/coach";
import { toast } from "react-toastify";

// Improved type definition
type CoachApplication = Coach & {
  specialties?: string;
  experienceYears?: number;
};

export default function CombinedCoachManagement() {
  const queryClient = useQueryClient();

  const { data: analytics, isLoading: isStatsLoading } =
    useQuery<AnalyticsData>({
      queryKey: ["coach-analytics"],
      queryFn: async () =>
        (await axios.get<AnalyticsData>("/api/admin/coach-stats")).data,
    });

  const { data: approvedCoaches = [], isLoading: isCoachesLoading } = useQuery<
    Coach[]
  >({
    queryKey: ["admin-coaches-approved"],
    queryFn: async () =>
      (await axios.get<Coach[]>("/api/admin/coaches?status=approved")).data,
  });

  const { data: pendingApplications = [], isLoading: isPendingLoading } =
    useQuery<CoachApplication[]>({
      queryKey: ["admin-coach-apps-pending"],
      queryFn: async () =>
        (
          await axios.get<CoachApplication[]>(
            "/api/admin/coaches?status=pending",
          )
        ).data,
    });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: UpdateStatusParams) =>
      await axios.patch("/api/admin/coaches", { id, status }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-coaches-approved"] });
      queryClient.invalidateQueries({ queryKey: ["admin-coach-apps-pending"] });
      queryClient.invalidateQueries({ queryKey: ["coach-analytics"] });
      toast.success(`Status updated to ${variables.status}`);
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Action failed");
    },
  });

  if (isStatsLoading || isCoachesLoading || isPendingLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--bg-primary)]">
        <Loader2 className="text-blue-500 animate-spin" size={40} />
      </div>
    );
  }

  const stats = [
    {
      title: "Pending Requests",
      value: pendingApplications.length,
      icon: Users,
      color: "from-orange-400 to-rose-500",
    },
    {
      title: "Active Coaches",
      value: analytics?.stats?.approvedCount || 0,
      icon: UserCheck,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "System Alerts",
      value: analytics?.stats?.warningCount || 0,
      icon: AlertTriangle,
      color: "from-red-500 to-orange-500",
    },
  ];

  return (
    <div className="space-y-10 min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] p-6">
      <title>Coach Management | Flexify Admin</title>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={`stat-card-${i}`}
            className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)] shadow-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-lg shadow-black/10`}
              >
                <stat.icon size={24} />
              </div>
              <h4 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                {stat.title}
              </h4>
            </div>
            <p className="text-3xl font-black">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="mb-6 text-lg font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <Activity size={18} className="text-blue-500" /> Monthly Performance
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.performanceData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border-color)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  fontSize={11}
                  stroke="var(--text-secondary)"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  fontSize={11}
                  stroke="var(--text-secondary)"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card-bg)",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="sessions"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] p-6 rounded-2xl border border-[var(--border-color)]">
          <h3 className="mb-6 text-lg font-bold flex items-center gap-2 text-[var(--text-primary)]">
            <UserCheck size={18} className="text-emerald-500" /> Engagement
            Growth
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.performanceData || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="var(--border-color)"
                  opacity={0.3}
                />
                <XAxis
                  dataKey="month"
                  fontSize={11}
                  stroke="var(--text-secondary)"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  fontSize={11}
                  stroke="var(--text-secondary)"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  cursor={{ fill: "var(--bg-tertiary)", opacity: 0.4 }}
                  contentStyle={{
                    background: "var(--card-bg)",
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                  }}
                />
                <Bar
                  dataKey="clients"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                  barSize={35}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Pending Applications */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-orange-500" size={20} /> Pending Applications
          </h2>
          <span className="px-3 py-1 bg-orange-500/10 text-orange-500 text-xs font-bold rounded-full">
            {pendingApplications.length} New
          </span>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[var(--bg-secondary)] text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Applicant</th>
                  <th className="px-6 py-4">Specialty</th>
                  <th className="px-6 py-4">Experience</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {pendingApplications.length > 0 ? (
                  pendingApplications.map((app) => (
                    <tr
                      key={app._id.toString || app.email}   // Safe key
                      className="hover:bg-[var(--bg-tertiary)] transition-colors text-sm"
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold">{app.fullName}</div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          {app.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[var(--text-secondary)]">
                        {app.specialties || "General Fitness"}
                      </td>
                      <td className="px-6 py-4 font-medium">
                        {app.experienceYears || 0} Yrs
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: app._id!,
                                status: "approved",
                              })
                            }
                            className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition"
                          >
                            <CheckCircle size={20} />
                          </button>
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({
                                id: app._id!,
                                status: "rejected",
                              })
                            }
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          >
                            <XCircle size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-[var(--text-secondary)]"
                    >
                      No new applications at the moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Approved Coaches */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserCheck className="text-green-500" size={20} /> Manage Approved
            Coaches
          </h2>
          <span className="px-3 py-1 bg-green-500/10 text-green-500 text-xs font-bold rounded-full">
            Total: {approvedCoaches.length}
          </span>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--bg-secondary)] text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Coach</th>
                  <th className="px-6 py-4">Capacity</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Modify</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {approvedCoaches.map((coach) => (
                  <tr
                    key={coach._id}   // _id usually always present here
                    className="hover:bg-[var(--bg-tertiary)] transition-colors text-sm"
                  >
                    <td className="px-6 py-4 font-bold">{coach.fullName}</td>
                    <td className="px-6 py-4 text-[var(--text-secondary)]">
                      {coach.maxClients} Clients
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-tighter ${
                          coach.status === "warning"
                            ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                            : "bg-green-500/10 text-green-500 border border-green-500/20"
                        }`}
                      >
                        {coach.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: coach._id!,
                              status: "warning",
                            })
                          }
                          className="p-2 text-orange-500 transition hover:bg-orange-500/10 rounded-xl"
                        >
                          <AlertTriangle size={18} />
                        </button>
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: coach._id!,
                              status: "rejected",
                            })
                          }
                          className="p-2 text-red-500 transition hover:bg-red-500/10 rounded-xl"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* System Alerts */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> System Alerts
          </h2>
          <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold rounded-full">
            {
              approvedCoaches.filter(
                (coach) =>
                  coach.status === "warning" || coach.status === "rejected",
              ).length
            }{" "}
            Issues
          </span>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[var(--bg-secondary)] text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest">
                <tr>
                  <th className="px-6 py-4">Coach</th>
                  <th className="px-6 py-4">Issue</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {approvedCoaches.filter(
                  (coach) =>
                    coach.status === "warning" || coach.status === "rejected",
                ).length > 0 ? (
                  approvedCoaches
                    .filter(
                      (coach) =>
                        coach.status === "warning" ||
                        coach.status === "rejected",
                    )
                    .map((coach) => (
                      <tr
                        key={coach._id}   // Fixed key
                        className="hover:bg-[var(--bg-tertiary)] transition-colors text-sm"
                      >
                        <td className="px-6 py-4">
                          <div className="font-bold">{coach.fullName}</div>
                          <div className="text-xs text-[var(--text-secondary)]">
                            {coach.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-[var(--text-secondary)]">
                          {coach.status === "warning"
                            ? "Performance Warning"
                            : "Rejected / Disabled"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded text-[10px] font-black uppercase ${
                              coach.status === "warning"
                                ? "bg-orange-500/10 text-orange-500"
                                : "bg-red-500/10 text-red-500"
                            }`}
                          >
                            {coach.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() =>
                                updateStatusMutation.mutate({
                                  id: coach._id!,
                                  status: "approved",
                                })
                              }
                              className="p-2 text-green-500 hover:bg-green-500/10 rounded-xl"
                            >
                              <CheckCircle size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="p-10 text-center text-[var(--text-secondary)]"
                    >
                      No alerts at the moment.
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