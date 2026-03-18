"use client";

import { CheckCircle, XCircle, UserCheck } from "lucide-react";
import { useState } from "react";
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
  const [applications, setApplications] = useState<CoachApplication[]>([
    {
      _id: "1",
      fullName: "Rahim Uddin",
      email: "rahim@example.com",
      specialties: "Fitness, Yoga",
      experienceYears: 5,
      status: "pending",
    },
    {
      _id: "2",
      fullName: "Karim Hossain",
      email: "karim@example.com",
      specialties: "Strength Training",
      experienceYears: 3,
      status: "approved",
    },
    {
      _id: "3",
      fullName: "Jony Alam",
      email: "jony@example.com",
      specialties: "Cardio, HIIT",
      experienceYears: 4,
      status: "rejected",
    },
  ]);

  const handleStatusChange = (id: string, newStatus: "approved" | "rejected") => {
    setApplications(
      applications.map((app) =>
        app._id === id ? { ...app, status: newStatus } : app
      )
    );

    Swal.fire(
      newStatus === "approved" ? "Approved!" : "Rejected!",
      `Coach has been ${newStatus}.`,
      "success"
    );
  };

  const pendingCount = applications.filter(a => a.status === "pending").length;
  const approvedCount = applications.filter(a => a.status === "approved").length;
  const rejectedCount = applications.filter(a => a.status === "rejected").length;

  return (
    <div className="p-6 space-y-8 min-h-screen bg-[var(--bg-primary)]">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <UserCheck /> Coach Applications
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Review and approve new coach requests
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Pending Applications</p>
            <h2 className="text-2xl font-bold">{pendingCount}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Approved</p>
            <h2 className="text-2xl font-bold">{approvedCount}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Rejected</p>
            <h2 className="text-2xl font-bold">{rejectedCount}</h2>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white">
            <XCircle size={22} />
          </div>
        </div>

      </div>

      {/* TABLE */}
      <div className="card-glass overflow-hidden">

        <div className="grid grid-cols-6 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
          <div>Name</div>
          <div>Email</div>
          <div>Specialty</div>
          <div>Experience</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-[var(--border-color)]">

          {applications.map((app) => (
            <div
              key={app._id}
              className="grid grid-cols-6 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition"
            >
              <div className="font-medium">{app.fullName}</div>
              <div>{app.email}</div>
              <div>{app.specialties}</div>
              <div>{app.experienceYears} yrs</div>

              <div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    app.status === "approved"
                      ? "bg-green-500/20 text-green-500"
                      : app.status === "rejected"
                      ? "bg-red-500/20 text-red-500"
                      : "bg-yellow-500/20 text-yellow-500"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="flex justify-end gap-2">

                {app.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleStatusChange(app._id, "approved")}
                      className="px-3 py-1 text-xs rounded-md bg-green-500/20 text-green-500 hover:bg-green-500/30 flex items-center gap-1"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>

                    <button
                      onClick={() => handleStatusChange(app._id, "rejected")}
                      className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30 flex items-center gap-1"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}