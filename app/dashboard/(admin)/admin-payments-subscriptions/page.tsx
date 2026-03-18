"use client";

import { useState } from "react";
import {
  Users,
  CreditCard,
  DollarSign,
  Clock,
  RefreshCcw,
  Search,
} from "lucide-react";

type Plan = {
  id: number;
  name: string;
  price: number;
  duration: string;
};

type Transaction = {
  id: number;
  user: string;
  avatar: string;
  amount: number;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
};

export default function PaymentsSubscriptionsPage() {
  const [search, setSearch] = useState("");

  const [plans] = useState<Plan[]>([
    { id: 1, name: "Basic Plan", price: 9, duration: "Monthly" },
    { id: 2, name: "Pro Plan", price: 19, duration: "Monthly" },
    { id: 3, name: "Elite Plan", price: 49, duration: "Yearly" },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: 1,
      user: "Rahim Uddin",
      avatar: "/avatars/rahim.jpg",
      amount: 19,
      status: "Paid",
      date: "10 Mar 2026",
    },
    {
      id: 2,
      user: "Karim Hasan",
      avatar: "/avatars/karim.jpg",
      amount: 9,
      status: "Pending",
      date: "09 Mar 2026",
    },
    {
      id: 3,
      user: "Mahmud Hasan",
      avatar: "/avatars/mahmud.jpg",
      amount: 49,
      status: "Paid",
      date: "08 Mar 2026",
    },
  ]);

  const refundPayment = (id: number) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: "Refunded" } : t)),
    );
  };

  const filteredTransactions = transactions.filter((t) =>
    t.user.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPaid = transactions.filter((t) => t.status === "Paid").length;
  const totalPending = transactions.filter(
    (t) => t.status === "Pending",
  ).length;
  const totalRefunded = transactions.filter(
    (t) => t.status === "Refunded",
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10 bg-[var(--bg-primary)] min-h-screen">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">
          Payments & Subscriptions
        </h1>
        <p className="text-sm text-[var(--text-secondary)]">
          Manage plans, transactions & users easily
        </p>
      </div>

      {/* ================= SUMMARY CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Total Users</p>
            <h3 className="text-2xl font-bold">{transactions.length}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Paid</p>
            <h3 className="text-2xl font-bold">{totalPaid}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-green-400 to-emerald-600 text-white">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Pending</p>
            <h3 className="text-2xl font-bold">{totalPending}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
            <Clock size={22} />
          </div>
        </div>

        <div className="bg-[var(--card-bg)] rounded-2xl shadow-md p-5 hover:shadow-xl transition flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Refunded</p>
            <h3 className="text-2xl font-bold">{totalRefunded}</h3>
          </div>
          <div className="p-3 rounded-xl bg-gradient-to-r from-red-400 to-pink-500 text-white">
            <DollarSign size={22} />
          </div>
        </div>
      </div>

      {/* ================= PLANS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <CreditCard /> Subscription Plans
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan, idx) => {
            const gradients = [
              "from-blue-500 to-indigo-500",
              "from-green-400 to-emerald-600",
              "from-orange-400 to-pink-500",
            ];
            return (
              <div
                key={plan.id}
                className="bg-[var(--card-bg)] rounded-2xl shadow-md p-6 hover:shadow-xl transition flex flex-col gap-3"
              >
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="text-3xl font-bold">${plan.price}</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  {plan.duration}
                </p>

                {/* Updated Edit Plan Button */}
                <button
                  className="flex items-center gap-2 bg-[var(--primary)] text-white px-6 py-3 rounded-lg hover:opacity-90 transition"
                >
                  Edit Plan
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= TRANSACTIONS ================= */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <DollarSign /> Transactions
        </h2>

        <div className="mb-4 relative max-w-sm w-full md:w-64">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search user..."
            className="w-full border rounded-lg pl-10 pr-4 py-2 bg-[var(--card-bg)]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="grid md:grid-cols-1 gap-4">
          {filteredTransactions.map((t) => (
            <div
              key={t.id}
              className="p-4 rounded-2xl bg-[var(--card-bg)] shadow-md hover:shadow-xl transition flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.user}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{t.user}</span>
                  <span className="text-[var(--text-secondary)] text-sm">
                    ${t.amount} • {t.date}
                  </span>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-xs rounded-full
                ${t.status === "Paid" ? "bg-green-100 text-green-600" : t.status === "Pending" ? "bg-yellow-100 text-yellow-600" : "bg-red-100 text-red-600"}`}
              >
                {t.status}
              </span>

              {t.status === "Paid" && (
                <button
                  onClick={() => refundPayment(t.id)}
                  className="flex items-center gap-2 text-red-600 text-sm"
                >
                  <RefreshCcw size={16} /> Refund
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
