"use client";

import { useState } from "react";
import { Users, DollarSign, Clock, RefreshCcw, Loader2, LucideIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import SubscriptionPlansGrid, { PlanItem } from "@/components/dashboard/admin/SubscriptionPlansGrid";
import TransactionsTable, { Transaction } from "@/components/dashboard/admin/TransactionsTable";

export default function PaymentsSubscriptionsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, price, duration }: { id: string; price: number | string; duration: string }) =>
      axios.patch("/api/admin/plans", { id, price, duration }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-plans"] });
      toast.success("Plan updated successfully!");
    },
    onError: () => toast.error("Failed to update the plan."),
  });

  const { data: plans, isLoading: plansLoading } = useQuery<PlanItem[]>({
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
    onError: () => toast.error("Something went wrong while processing the refund."),
  });

  const handleEdit = (plan: PlanItem) => {
    Swal.fire({
      title: `Update ${plan.name} Plan`,
      background: "#1f2937",
      color: "#f3f4f6",
      customClass: {
        popup: "rounded-2xl border border-gray-700 shadow-2xl",
        confirmButton: "rounded-xl px-6 py-2 font-bold",
        cancelButton: "rounded-xl px-6 py-2 font-bold",
      },
      html: `
        <div style="text-align: left; padding: 10px; font-family: inherit;">
          <div style="margin-bottom: 15px;">
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #9ca3af; font-weight: 600;">Price (৳)</label>
            <input id="swal-price" type="number" value="${plan.price}" 
              style="width: 100%; padding: 12px; background: #111827; border: 1px solid #374151; color: white; border-radius: 12px; outline: none;">
          </div>
          <div>
            <label style="display: block; margin-bottom: 8px; font-size: 14px; color: #9ca3af; font-weight: 600;">Duration</label>
            <input id="swal-duration" value="${plan.duration}" 
              style="width: 100%; padding: 12px; background: #111827; border: 1px solid #374151; color: white; border-radius: 12px; outline: none;">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Save Changes",
      preConfirm: () => {
        const price = (document.getElementById("swal-price") as HTMLInputElement).value;
        const duration = (document.getElementById("swal-duration") as HTMLInputElement).value;
        if (!price || !duration) Swal.showValidationMessage("Both fields are required");
        return { price, duration };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        updatePlanMutation.mutate({ id: plan._id, price: result.value.price, duration: result.value.duration });
      }
    });
  };

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
      color: "var(--text-primary)",
    }).then((result) => {
      if (result.isConfirmed) refundMutation.mutate(id);
    });
  };

  const filteredTransactions = paymentData?.transactions?.filter(
    (t: Transaction) =>
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.transactionId.toLowerCase().includes(search.toLowerCase())
  );

  if (plansLoading || paymentsLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--bg-primary)]">
        <Loader2 className="animate-spin text-[var(--primary)]" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 lg:space-y-16 min-h-screen text-[var(--text-primary)]">
      <title>Payments Subscriptions | Dashboard - Flexify</title>
      <div>
        <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
          Payments & Subscriptions
        </h1>
        <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
          Manage revenue, active plans, and user transactions
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
        <PaymentStatCard title="Total Users" value={paymentData?.summary.totalUsers} Icon={Users} color="from-blue-500 to-indigo-600" />
        <PaymentStatCard title="Paid" value={paymentData?.summary.paidCount} Icon={DollarSign} color="from-emerald-400 to-green-600" />
        <PaymentStatCard title="Pending" value={paymentData?.summary.pendingCount} Icon={Clock} color="from-yellow-400 to-orange-500" />
        <PaymentStatCard title="Refunded" value={paymentData?.summary.refundedCount} Icon={RefreshCcw} color="from-red-400 to-pink-500" />
      </div>

      <SubscriptionPlansGrid
        plans={plans}
        onEdit={handleEdit}
        isUpdating={updatePlanMutation.isPending}
        updatingPlanId={updatePlanMutation.variables?.id}
      />

      <TransactionsTable
        transactions={filteredTransactions}
        search={search}
        setSearch={setSearch}
        onRefund={handleRefund}
        isRefunding={refundMutation.isPending}
      />
    </div>
  );
}

function PaymentStatCard({ title, value, Icon, color }: { title: string; value: number | string | undefined; Icon: LucideIcon; color: string }) {
  return (
    <div className="relative overflow-hidden card-glass p-5 flex items-center justify-between group transition-all duration-300 border border-[var(--border-color)] hover:shadow-lg">
      <div className="relative z-10">
        <p className="text-xs text-[var(--text-secondary)] font-bold uppercase tracking-widest">{title}</p>
        <h2 className="mt-1 text-3xl font-black">{value || 0}</h2>
      </div>
      <div className={`relative z-10 p-4 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg transform group-hover:rotate-12 transition-transform`}>
        <Icon size={24} />
      </div>
      <div className="absolute -bottom-3 -right-3 pointer-events-none transition-transform duration-500 ease-out group-hover:scale-110 group-hover:-rotate-6 select-none opacity-[0.08] dark:opacity-[0.12] text-[var(--text-primary)]">
        <Icon size={80} strokeWidth={1.5} />
      </div>
    </div>
  );
}
