"use client";

import { CreditCard, Settings, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ObjectId } from "mongodb";
import Swal from "sweetalert2";

export default function AdminManagementSection() {
  const [users, setUsers] = useState([
    { id: 1, name: "Rahim", plan: "Basic", status: "Active" },
    { id: 2, name: "Karim", plan: "Pro", status: "Active" },
    { id: 3, name: "Jony", plan: "Premium", status: "Suspended" },
  ]);

  // const [coaches, setCoaches] = useState([
  //   { id: 1, name: "Coach A", status: "Pending" },
  //   { id: 2, name: "Coach B", status: "Pending" },
  // ]);

  const {data: coaches = []} = useQuery({
    queryKey: ["coaches"],
    queryFn: async() => {
      const res = await axios.get("/api/coach?status=pending");
      return res.data;
    }
  });

  console.log(coaches);

  const [plans, setPlans] = useState([
    { id: 1, name: "Basic", price: 10 },
    { id: 2, name: "Pro", price: 25 },
    { id: 3, name: "Premium", price: 50 },
  ]);

  const suspendUser = (id: number) => {
    setUsers(users.map(u =>
      u.id === id ? { ...u, status: "Suspended" } : u
    ));
  };

  const approveCoach = (id: ObjectId, email: string) => {
    try{
      axios.patch("/api/coach/approve", {
        id, email,
        status: "approved"
      });
      Swal.fire("Approved", "Coach approved by admin", "success");
    }
    catch(error){
      Swal.fire("Error", error.message, "error");
    }
  };

  const rejectCoach = (id: ObjectId) => {
    try{
      axios.patch("/api/coach/approve", {
        id,
        status: "rejected"
      });
      Swal.fire("Rejected", "Coach rejected by admin", "success");
    }
    catch(error){
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="mx-auto bg-[var(--bg-primary)] px-2 md:px-4 space-y-8">

      {/* ================= USER MANAGEMENT ================= */}
      <section className="bg-[var(--card-bg)] p-2 rounded-2xl shadow">
        <div className="flex items-center gap-3 mb-6">
            <Users />
        <h2 className="mb-4 text-xl font-bold"> User Management</h2>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="py-2">Name</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b">
                <td className="py-3">{user.name}</td>
                <td>{user.plan}</td>
                <td>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-100 text-red-600"
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button
                    onClick={() => suspendUser(user.id)}
                    className="text-sm text-red-500"
                  >
                    Ban
                  </button>
                  <button className="text-sm text-blue-500">
                    Upgrade
                  </button>
                  <button className="text-sm text-gray-500">
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= COACH MANAGEMENT ================= */}
      <section className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <h2 className="mb-4 text-xl font-bold">🧑‍🏫 Coach Management</h2>

        {coaches.map(coach => (
          <div
            key={coach._id}
            className="flex items-center justify-between py-3 border-b"
          >
            <span>{coach.fullName}</span>
            <span>{coach.email}</span>

            <div className="space-x-3">
              <button
                onClick={() => approveCoach(coach._id, coach.email)}
                className="text-sm text-green-600"
              >
                Approve
              </button>

              <button
                onClick={() => rejectCoach(coach._id)}
                className="text-sm text-red-600"
              >
                Reject
              </button>

              <button className="text-sm text-blue-600">
                View Performance
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ================= SUBSCRIPTION CONTROL ================= */}
      <section className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">

        <div className="flex items-center gap-3 mb-6">
            <CreditCard />
        <h2 className="mb-4 text-xl font-bold">Subscription Control</h2>
        </div>

        {plans.map(plan => (
          <div
            key={plan.id}
            className="flex items-center justify-between py-3 border-b"
          >
            <div>
              <p className="font-semibold">{plan.name}</p>
              <p className="text-sm text-gray-500">${plan.price}/month</p>
            </div>

            <div className="space-x-3">
              <button className="text-sm text-blue-600">Edit</button>
              <button className="text-sm text-red-600">Delete</button>
            </div>
          </div>
        ))}

        <button className="mt-4 bg-[var(--primary)] text-white px-4 py-2 rounded-lg text-sm">
          + Create New Plan
        </button>

        <div className="mt-6">
          <h3 className="mb-2 font-semibold">Coupon System</h3>
          <input
            type="text"
            placeholder="Enter Coupon Code"
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </section>

      {/* ================= SYSTEM SETTINGS ================= */}
      <section className="bg-[var(--card-bg)] p-6 rounded-2xl shadow">
        <div className="flex items-center gap-3 mb-6">
             <Settings />
        <h2 className="mb-4 text-xl font-bold">System Settings</h2>
        </div>

        <div className="space-y-4">

          <div>
            <label className="block mb-1 text-sm font-medium">
              Email Configuration
            </label>
            <input
              type="email"
              placeholder="admin@flexify.com"
              className="w-full p-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Notification Control
            </label>
            <select className="border p-2 rounded-lg bg-[var(--card-bg)] w-full">
              <option>Enable All</option>
              <option>Only Important</option>
              <option>Disable</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Role Permission
            </label>
            <select className="border p-2 rounded-lg w-full bg-[var(--card-bg)]">
              <option>User</option>
              <option>Coach</option>
              <option>Admin</option>
            </select>
          </div>

        </div>
      </section>

    </div>
  );
}