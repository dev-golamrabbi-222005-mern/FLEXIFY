"use client";

import { Users, Loader2, LucideIcon, Search, ShieldAlert, ShieldCheck } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import axios from "axios";
import { Coach } from "@/types/coach";
import { toast } from "react-toastify";
import Image from "next/image";

interface Plan {
  _id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
}

interface AdminUser {
  _id: string;
  name?: string;
  fullName?: string;
  email: string;
  image?: string;
  plan?: string;
  status: "Active" | "Suspended";
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: users = [], isLoading: usersLoading } = useQuery<AdminUser[]>({
    queryKey: ["admin-users"],
    queryFn: async () => (await axios.get("/api/admin/users")).data,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      toast.success("User status updated successfully");
    },
  });

  // Search logic (name and email)
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchTerm = searchQuery.toLowerCase();
      const name = (user.name || user.fullName || "").toLowerCase();
      const email = user.email.toLowerCase();
      return name.includes(searchTerm) || email.includes(searchTerm);
    });
  }, [users, searchQuery]);

  // Specific Stats Logic
  // Only count as active if status is strictly "Active"
  const activeUsersCount = users.filter((u) => u.status === "Active").length;
  const bannedUsersCount = users.filter((u) => u.status === "Suspended").length;

  if (usersLoading || coachesLoading || plansLoading) {
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
      </header>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard title="Total Users" value={users.length} icon={Users} color="from-blue-500 to-indigo-600" />
        <StatCard title="Active Users" value={activeUsersCount} icon={ShieldCheck} color="from-emerald-400 to-teal-600" />
        <StatCard title="Banned Users" value={bannedUsersCount} icon={ShieldAlert} color="from-red-400 to-rose-600" />
      </div>

      <section className="space-y-6">
        {/* Table Header with Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-500" />
            <h2 className="text-lg font-semibold">User Database</h2>
          </div>
          
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/50 transition"
            />
          </div>
        </div>
        
        {/* User Table */}
        <div className="card-glass overflow-hidden rounded-2xl border border-[var(--border-color)] shadow-sm">
          <div className="grid grid-cols-5 px-6 py-4 text-xs font-bold bg-[var(--bg-secondary)] border-b border-[var(--border-color)] uppercase tracking-wider text-[var(--text-secondary)]">
            <div className="col-span-2">User Details</div>
            <div>Plan</div>
            <div>Status</div>
            <div className="text-right">Manage</div>
          </div>
          
          <div className="divide-y divide-[var(--border-color)] bg-[var(--card-bg)]">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div key={user._id} className="grid grid-cols-5 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition-colors">
                  {/* User Profile & Email */}
                  <div className="col-span-2 flex items-center gap-3 min-w-0">
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-[var(--border-color)] bg-[var(--bg-tertiary)]">
                      <Image
                        src={user.image || `https://ui-avatars.com/api/?name=${user.name || user.fullName || "U"}&background=random`}
                        alt="Profile"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="truncate">
                      <p className="font-semibold truncate text-[var(--text-primary)]">
                        {user.name || user.fullName || "Guest User"}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Plan */}
                  <div className="capitalize font-medium text-[var(--text-secondary)]">
                    {user.plan || "Free"}
                  </div>

                  {/* Status Badge */}
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                      user.status === "Suspended" 
                        ? "bg-red-500/10 text-red-500 border border-red-500/20" 
                        : user.status === "Active"
                        ? "bg-green-500/10 text-green-500 border border-green-500/20"
                        : "bg-gray-500/10 text-gray-500 border border-gray-500/20"
                    }`}>
                      {user.status || "None"}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="text-right">
                    <button
                      onClick={() => userStatusMutation.mutate({ 
                        id: user._id, 
                        status: user.status === "Suspended" ? "Active" : "Suspended" 
                      })}
                      className={`px-4 py-1.5 text-xs rounded-lg font-bold transition-all active:scale-95 ${
                        user.status === "Suspended" 
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white" 
                          : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      {user.status === "Suspended" ? "Unban User" : "Ban User"}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-16 text-center">
                <div className="flex justify-center mb-3 text-gray-400">
                  <Search size={40} strokeWidth={1} />
                </div>
                <p className="text-[var(--text-secondary)] font-medium">No users found matching your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: LucideIcon; color: string }) {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-6 flex items-center justify-between border border-[var(--border-color)] shadow-sm hover:shadow-md transition-all duration-300 group">
      <div>
        <p className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">{title}</p>
        <h3 className="mt-2 text-3xl font-black tracking-tight">{value}</h3>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} />
      </div>
    </div>
  );
}