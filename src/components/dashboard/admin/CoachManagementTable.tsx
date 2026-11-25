"use client";

import React from "react";
import { CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Coach } from "@/types/coach";

interface CoachManagementTableProps {
  coaches: Coach[];
  activeTab: "pending" | "active";
  onUpdateStatus: (id: string, status: "approved" | "warning" | "rejected" | "suspended") => void;
  isPending: boolean;
}

export default function CoachManagementTable({
  coaches,
  activeTab,
  onUpdateStatus,
  isPending,
}: CoachManagementTableProps) {
  return (
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
            {coaches.length > 0 ? (
              coaches.map((coach) => (
                <tr key={coach._id.toString()} className="hover:bg-[var(--bg-tertiary)] transition-colors text-sm">
                  <td className="px-6 py-4">
                    <div className="font-bold">{coach.fullName}</div>
                    <div className="text-xs text-[var(--text-secondary)]">{coach.email}</div>
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
                            onClick={() => onUpdateStatus(coach._id.toString(), "approved")}
                            className="p-2 text-green-500 bg-green-500/10 rounded-xl hover:bg-green-500/20 transition"
                            disabled={isPending}
                          >
                            <CheckCircle size={18} />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(coach._id.toString(), "rejected")}
                            className="p-2 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition"
                            disabled={isPending}
                          >
                            <XCircle size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onUpdateStatus(coach._id.toString(), "warning")}
                            className="p-2 text-amber-500 bg-amber-500/10 rounded-xl hover:bg-amber-500/20 transition"
                            title="Warning"
                            disabled={isPending}
                          >
                            <AlertTriangle size={18} />
                          </button>
                          <button
                            onClick={() => onUpdateStatus(coach._id.toString(), "suspended")}
                            className="p-2 text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition"
                            title="Suspend"
                            disabled={isPending}
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
                <td colSpan={5} className="p-16 text-center text-[var(--text-secondary)] font-medium">
                  No records found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
