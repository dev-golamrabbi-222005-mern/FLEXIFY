"use client";

import { useState } from "react";
import { CreditCard, Search, RefreshCcw } from "lucide-react";

type Plan = {
  id: number;
  name: string;
  price: number;
  duration: string;
};

type Transaction = {
  id: number;
  user: string;
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
      amount: 19,
      status: "Paid",
      date: "10 Mar 2026",
    },
    {
      id: 2,
      user: "Karim Hasan",
      amount: 9,
      status: "Pending",
      date: "09 Mar 2026",
    },
    {
      id: 3,
      user: "Mahmud Hasan",
      amount: 49,
      status: "Paid",
      date: "08 Mar 2026",
    },
  ]);

  const refundPayment = (id: number) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: "Refunded" } : t
      )
    );
  };

  const filteredTransactions = transactions.filter((t) =>
    t.user.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">

      {/* PAGE HEADER */}

      <div className="flex items-center gap-3">
        <CreditCard size={28} />
        <h1 className="text-2xl md:text-3xl font-bold">
          Payments & Subscriptions
        </h1>
      </div>

      {/* ================= PLANS ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <h2 className="text-xl font-semibold mb-6">
          Subscription Plans
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {plans.map((plan) => (

            <div
              key={plan.id}
              className="border rounded-xl p-6 flex flex-col gap-3"
            >

              <h3 className="text-lg font-semibold">
                {plan.name}
              </h3>

              <p className="text-3xl font-bold">
                ${plan.price}
              </p>

              <p className="text-sm text-gray-500">
                {plan.duration}
              </p>

              <button className="mt-3 bg-[var(--primary)] text-white py-2 rounded-lg">
                Edit Plan
              </button>

            </div>

          ))}

        </div>

      </section>

      {/* ================= TRANSACTIONS ================= */}

      <section className="bg-[var(--card-bg)] p-6 md:p-8 rounded-2xl shadow">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <h2 className="text-xl font-semibold">
            Transactions
          </h2>

          <div className="relative max-w-sm">

            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <input
              type="text"
              placeholder="Search user..."
              className="w-full border rounded-lg pl-10 pr-4 py-2"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead className="border-b bg-gray-50">

              <tr>
                <th className="p-4 text-sm font-semibold">User</th>
                <th className="p-4 text-sm font-semibold">Amount</th>
                <th className="p-4 text-sm font-semibold">Date</th>
                <th className="p-4 text-sm font-semibold">Status</th>
                <th className="p-4 text-sm font-semibold">Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredTransactions.map((t) => (

                <tr key={t.id} className="border-b">

                  <td className="p-4 font-medium">
                    {t.user}
                  </td>

                  <td className="p-4">
                    ${t.amount}
                  </td>

                  <td className="p-4 text-gray-500">
                    {t.date}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs
                      ${
                        t.status === "Paid"
                          ? "bg-green-100 text-green-600"
                          : t.status === "Pending"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {t.status}
                    </span>

                  </td>

                  <td className="p-4">

                    {t.status === "Paid" && (

                      <button
                        onClick={() => refundPayment(t.id)}
                        className="flex items-center gap-2 text-red-600"
                      >
                        <RefreshCcw size={16} />
                        Refund
                      </button>

                    )}

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </section>

    </div>
  );
}