"use client";

import { useState } from "react";
import { Users, CreditCard, DollarSign, Clock, RefreshCcw, Search, Loader2, Edit, Trash2, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

// টাইপ ডিফিনিশন
interface Plan {
  _id: string;
  name: string;
  price: number;
  duration: string;
}

interface Transaction {
  _id: string;
  userName: string;
  userEmail: string;
  amount: number;
  status: string;
  createdAt: string;
  transactionId: string;
}

interface StatCardProps {
  title: string;
  value: number | string | undefined;
  Icon: LucideIcon;
  color: string;
}

export default function PaymentsSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [visibleDays, setVisibleDays] = useState(7);

  const { data: plans, isLoading: plansLoading } = useQuery<Plan[]>({
    queryKey: ["admin-plans"],
    queryFn: async () => (await axios.get("/api/admin/plans")).data,
  });

  const { data: paymentData, isLoading: paymentsLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => (await axios.get("/api/admin/payments")).data,
  });

  const refundMutation = useMutation({
    mutationFn: async (id: string) => axios.patch("/api/admin/payments", { id, status: "refunded" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-payments"] });
      toast.success("The payment has been marked as refunded.");
    },
    onError: () => {
      toast.error("Something went wrong while processing the refund.");
    }
  });

  const handleRefund = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to mark this payment as refunded?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, refund it!",
      background: "var(--bg-secondary)",
      color: "var(--text-primary)"
    }).then((result) => {
      if (result.isConfirmed) {
        refundMutation.mutate(id);
      }
    });
  };

  if (plansLoading || paymentsLoading) return (
    <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
      <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
    </div>
  );

  // Recent Transactions: last 7 days by default
  const now = new Date();
  const filteredTransactions = paymentData?.transactions?.filter((t: Transaction) => {
    const createdDate = new Date(t.createdAt);
    const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff < visibleDays &&
      (t.userName.toLowerCase().includes(search.toLowerCase()) || t.transactionId.toLowerCase().includes(search.toLowerCase()));
  });

  const totalRevenue = paymentData?.transactions?.reduce((acc: number, t: Transaction) => {
    return t.status === "success" ? acc + t.amount : acc;
  }, 0) || 0;

  return (
    <div className="space-y-10 bg-[var(--bg-primary)] min-h-screen text-[var(--text-primary)]">
      <title>Payments Subscriptions | Dashboard - Flexify</title>
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">Payments & Subscriptions</h1>
        <p className="text-[var(--text-secondary)]">Manage revenue, active plans, and user transactions</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Revenue" value={`৳${totalRevenue}`} Icon={DollarSign} color="from-purple-400 to-purple-600" />
        <StatCard title="Paid" value={paymentData?.summary.paidCount} Icon={DollarSign} color="from-emerald-400 to-green-600" />
        <StatCard title="Pending" value={paymentData?.summary.pendingCount} Icon={Clock} color="from-yellow-400 to-orange-500" />
        <StatCard title="Refunded" value={paymentData?.summary.refundedCount} Icon={RefreshCcw} color="from-red-400 to-pink-500" />
      </div>

      {/* SUBSCRIPTION PLANS */}
      <section>
        <h2 className="flex items-center gap-2 mb-6 text-xl font-bold">
          <CreditCard className="text-[var(--primary)]" /> Subscription Plans
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans?.map((plan) => (
            <div key={plan._id} className="card-glass p-6 flex flex-col gap-4 border border-[var(--border-color)] group hover:border-[var(--primary)] transition-all">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-bold tracking-wider uppercase">{plan.name}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-[var(--primary)] text-white rounded">{plan.duration}</span>
              </div>
              <p className="text-4xl font-black">৳{plan.price}</p>
              <div className="flex gap-2 mt-4">
                <button className="flex-1 flex items-center justify-center gap-2 bg-[var(--bg-tertiary)] py-2 rounded-lg hover:bg-[var(--primary)] hover:text-white transition duration-300">
                  <Edit size={16} /> Edit
                </button>
                <button className="p-2 text-red-500 transition rounded-lg hover:bg-red-500/10">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRANSACTIONS TABLE */}
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
          {filteredTransactions?.map((t: Transaction) => (
            <div key={t._id} className="card-glass p-4 flex flex-wrap items-center justify-between gap-4 border border-[var(--border-color)] hover:border-[var(--primary)] transition">
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
                <p className="text-xs text-[var(--text-secondary)]">{new Date(t.createdAt).toLocaleDateString('en-GB')}</p>
              </div>

              <div className="flex items-center gap-4">
                <span className={`px-4 py-1 text-[10px] font-black rounded-full uppercase tracking-tighter ${
                  t.status === "success" ? "bg-green-500/10 text-green-500" : 
                  t.status === "pending" ? "bg-yellow-500/10 text-yellow-500" : "bg-red-500/10 text-red-500"
                }`}>
                  {t.status}
                </span>

                {t.status === "success" && (
                  <button 
                    onClick={() => handleRefund(t._id)}
                    className="p-2 text-[var(--text-secondary)] hover:text-red-500 transition-colors"
                    title="Refund"
                  >
                    <RefreshCcw size={18} className={refundMutation.isPending ? "animate-spin" : ""} />
                  </button>
                )}
              </div>
            </div>
          ))}

          {filteredTransactions?.length === 0 && (
            <div className="text-center py-10 text-[var(--text-secondary)]">
              No transactions found matching your search.
            </div>
          )}
        </div>

        {/* Load More Button */}
        {paymentData?.transactions?.length > visibleDays && (
          <div className="flex justify-center mt-6">
            <button 
              className="px-6 py-2 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary)/90] transition"
              onClick={() => setVisibleDays(prev => prev + 7)}
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

// StatCard Component with proper typing
function StatCard({ title, value, Icon, color }: StatCardProps) {
  return (
    <div className="card-glass flex items-center justify-between group hover:border-[var(--primary)] transition-all duration-300">
      <div>
        <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="text-3xl font-black mt-1">{value}</h2>
      </div>
      <div className={`p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transform group-hover:scale-110 transition-transform`}>
        <Icon size={26} />
      </div>
    </div>
  );
}