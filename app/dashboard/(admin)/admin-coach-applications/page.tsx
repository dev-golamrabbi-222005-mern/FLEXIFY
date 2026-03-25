"use client";

import { CheckCircle, XCircle, UserCheck, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

interface CoachApplication {
  _id: string;
  fullName: string;
  email: string;
  specialties: string;
  experienceYears: number;
  status: "pending" | "approved" | "rejected";
}

export default function AdminCoachApplications() {
  const queryClient = useQueryClient();

  const { data: applications = [], isLoading } = useQuery<CoachApplication[]>({
    queryKey: ["admin-coach-apps"],
    queryFn: async () => {
      const res = await axios.get("/api/admin/coaches?status=pending");
      return res.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await axios.patch("/api/admin/coaches", { id, status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-coach-apps"] });
      Swal.fire(
        variables.status === "approved" ? "Approved!" : "Rejected!",
        `Coach request has been ${variables.status}.`,
        "success"
      );
    },
    onError: () => {
      Swal.fire("Error", "Action failed", "error");
    },
  });

  const pendingCount = applications.filter(a => a.status === "pending").length || 0;
  const approvedCount = 0; 
  const rejectedCount = 0;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      {/* HEADER */}
      <header>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck /> Coach Applications
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">Review and approve new coach requests</p>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pending Card */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border-color)] p-5 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Pending Apps</p>
            <h2 className="text-3xl font-black mt-1">{pendingCount}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 text-white shadow-lg">
            <UserCheck size={22} />
          </div>
        </div>

        {/* Approved Card */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border-color)] p-5 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Approved</p>
            <h2 className="text-3xl font-black mt-1">{approvedCount}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 text-white shadow-lg">
            <CheckCircle size={22} />
          </div>
        </div>

        {/* Rejected Card */}
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-sm border border-[var(--border-color)] p-5 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider">Rejected</p>
            <h2 className="text-3xl font-black mt-1">{rejectedCount}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-400 to-pink-500 text-white shadow-lg">
            <XCircle size={22} />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card-glass overflow-hidden rounded-xl border border-[var(--border-color)]">
        <div className="grid grid-cols-5 gap-6 px-6 py-4 text-xs font-bold bg-[var(--bg-secondary)] border-b border-[var(--border-color)] uppercase tracking-widest text-[var(--text-secondary)]">
          <div>Applicant</div>
          <div>Specialty</div>
          <div>Experience</div>
          <div>Status</div>
          <div className="text-right">Action</div>
        </div>

        <div className="divide-y divide-[var(--border-color)]">
          {applications.length > 0 ? (
            applications.map((app) => (
              <div key={app._id} className="grid grid-cols-5 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition">
                <div>
                  <div className="font-bold">{app.fullName}</div>
                  <div className="text-xs text-[var(--text-secondary)] truncate">{app.email}</div>
                </div>
                <div className="text-[var(--text-secondary)]">{app.specialties}</div>
                <div>{app.experienceYears} yrs</div>
                <div>
                  <span className="px-2 py-1 rounded-full text-[10px] font-bold bg-yellow-500/10 text-yellow-500 uppercase">
                    {app.status}
                  </span>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => statusMutation.mutate({ id: app._id, status: "approved" })}
                    disabled={statusMutation.isPending}
                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition disabled:opacity-50"
                    title="Approve"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={() => statusMutation.mutate({ id: app._id, status: "rejected" })}
                    disabled={statusMutation.isPending}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition disabled:opacity-50"
                    title="Reject"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-10 text-center text-[var(--text-secondary)] font-medium">No pending requests found</div>
          )}
        </div>
      </div>
    </div>
  );
}