"use client";

import { Users, CreditCard, UserCheck, Loader2, Search, Filter as FilterIcon, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Coach } from "@/types/coach";
import UserManagementTable, { AdminUserItem } from "@/components/dashboard/admin/UserManagementTable";

interface Plan {
  _id: string;
  name: string;
  price: number;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: users = [], isLoading: usersLoading, isFetching: usersFetching } = useQuery<AdminUserItem[]>({
    queryKey: ["admin-users", searchTerm, selectedRole],
    queryFn: async () => {
      const res = await axios.get(`/api/admin/users?search=${searchTerm}&role=${selectedRole}`);
      return res.data;
    },
  });

  const { data: coaches = [], isLoading: coachesLoading } = useQuery<Coach[]>({
    queryKey: ["coaches-pending"],
    queryFn: async () => (await axios.get("/api/admin/coaches/status?status=pending")).data,
  });

  const { data: plans = [], isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["admin-plans"],
    queryFn: async () => (await axios.get("/api/admin/plans")).data,
  });

  const userStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) =>
      await axios.patch("/api/admin/users", { id, status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if ((usersLoading && !usersFetching) || coachesLoading || plansLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="text-blue-500 animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 min-h-screen max-w-full text-[var(--text-primary)]">
      <title>Management | Dashboard - Flexify</title>
      <header>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          User Management
        </h1>
        <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">Review the activity of users</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <UserStatCard title="Total Users" value={users.length} icon={Users} color="from-blue-500 to-indigo-600" />
        <UserStatCard title="Pending Coaches" value={coaches.length} icon={UserCheck} color="from-orange-400 to-rose-500" />
        <UserStatCard title="Active Plans" value={plans.length} icon={CreditCard} color="from-emerald-400 to-teal-600" />
      </div>

      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users size={18} />
            <h2 className="font-semibold">User Management</h2>
            {usersFetching && <Loader2 className="text-blue-500 animate-spin" size={16} />}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={16} />
              <input
                type="text"
                placeholder="Search name/email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50 w-full md:w-64 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-2 rounded-xl">
              <FilterIcon size={14} className="text-[var(--text-secondary)]" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="bg-transparent outline-none text-sm cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="coach">Coach</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <UserManagementTable
          users={users}
          onToggleStatus={(id, currentStatus) =>
            userStatusMutation.mutate({ id, status: currentStatus === "Active" ? "Suspended" : "Active" })
          }
          isPending={userStatusMutation.isPending}
        />
      </section>
    </div>
  );
}

function UserStatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: LucideIcon; color: string }) {
  return (
    <div className="card-glass relative overflow-hidden flex items-center justify-between p-6">
      <div className="relative z-10">
        <p className="text-xs text-[var(--text-muted)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-4xl font-black text-[var(--text-primary)]">{value}</h2>
      </div>
      <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon size={28} />
      </div>
    </div>
  );
}
