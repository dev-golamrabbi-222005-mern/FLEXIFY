"use client";

import { Users, CreditCard, UserCheck } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  /* ================= USER DATA ================= */
  const [users, setUsers] = useState([
    { id: 1, name: "Rahim", plan: "Basic", status: "Active" },
    { id: 2, name: "Karim", plan: "Pro", status: "Active" },
    { id: 3, name: "Jony", plan: "Premium", status: "Suspended" },
  ]);

  const suspendUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Suspended" } : u));
  };

  const activateUser = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: "Active" } : u));
  };

  /* ================= COACH DATA ================= */
  const { data: coaches = [], refetch: refetchCoaches } = useQuery({
    queryKey: ["coaches"],
    queryFn: async () => {
      const res = await axios.get("/api/coach?status=pending");
      return res.data;
    },
  });

  const approveCoach = async (id: string, email: string) => {
    try {
      await axios.patch("/api/coach/status", { id, email, status: "approved" });
      refetchCoaches();
      Swal.fire("Approved", "Coach approved successfully", "success");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const rejectCoach = async (id: string) => {
    try {
      await axios.patch("/api/coach/reject", { id, status: "rejected" });
      refetchCoaches();
      Swal.fire("Rejected", "Coach rejected", "success");
    } catch (error: any) {
      Swal.fire("Error", error.message, "error");
    }
  };

  /* ================= PLAN DATA ================= */
  const [plans] = useState([
    { id: 1, name: "Basic", price: 10 },
    { id: 2, name: "Pro", price: 25 },
    { id: 3, name: "Premium", price: 50 },
  ]);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">

      {/* ================= HEADER ================= */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-wide">Admin Dashboard</h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage users, coaches & subscriptions easily
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Users</p>
            <h3 className="text-2xl font-bold">{users.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Pending Coaches</p>
            <h3 className="text-2xl font-bold">{coaches.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-orange-400 to-pink-500 text-white">
            <UserCheck size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Plans</p>
            <h3 className="text-2xl font-bold">{plans.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white">
            <CreditCard size={22} />
          </div>
        </div>

      </div>

      {/* ================= USER MANAGEMENT ================= */}
      <section className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <Users size={20} />
          <h2 className="text-xl font-semibold">User Management</h2>
        </div>

        <div className="card-glass overflow-hidden">
          <div className="grid grid-cols-4 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
            <div>Name</div>
            <div>Plan</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {users.map((user) => (
              <div key={user.id} className="grid grid-cols-4 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition">
                <div className="font-medium">{user.name}</div>
                <div>{user.plan}</div>
                <div>
                  <span className={`px-2 py-1 rounded-full text-xs ${user.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"}`}>
                    {user.status}
                  </span>
                </div>
                <div className="text-right">
                  {user.status === "Active" ? (
                    <button
                      onClick={() => suspendUser(user.id)}
                      className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30"
                    >
                      Ban
                    </button>
                  ) : (
                    <button
                      onClick={() => activateUser(user.id)}
                      className="px-3 py-1 text-xs rounded-md bg-green-500/20 text-green-500 hover:bg-green-500/30"
                    >
                      Activate
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COACH REQUEST ================= */}
      <section className="my-8">
        <div className="flex items-center gap-2 mb-4">
          <UserCheck size={20} />
          <h2 className="text-xl font-semibold">Coach Requests</h2>
        </div>

        <div className="card-glass overflow-hidden">
          <div className="grid grid-cols-3 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
            <div>Email</div>
            <div>Status</div>
            <div className="text-right">Action</div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {coaches.map((coach: any) => (
              <div key={coach._id} className="grid grid-cols-3 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition">
                <div>{coach.email}</div>
                <div className="text-yellow-500">Pending</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => approveCoach(coach._id, coach.email)}
                    className="px-3 py-1 text-xs rounded-md bg-green-500/20 text-green-500 hover:bg-green-500/30"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => rejectCoach(coach._id)}
                    className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SUBSCRIPTION PLAN ================= */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <CreditCard size={20} />
          <h2 className="text-xl font-semibold">Subscription Plans</h2>
        </div>

        <div className="card-glass overflow-hidden">
          <div className="grid grid-cols-3 gap-6 px-6 py-3 text-sm font-semibold border-b border-[var(--border-color)] text-[var(--text-secondary)]">
            <div>Plan</div>
            <div>Price</div>
            <div className="text-right">Actions</div>
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {plans.map((plan) => (
              <div key={plan.id} className="grid grid-cols-3 gap-6 px-6 py-4 items-center text-sm hover:bg-[var(--bg-tertiary)] transition">
                <div className="font-medium">{plan.name}</div>
                <div>${plan.price} / month</div>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => Swal.fire("Edit Plan", `Edit ${plan.name}`, "info")}
                    className="px-3 py-1 text-xs rounded-md bg-blue-500/20 text-blue-500 hover:bg-blue-500/30"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => Swal.fire("Deleted", `${plan.name} deleted`, "success")}
                    className="px-3 py-1 text-xs rounded-md bg-red-500/20 text-red-500 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}