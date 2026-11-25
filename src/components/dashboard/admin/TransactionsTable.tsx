"use client";

import React from "react";
import { DollarSign, Search, RefreshCcw } from "lucide-react";

export interface Transaction {
  _id: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: string;
  createdAt: string;
  transactionId: string;
}

interface TransactionsTableProps {
  transactions?: Transaction[];
  search: string;
  setSearch: (v: string) => void;
  onRefund: (id: string) => void;
  isRefunding: boolean;
}

export default function TransactionsTable({
  transactions,
  search,
  setSearch,
  onRefund,
  isRefunding,
}: TransactionsTableProps) {
  return (
    <section>
      <div className="flex flex-col items-start justify-between gap-4 mb-6 md:flex-row md:items-center">
        <h2 className="flex items-center gap-2 text-xl font-bold">
          <DollarSign className="text-green-500" /> Recent Transactions
        </h2>
        <div className="relative w-full md:w-72">
          <Search className="absolute text-gray-400 -translate-y-1/2 left-3 top-1/2" size={18} />
          <input
            type="text"
            placeholder="Search by name or TxID..."
            className="w-full bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl pl-10 pr-4 py-2 focus:ring-2 ring-[var(--primary)] outline-none transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {transactions?.map((t) => (
          <div
            key={t._id}
            className="card-glass p-4 flex flex-wrap items-center justify-between gap-4 border border-[var(--border-color)] hover:border-[var(--primary)] transition"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[var(--bg-tertiary)] rounded-full flex items-center justify-center font-bold text-[var(--primary)] text-lg">
                {t.userName.charAt(0)}
              </div>
              <div>
                <p className="font-bold">{t.userName}</p>
                <p className="text-xs text-[var(--text-secondary)] font-mono">{t.transactionId}</p>
              </div>
            </div>

            <div className="text-right md:text-left min-w-[100px]">
              <p className="text-lg font-black">৳{t.amount}</p>
              <p className="text-xs text-[var(--text-secondary)]">
                {new Date(t.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span
                className={`px-4 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${
                  t.status === "success"
                    ? "bg-green-500/10 text-green-500"
                    : t.status === "pending"
                      ? "bg-yellow-500/10 text-yellow-500"
                      : "bg-red-500/10 text-red-500"
                }`}
              >
                {t.status}
              </span>

              {t.status === "success" && (
                <button
                  onClick={() => onRefund(t._id)}
                  className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                  title="Refund"
                >
                  <RefreshCcw size={18} className={isRefunding ? "animate-spin" : ""} />
                </button>
              )}
            </div>
          </div>
        ))}

        {transactions?.length === 0 && (
          <div className="text-center py-10 text-[var(--text-secondary)]">
            No transactions found matching your search.
          </div>
        )}
      </div>
    </section>
  );
}
