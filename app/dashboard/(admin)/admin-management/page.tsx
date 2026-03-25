"use client";

import { Users, CreditCard, UserCheck, Loader2, X, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Coach } from "@/types/coach";

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
  plan?: string;
  status: "Active" | "Suspended";
}

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

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

  const updatePlanMutation = useMutation({
    mutationFn: async (updatedData: Plan) => await axios.patch("/api/admin/plans", updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      setEditingPlan(null);
      Swal.fire("Success", "Plan updated successfully", "success");
    },
  });

  const userStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => 
      await axios.patch("/api/admin/users", { id, status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
  });

  if (usersLoading || coachesLoading || plansLoading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-500" size={40} /></div>;
  }

  return (
    <div className="space-y-10 min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <title>Flexify | Admin | Management</title>
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">Platform management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value={users.length} icon={Users} color="from-blue-500 to-indigo-600" />
        <StatCard title="Pending Coaches" value={coaches.length} icon={UserCheck} color="from-orange-400 to-rose-500" />
        <StatCard title="Active Plans" value={plans.length} icon={CreditCard} color="from-emerald-400 to-teal-600" />
      </div>

      <section className="space-y-4">
        <div className="flex items-center gap-2"><Users size={18}/><h2 className="font-semibold">User Management</h2></div>
        <div className="card-glass overflow-hidden rounded-xl border border-[var(--border-color)]">
          <div className="grid grid-cols-4 px-6 py-3 text-xs font-bold bg-[var(--bg-secondary)] border-b border-[var(--border-color)] uppercase text-[var(--text-secondary)]">
            <div>Name</div><div>Plan</div><div>Status</div><div className="text-right">Action</div>
          </div>
          <div className="divide-y divide-[var(--border-color)]">
            {users.map((user) => (
              <div key={user._id} className="grid grid-cols-4 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition">
                <div className="font-medium truncate pr-2">{user.name || user.fullName}</div>
                <div className="capitalize">{user.plan || "Free"}</div>
                <div><span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${user.status === "Suspended" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"}`}>{user.status || "Active"}</span></div>
                <div className="text-right">
                  <button 
                    onClick={() => userStatusMutation.mutate({ id: user._id, status: user.status === "Suspended" ? "Active" : "Suspended" })} 
                    className={`px-3 py-1 text-xs rounded-lg font-medium transition ${user.status === "Suspended" ? "text-green-500 hover:bg-green-500/10" : "text-red-500 hover:bg-red-500/10"}`}
                  >
                    {user.status === "Suspended" ? "Unban" : "Ban"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] w-full max-w-md rounded-2xl p-6 border border-[var(--border-color)] shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Edit Plan</h2>
              <button onClick={() => setEditingPlan(null)} className="text-[var(--text-secondary)] hover:text-white"><X size={20}/></button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); updatePlanMutation.mutate(editingPlan); }} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)]">Plan Name</label>
                <input type="text" value={editingPlan.name} onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-[var(--text-secondary)]">Monthly Price (৳)</label>
                <input type="number" value={editingPlan.price} onChange={(e) => setEditingPlan({...editingPlan, price: Number(e.target.value)})} className="w-full bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500 transition" />
              </div>
              <button type="submit" disabled={updatePlanMutation.isPending} className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition flex justify-center items-center">
                {updatePlanMutation.isPending ? <Loader2 className="animate-spin" size={20} /> : "Update Plan"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: number | string; icon: LucideIcon; color: string }) {
  return (
    <div className="bg-[var(--card-bg)] rounded-2xl p-5 flex items-center justify-between border border-[var(--border-color)] shadow-sm hover:shadow-md transition cursor-default">
      <div>
        <p className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-black mt-1 leading-none">{value}</h3>
      </div>
      <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg shadow-black/10`}><Icon size={22} /></div>
    </div>
  );
}