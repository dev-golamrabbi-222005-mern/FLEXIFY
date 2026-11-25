"use client";

import React from "react";
import { UserCheck, ShieldAlert } from "lucide-react";

export interface AdminUserItem {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  role: string;
  plan?: string;
  status: "Active" | "Suspended";
}

interface UserManagementTableProps {
  users: AdminUserItem[];
  onToggleStatus: (id: string, currentStatus: string) => void;
  isPending: boolean;
}

export default function UserManagementTable({
  users,
  onToggleStatus,
  isPending,
}: UserManagementTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border-color)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--bg-secondary)] text-[10px] uppercase font-bold text-[var(--text-secondary)] tracking-widest border-b border-[var(--border-color)]">
          <tr>
            <th className="px-6 py-4">User</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Plan</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--border-color)] bg-[var(--card-bg)]">
          {users.map((u) => {
            const userName = u.name || u.fullName || "User";
            const isSuspended = u.status === "Suspended";

            return (
              <tr key={u._id} className="hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-[var(--text-primary)]">{userName}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{u.email}</div>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize text-xs font-semibold px-2 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text-primary)] border border-[var(--border-color)]">
                    {u.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="capitalize text-xs font-bold text-[var(--primary)]">{u.plan || "Free"}</span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${
                      isSuspended ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"
                    }`}
                  >
                    {u.status || "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onToggleStatus(u._id, u.status || "Active")}
                    disabled={isPending}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
                      isSuspended
                        ? "border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
                        : "border-red-500/40 text-red-500 hover:bg-red-500/10"
                    }`}
                  >
                    {isSuspended ? "Activate" : "Suspend"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
