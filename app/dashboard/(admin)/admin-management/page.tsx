"use client";

import { Users, CreditCard, UserCheck, Loader2, Search, Filter as FilterIcon, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import { Coach } from "@/types/coach";

interface Plan {
  _id: string;
  name: string;
  price: number;
}

interface AdminUser {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  role: string;
  plan?: string;
  status: "Active" | "Suspended";
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  color: string;
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("");

  const { data: users = [], isLoading: usersLoading, isFetching: usersFetching } = useQuery<AdminUser[]>({
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
    <div className="space-y-8 min-h-screen max-w-full text-[var(--text-primary)]">
      <title>Management | Dashboard - Flexify</title>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Platform management</p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Users" value={users.length} icon={Users} color="from-blue-500 to-indigo-600" />
        <StatCard title="Pending Coaches" value={coaches.length} icon={UserCheck} color="from-orange-400 to-rose-500" />
        <StatCard title="Active Plans" value={plans.length} icon={CreditCard} color="from-emerald-400 to-teal-600" />
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

        {/* Scrollable Wrapper */}
        <div className="card-glass rounded-xl border border-[var(--border-color)] relative overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]"> 
              <div className="grid grid-cols-5 px-6 py-3 text-xs font-bold bg-[var(--bg-secondary)] border-b border-[var(--border-color)] uppercase text-[var(--text-secondary)]">
                <div>Name</div>
                <div>Email</div>
                <div>Role</div>
                <div>Status</div>
                <div className="text-right">Action</div>
              </div>

              <div className={`divide-y divide-[var(--border-color)] transition-opacity duration-200 ${usersFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                {users.length > 0 ? (
                  users.map((user) => (
                    <div key={user._id} className="grid grid-cols-5 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition">
                      <div className="pr-2 font-medium truncate">{user.name || user.fullName}</div>
                      <div className="truncate text-[var(--text-secondary)]">{user.email}</div>
                      <div className="capitalize font-semibold text-[10px]">
                        <span className="bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-md">{user.role}</span>
                      </div>
                      <div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.status === "Suspended" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>
                          {user.status || "Active"}
                        </span>
                      </div>
                      <div className="text-right">
                        <button
                          disabled={userStatusMutation.isPending}
                          onClick={() => userStatusMutation.mutate({ id: user._id, status: user.status === "Suspended" ? "Active" : "Suspended" })}
                          className={`px-3 py-1 text-xs rounded-lg font-medium transition ${user.status === "Suspended" ? "text-green-500 hover:bg-green-500/10" : "text-red-500 hover:bg-red-500/10"}`}
                        >
                          {user.status === "Suspended" ? "Unban" : "Ban"}
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-10 text-center text-[var(--text-secondary)]">No users found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 flex items-center justify-between border border-[var(--border-color)] shadow-sm hover:shadow-md transition">
      <div>
        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
        <h3 className="mt-1 text-3xl font-black">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
        <Icon size={22} />
      </div>
    </div>
  );
}