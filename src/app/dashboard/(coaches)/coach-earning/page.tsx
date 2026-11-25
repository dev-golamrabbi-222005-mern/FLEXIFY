"use client";

import { useQuery } from "@tanstack/react-query";
import React from "react";
import axios from "axios";
import { CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import EarningsOverviewStats from "@/components/dashboard/coach-earning/EarningsOverviewStats";
import EarningsChartSection from "@/components/dashboard/coach-earning/EarningsChartSection";
import RecentPaymentsList, { PaymentItem } from "@/components/dashboard/coach-earning/RecentPaymentsList";

export default function CoachEarnings() {
  const { data: session } = useSession();

  const { data: trainees = [] } = useQuery({
    queryKey: ["trainees"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/coach-users?coachId=${session?.user?.id}`);
      return res?.data;
    },
  });

  const { data: weeklyNewUsers } = useQuery({
    queryKey: ["weeklyNewUsers"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/new-users-weekly?coachId=${session?.user?.id}`);
      return res?.data;
    },
  });

  const { data: monthlyEarnings = [] } = useQuery({
    queryKey: ["monthlyEarnings"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/earnings?coachId=${session?.user?.id}`);
      return res?.data;
    },
  });

  const { data: allTransactions = [] } = useQuery<PaymentItem[]>({
    queryKey: ["allTransactions"],
    queryFn: async () => {
      const res = await axios.get(`/api/coach/user-payments?coachId=${session?.user?.id}`);
      const rawPayments = res?.data ?? [];
      return rawPayments.map((p: any) => ({
        user: {
          name: p?.user?.name || "Unknown",
          planName: p?.user?.planName || "Unknown",
          imageUrl: p?.user?.imageUrl || "/default-avatar.png",
        },
        totalPaid: `৳${Number(p?.totalPaid ?? 0).toLocaleString()}`,
        status: (p?.status as "success" | "failed" | "pending") || "success",
      }));
    },
  });

  const recentPayments = allTransactions.slice(0, 5);
  const thisMonthTotal = monthlyEarnings?.[monthlyEarnings.length - 1]?.total;

  return (
    <div className="min-h-screen max-w-full">
      <div className="mx-auto space-y-8 md:space-y-12 lg:space-y-16 max-w-7xl">
        <title>Earning | Dashboard - Flexify</title>
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl tracking-tight uppercase text-[var(--text-primary)]">
              Earnings
            </h1>
            <p className="leading-relaxed mt-2 text-[var(--text-secondary)]">
              Overview of your financial performance and subscriptions.
            </p>
          </div>
          <button className="flex items-center gap-2 btn-primary">
            <CreditCard size={16} /> Withdraw Funds
          </button>
        </div>

        <EarningsOverviewStats
          thisMonthTotal={thisMonthTotal}
          totalClients={trainees?.length || 0}
          newUsersThisWeek={weeklyNewUsers?.newUsersThisWeek}
        />

        <div className="grid gap-8 lg:grid-cols-5">
          <EarningsChartSection monthlyEarnings={monthlyEarnings} />
          <RecentPaymentsList payments={recentPayments} />
        </div>
      </div>
    </div>
  );
}
